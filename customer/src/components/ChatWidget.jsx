import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';

// Generate session token helper
const getSessionToken = () => {
  let token = localStorage.getItem('velora_chat_session_token');
  if (!token) {
    token = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('velora_chat_session_token', token);
  }
  return token;
};

// Helper to render markdown bold (**text**) and links ([text](url)) in chat bubbles
const renderMessage = (text, isUser = false) => {
  if (!text) return '';
  const lines = text.split('\n');
  
  return lines.map((line, lineIdx) => {
    const mdRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = mdRegex.exec(line)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(line.substring(lastIndex, matchIndex));
      }
      
      if (match[1] && match[2]) {
        const linkText = match[1];
        const linkUrl = match[2];
        const isInternal = linkUrl.startsWith('/');
        parts.push(
          <a
            key={matchIndex}
            href={linkUrl}
            target={isInternal ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className={`underline font-bold transition-colors ${
              isUser 
                ? 'text-white hover:text-white/80' 
                : 'text-[#8B5E3C] hover:text-[#6C4E31]'
            }`}
          >
            {linkText}
          </a>
        );
      } else if (match[3]) {
        parts.push(
          <strong 
            key={matchIndex} 
            className={`font-extrabold ${isUser ? 'text-white' : 'text-[#2F2F2F]'}`}
          >
            {match[3]}
          </strong>
        );
      }
      
      lastIndex = mdRegex.lastIndex;
    }
    
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }
    
    return (
      <div key={lineIdx} className="min-h-[1.2em]">
        {parts.length > 0 ? parts : (line || ' ')}
      </div>
    );
  });
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const customer = useSelector((state) => state.auth.user);
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load message history on initial session load
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting message
      const nameStr = customer ? `, ${customer.fullName || 'friend'}` : '';
      setMessages([
        {
          sender: 'assistant',
          message: `Greetings${nameStr}. Welcome to the Velora E-Commerce Concierge. How may I assist you today?`,
          sources: []
        }
      ]);
    }
  }, [isOpen, customer]);

  // Scroll to bottom helper
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) {
      setInputValue('');
    }
    setError(null);

    // 1. Append User Message
    const userMessage = { sender: 'user', message: text, sources: [] };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // 2. Query Chat Server API
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionToken: getSessionToken(),
          customerId: customer?.id || null,
          namespace: 'general'
        })
      });

      if (!response.ok) {
        throw new Error('API network response error');
      }

      const data = await response.json();
      
      // 3. Append Assistant Response
      setMessages((prev) => [...prev, {
        sender: 'assistant',
        message: data.message,
        sources: data.sources || []
      }]);
    } catch (err) {
      console.error('[ChatWidget] Send error:', err);
      setError('Communication with the Concierge was interrupted.');
      setMessages((prev) => [...prev, {
        sender: 'assistant',
        message: 'I apologize, but I am currently offline. Please try again in a few moments or email support@velora.com.',
        sources: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestedPrompts = [
    "What is your return policy?",
    "Do you offer free shipping?",
    "How do I track my order?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-14 h-14 bg-[#2F2F2F] text-[#F5F1E8] border border-[#2F2F2F] hover:bg-[#8B5E3C] transition-colors duration-200 cursor-pointer shadow-[4px_4px_0px_0px_rgba(47,47,47,0.2)]"
        style={{ borderStyle: 'solid', borderWidth: '1px' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} className="relative">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8B5E3C] rounded-full animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-18 right-0 w-[380px] sm:w-[420px] h-[550px] bg-[#F5F1E8] border-[0.5px] border-[#2F2F2F] flex flex-col shadow-[8px_8px_0px_0px_#2F2F2F] overflow-hidden text-left"
          >
            {/* Header Layout */}
            <div className="bg-[#FAF8F3] border-b-[0.5px] border-[#2F2F2F] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#8B5E3C] rounded-full animate-pulse" />
                <h3 className="font-serif text-lg font-bold text-[#2F2F2F] tracking-wide">
                  Velora AI Concierge
                </h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#7A756B] hover:text-[#2F2F2F] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Message History Scroller */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 border-[0.5px] text-[13px] leading-relaxed relative ${
                      msg.sender === 'user' 
                        ? 'bg-[#2F2F2F] text-[#FAF8F3] border-[#2F2F2F]' 
                        : 'bg-[#FAF8F3] text-[#2F2F2F] border-[#2F2F2F]/20'
                    }`}
                  >
                    <div>{renderMessage(msg.message, msg.sender === 'user')}</div>
                    
                    {/* Render citations if matching found */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-[#2F2F2F]/10 flex flex-wrap gap-1.5 text-[11px] text-[#7A756B]">
                        <span className="flex items-center gap-1"><FileText size={10} /> Sources:</span>
                        {msg.sources.map((src, sIdx) => (
                          <span 
                            key={sIdx}
                            className="bg-[#F5F1E8] border border-[#2F2F2F]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#8B5E3C]"
                            title={`Relevance score: ${(src.score * 100).toFixed(0)}%`}
                          >
                            {src.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loader Typing State */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#FAF8F3] text-[#2F2F2F] border-[0.5px] border-[#2F2F2F]/20 p-3.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#8B5E3C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#8B5E3C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#8B5E3C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Inline Errors */}
              {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-3 flex items-center gap-2 text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            {messages.length === 1 && !loading && (
              <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-transparent border-t-[0.5px] border-transparent">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] text-[#8B5E3C] bg-[#FAF8F3] border-[0.5px] border-[#8B5E3C]/35 px-2.5 py-1 hover:bg-[#8B5E3C] hover:text-[#FAF8F3] transition-all cursor-pointer font-serif italic"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Form Input Area */}
            <div className="p-3 bg-[#FAF8F3] border-t-[0.5px] border-[#2F2F2F] flex items-center gap-2">
              <input
                type="text"
                placeholder="Compose a query for the Concierge..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                className="flex-1 bg-[#F5F1E8] border-[0.5px] border-[#2F2F2F]/30 p-2.5 text-xs outline-none text-[#2F2F2F] focus:border-[#8B5E3C] transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputValue.trim()}
                className="w-9 h-9 bg-[#2F2F2F] text-[#F5F1E8] hover:bg-[#8B5E3C] disabled:bg-gray-200 disabled:text-gray-400 border border-[#2F2F2F] disabled:border-transparent flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
