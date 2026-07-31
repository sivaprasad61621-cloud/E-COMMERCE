import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments, uploadDocument, deleteDocument, clearKnowledgeError } from '../store/slices/knowledgeSlice';
import { FileText, Trash2, Upload, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function KnowledgeManager() {
  const dispatch = useDispatch();
  const { documentsList, loading, uploading, error } = useSelector((state) => state.knowledge);

  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [namespace, setNamespace] = useState('general');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title || !fileUrl) return;

    setSuccessMessage('');
    dispatch(clearKnowledgeError());

    const result = await dispatch(uploadDocument({
      title,
      file_url: fileUrl,
      file_type: fileType,
      namespace
    }));

    if (uploadDocument.fulfilled.match(result)) {
      setSuccessMessage('Document ingestion queued successfully!');
      setTitle('');
      setFileUrl('');
      // Reload list to see the processing document
      setTimeout(() => {
        dispatch(fetchDocuments());
      }, 1000);
    }
  };

  const handleDelete = (id, docNamespace) => {
    if (window.confirm('Are you sure you want to delete this document and clear its vectors from Pinecone?')) {
      dispatch(deleteDocument({ id, namespace: docNamespace }));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchDocuments());
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto p-4 text-[#2F2F2F]">
      
      {/* Editorial Title */}
      <div className="border-b border-[#2F2F2F]/15 pb-4 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-wide">Archives & Knowledge</h1>
          <p className="text-xs text-[#7A756B] mt-1 font-serif italic">
            Ingest corporate policies, catalog documentation, and FAQ data into the Pinecone RAG Vector Store.
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F] hover:bg-[#2F2F2F] hover:text-[#FAF8F3] transition-colors text-xs cursor-pointer"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh Registry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Column */}
        <div className="lg:col-span-1 bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-6 shadow-[4px_4px_0px_0px_#2F2F2F]">
          <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
            <Upload size={16} className="text-[#8B5E3C]" /> Ingest Document
          </h3>
          
          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A756B] mb-1 font-semibold">
                Document Title
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g., Return & Refund Policy 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F5F1E8] border-[0.5px] border-[#2F2F2F]/30 p-2 text-xs outline-none focus:border-[#8B5E3C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A756B] mb-1 font-semibold">
                Document File URL
              </label>
              <input 
                type="url" 
                required
                placeholder="https://supabase.co/storage/v1/object/public/..."
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full bg-[#F5F1E8] border-[0.5px] border-[#2F2F2F]/30 p-2 text-xs outline-none focus:border-[#8B5E3C] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A756B] mb-1 font-semibold">
                  File Format
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full bg-[#F5F1E8] border-[0.5px] border-[#2F2F2F]/30 p-2 text-xs outline-none focus:border-[#8B5E3C] cursor-pointer"
                >
                  <option value="pdf">PDF Binary</option>
                  <option value="txt">Plain Text</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A756B] mb-1 font-semibold">
                  Vector Namespace
                </label>
                <select
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="w-full bg-[#F5F1E8] border-[0.5px] border-[#2F2F2F]/30 p-2 text-xs outline-none focus:border-[#8B5E3C] cursor-pointer"
                >
                  <option value="general">general</option>
                  <option value="faqs">faqs</option>
                  <option value="policies">policies</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 font-medium">
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#2F2F2F] text-[#FAF8F3] hover:bg-[#8B5E3C] py-2.5 transition-colors uppercase font-medium cursor-pointer"
            >
              {uploading ? 'Processing & Ingesting...' : 'Index Document'}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-6 shadow-[4px_4px_0px_0px_#2F2F2F] overflow-hidden">
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <Layers size={16} className="text-[#8B5E3C]" /> Ingested Registry
            </h3>

            {documentsList.length === 0 ? (
              <div className="text-center py-12 text-[#7A756B] text-xs italic">
                No documents currently stored in the RAG repository.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2F2F2F] text-[#7A756B] uppercase font-semibold text-[10px] tracking-wider">
                      <th className="py-2.5">Title</th>
                      <th className="py-2.5">Namespace</th>
                      <th className="py-2.5">Format</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentsList.map((doc) => (
                      <tr 
                        key={doc.id}
                        className="border-b border-[#2F2F2F]/10 hover:bg-[#FAF8F3]/60 transition-colors"
                      >
                        <td className="py-3 flex items-center gap-2">
                          <FileText size={14} className="text-[#8B5E3C]" />
                          <div>
                            <div className="font-medium text-[#2F2F2F]">{doc.title}</div>
                            {doc.word_count > 0 && (
                              <div className="text-[10px] text-[#7A756B]">{doc.word_count} words</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="font-mono bg-[#F5F1E8] px-1.5 py-0.5 border border-[#2F2F2F]/10 text-[#8B5E3C] text-[10px]">
                            {doc.vector_namespace}
                          </span>
                        </td>
                        <td className="py-3 uppercase text-[10px]">{doc.file_type}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] border ${
                            doc.status === 'indexed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : doc.status === 'processing' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200' 
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {doc.status}
                          </span>
                          {doc.error_message && (
                            <div className="text-[9px] text-red-600 mt-0.5 max-w-[120px] truncate" title={doc.error_message}>
                              {doc.error_message}
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button 
                            onClick={() => handleDelete(doc.id, doc.vector_namespace)}
                            className="text-[#7A756B] hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
