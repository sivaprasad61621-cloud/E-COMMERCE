import { Pinecone } from '@pinecone-database/pinecone';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from 'dotenv';
import supabase from '../config/supabase.js';
import { memoryDocuments, documentTextCache } from './memoryStore.js';

dotenv.config();

// Initialize Pinecone Client only if API key is provided
let pinecone = null;
if (process.env.PINECONE_API_KEY) {
  try {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    console.log('[AI Service] Pinecone client initialized successfully.');
  } catch (err) {
    console.error('[AI Service] Failed to initialize Pinecone client:', err.message);
  }
} else {
  console.warn('[AI Service] WARNING: PINECONE_API_KEY is not defined. RAG features will run in mock mode.');
}

// Get the connection index
export const getVectorIndex = () => {
  if (!pinecone) {
    return null;
  }
  return pinecone.index(process.env.PINECONE_INDEX || 'velora-chatbot-index');
};

// Initialize the Embeddings Client
export function getEmbeddingsClient() {
  const provider = process.env.EMBEDDING_PROVIDER || 'openai';
  
  if (provider === 'huggingface' || !process.env.OPENAI_API_KEY) {
    console.log('[AI Service] Using Hugging Face inference embeddings client.');
    return new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY || '',
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });
  }
  
  console.log('[AI Service] Using OpenAI embeddings client.');
  return new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "text-embedding-ada-002",
  });
}

// Helper to chunk documents using standard character splitting
export function chunkText(text, chunkSize = 500, chunkOverlap = 100) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    
    // Attempt to end chunk at a paragraph or sentence boundary
    if (endIndex < text.length) {
      const boundaryIndex = text.lastIndexOf('\n', endIndex);
      if (boundaryIndex > startIndex + (chunkSize / 2)) {
        endIndex = boundaryIndex + 1;
      }
    }
    
    chunks.push(text.substring(startIndex, endIndex).trim());
    startIndex = endIndex - chunkOverlap;
    
    // Prevent infinite loop if overlap >= size
    if (chunkOverlap >= chunkSize) {
      startIndex = endIndex;
    }
  }
  
  return chunks.filter(c => c.length > 0);
}

// Ingest text chunks into Pinecone Index
export async function upsertDocumentChunks(chunks, documentId, title, namespace = 'general') {
  const index = getVectorIndex();
  if (!index) {
    console.warn('[AI Service] Pinecone index not connected. Running in Mock/Offline mode. Document chunks will only be indexed in-memory / local database fallbacks.');
    return true;
  }

  const embeddings = getEmbeddingsClient();
  const vectorList = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    const embedding = await embeddings.embedQuery(chunkText);
    
    vectorList.push({
      id: `${documentId}_chunk_${i}`,
      values: embedding,
      metadata: {
        document_id: documentId,
        text: chunkText,
        title: title,
        namespace: namespace,
        chunk_index: i
      }
    });
  }

  // Pinecone upsert request in batches of 100 vectors
  const batchSize = 100;
  for (let i = 0; i < vectorList.length; i += batchSize) {
    const batch = vectorList.slice(i, i + batchSize);
    await index.namespace(namespace).upsert(batch);
  }
  
  return true;
}

const STOP_WORDS = new Set([
  'the', 'and', 'a', 'to', 'of', 'in', 'is', 'that', 'it', 'you', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 
  'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 
  'can', 'said', 'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 
  'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into', 'has', 'look', 'two', 'more', 'write', 
  'go', 'see', 'number', 'no', 'way', 'could', 'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil', 'its', 'now', 
  'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'please', 'does', 'how', 'much', 'should', 'would', 'could',
  'offer', 'offers', 'offered'
]);

// Query Pinecone vector similarities
export async function similaritySearch(query, namespace = 'general', limit = 3) {
  const index = getVectorIndex();
  
  if (!index) {
    console.log('[AI Service] Pinecone not configured. Falling back to local database keyword matching RAG...');
    try {
      const allDocs = [];
      
      // Fetch from Supabase safely
      if (supabase) {
        try {
          const { data: docs, error } = await supabase
            .from('documents')
            .select('*')
            .eq('vector_namespace', namespace)
            .eq('status', 'indexed');
          
          if (docs && !error) {
            allDocs.push(...docs);
          }
        } catch (dbErr) {
          console.warn('[AI Service] Supabase documents query failed (table may not exist yet). Falling back to memory store.');
        }
      }
      
      // Merge with in-memory documents
      const localDocs = memoryDocuments.filter(
        d => (d.vector_namespace === namespace || namespace === 'general' || !d.vector_namespace) && d.status === 'indexed'
      );
      allDocs.push(...localDocs);
      
      if (allDocs.length === 0) return [];
      
      const matches = [];
      const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      if (queryWords.length === 0) return [];
      
      for (const doc of allDocs) {
        try {
          let text = documentTextCache.get(doc.id);
          if (!text) {
            if (doc.text) {
              text = doc.text;
              documentTextCache.set(doc.id, text);
            } else if (doc.file_url) {
              console.log(`[AI Service] Cache miss for doc ${doc.id}. Fetching from ${doc.file_url}...`);
              const res = await fetch(doc.file_url);
              if (!res.ok) continue;
              
              if (doc.file_type === 'pdf') {
                const buffer = Buffer.from(await res.arrayBuffer());
                const parser = new PDFParse({ data: buffer });
                try {
                  const result = await parser.getText();
                  text = result.text;
                } finally {
                  await parser.destroy();
                }
              } else {
                text = await res.text();
              }
              
              documentTextCache.set(doc.id, text);
            }
          }
          
          if (!text) continue;
          
          const chunks = chunkText(text, 500, 100);
          const titleLower = doc.title.toLowerCase();
          
          chunks.forEach((chunk) => {
            let score = 0;
            const chunkLower = chunk.toLowerCase();
            const chunkWords = new Set(chunkLower.split(/\W+/));
            
            queryWords.forEach(word => {
              if (chunkWords.has(word)) {
                score += 1.0; // exact match
              } else if (chunkLower.includes(word)) {
                score += 0.3; // substring fallback
              }
              
              if (titleLower.includes(word)) {
                score += 0.5; // title boost
              }
            });
            
            if (score > 0) {
              matches.push({
                score: score / queryWords.length,
                text: chunk,
                title: doc.title,
                document_id: doc.id
              });
            }
          });
        } catch (docErr) {
          console.error('[AI Service] Mock doc retrieval error:', docErr.message);
        }
      }
      
      matches.sort((a, b) => b.score - a.score);
      return matches.slice(0, limit);
    } catch (err) {
      console.error('[AI Service] Local database keyword matching failed:', err.message);
      return [];
    }
  }

  try {
    const embeddings = getEmbeddingsClient();
    const queryVector = await embeddings.embedQuery(query);
    
    const response = await index.namespace(namespace).query({
      vector: queryVector,
      topK: limit,
      includeMetadata: true
    });
    
    return response.matches.map(match => ({
      score: match.score,
      text: match.metadata?.text || '',
      title: match.metadata?.title || '',
      document_id: match.metadata?.document_id || ''
    }));
  } catch (error) {
    console.error('[AI Service] Similarity search failure:', error.message);
    return [];
  }
}
