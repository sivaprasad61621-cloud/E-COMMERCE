import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import supabase from '../config/supabase.js';
import { chunkText, upsertDocumentChunks, getVectorIndex } from '../services/aiService.js';
import { PDFParse } from 'pdf-parse';
import { memoryDocuments, documentTextCache } from '../services/memoryStore.js';

const router = express.Router();

// Helper to fetch file content
async function fetchFileContent(fileUrl) {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  return response;
}

// Ingest a document
router.post('/upload', requireAuth, requireRole(['admin']), async (req, res) => {
  const { title, file_url, file_type, namespace } = req.body;
  if (!title || !file_url || !file_type) {
    return res.status(400).json({ error: 'title, file_url, and file_type are required' });
  }

  const targetNamespace = namespace || 'general';
  let docId;
  let useInMemory = false;

  // 1. Insert pending document into Supabase DB
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title,
          file_url,
          file_type,
          status: 'processing',
          vector_namespace: targetNamespace
        })
        .select()
        .single();

      if (error) throw error;
      docId = data.id;
    } else {
      useInMemory = true;
    }
  } catch (error) {
    console.warn('[Knowledge Router] Database save failed. Falling back to memory store:', error.message);
    useInMemory = true;
  }

  if (useInMemory) {
    docId = 'mem-doc-' + Date.now() + Math.random().toString(36).substring(2, 6);
    memoryDocuments.push({
      id: docId,
      title,
      file_url,
      file_type,
      status: 'processing',
      vector_namespace: targetNamespace,
      word_count: 0,
      created_at: new Date().toISOString()
    });
  }

  // Respond immediately to avoid request timeouts during heavy embedding pipelines
  res.status(202).json({
    message: 'Document processing initiated',
    documentId: docId
  });

  // Background parsing & embedding process
  (async () => {
    try {
      console.log(`[Knowledge Job] Fetching document from ${file_url}`);
      const fileRes = await fetchFileContent(file_url);
      
      let text = '';
      if (file_type === 'pdf') {
        const buffer = Buffer.from(await fileRes.arrayBuffer());
        const parser = new PDFParse({ data: buffer });
        try {
          const result = await parser.getText();
          text = result.text;
        } finally {
          await parser.destroy();
        }
      } else {
        text = await fileRes.text();
      }

      console.log(`[Knowledge Job] Text extracted: ${text.length} chars. Chunking...`);
      const chunks = chunkText(text, 500, 100);
      console.log(`[Knowledge Job] Chunks created: ${chunks.length}. Generating embeddings & upserting...`);
      
      const success = await upsertDocumentChunks(chunks, docId, title, targetNamespace);
      
      const statusUpdate = {
        status: success ? 'indexed' : 'failed',
        word_count: text.split(/\s+/).length,
        error_message: success ? null : 'Pinecone upsert failed. Please check credentials/quota.'
      };

      if (supabase && !useInMemory) {
        try {
          await supabase
            .from('documents')
            .update(statusUpdate)
            .eq('id', docId);
          console.log('[Knowledge Job] Success! Document indexed in Supabase and Pinecone namespace:', targetNamespace);
        } catch (dbErr) {
          console.error('[Knowledge Job] DB status update failed. Writing status to memory store fallback.');
          const memDoc = memoryDocuments.find(d => d.id === docId);
          if (memDoc) Object.assign(memDoc, statusUpdate);
        }
        const memDoc = memoryDocuments.find(d => d.id === docId);
        if (memDoc) {
          Object.assign(memDoc, statusUpdate);
        }
      }
      
      // Invalidate parsed text cache
      if (documentTextCache) {
        documentTextCache.delete(docId);
      }
    } catch (err) {
      console.error('[Knowledge Job] Failed to ingest document:', err.message);
      const errorStatus = {
        status: 'failed',
        error_message: err.message
      };

      if (supabase && docId && !useInMemory) {
        try {
          await supabase
            .from('documents')
            .update(errorStatus)
            .eq('id', docId);
        } catch (dbErr) {
          const memDoc = memoryDocuments.find(d => d.id === docId);
          if (memDoc) Object.assign(memDoc, errorStatus);
        }
        const memDoc = memoryDocuments.find(d => d.id === docId);
        if (memDoc) {
          Object.assign(memDoc, errorStatus);
        }
      }

      // Invalidate parsed text cache
      if (documentTextCache) {
        documentTextCache.delete(docId);
      }
    }
  })();
});

// List documents
router.get('/documents', requireAuth, async (req, res) => {
  try {
    let dbDocs = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          dbDocs = data;
        }
      } catch (dbErr) {
        console.warn('[Knowledge Router] Supabase documents query failed. Falling back to memory store.');
      }
    }

    // Combine with memoryDocuments (prevent duplicates)
    const combined = [...memoryDocuments];
    dbDocs.forEach(dbD => {
      if (!combined.some(mD => mD.id === dbD.id)) {
        combined.unshift(dbD);
      }
    });
    
    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete('/documents/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;
  const { namespace } = req.query;

  try {
    let targetNamespace = namespace;

    // Remove from in-memory store
    const memIdx = memoryDocuments.findIndex(d => d.id === id);
    if (memIdx !== -1) {
      if (!targetNamespace) targetNamespace = memoryDocuments[memIdx].vector_namespace;
      memoryDocuments.splice(memIdx, 1);
    }

    if (supabase) {
      try {
        if (!targetNamespace) {
          const { data } = await supabase
            .from('documents')
            .select('vector_namespace')
            .eq('id', id)
            .single();
          targetNamespace = data?.vector_namespace || 'general';
        }
        await supabase.from('documents').delete().eq('id', id);
      } catch (dbErr) {
        console.warn('[Knowledge Router] Supabase document deletion failed. Continuing clean up.');
      }
    }

    if (!targetNamespace) targetNamespace = 'general';

    // Clean vectors from Pinecone
    const index = getVectorIndex();
    if (index) {
      console.log(`[Knowledge Delete] Clearing vectors for doc ${id} under namespace ${targetNamespace}`);
      await index.namespace(targetNamespace).deleteMany({
        filter: { document_id: { "$eq": id } }
      });
    }
    
    res.json({ success: true, message: 'Document and vectors deleted successfully' });
  } catch (error) {
    console.error('[Knowledge Router] Delete error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
