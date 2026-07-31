import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, ShieldAlert, TrendingUp, Users, Calendar, ArrowRight } from 'lucide-react';

// Helper to render markdown bold (**text**) and links ([text](url)) in audit transcripts
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

export default function ConversationAnalytics() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionMessages, setSessionMessages] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSessions: 0,
    hitRate: 0,
    averageMessages: 0,
    escalations: 0
  });
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://server-tau-taupe-45.vercel.app/api';
  const token = localStorage.getItem('token');

  // Load Sessions and Analytics
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // 1. Fetch Sessions
        const sRes = await fetch(`${API_URL}/chat/admin/sessions`, { headers });
        if (sRes.ok) {
          const sData = await sRes.json();
          setSessions(sData);
        }

        // 2. Fetch Analytics
        const aRes = await fetch(`${API_URL}/chat/admin/analytics`, { headers });
        if (aRes.ok) {
          const aData = await aRes.json();
          setAnalytics(aData);
        }
      } catch (err) {
        console.error('Failed to load chat logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [API_URL, token]);

  // Load Session Messages when selected
  useEffect(() => {
    if (!selectedSessionId) return;

    async function loadMessages() {
      setMessagesLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/chat/admin/sessions/${selectedSessionId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setSessionMessages(data);
        }
      } catch (err) {
        console.error('Failed to load session messages:', err);
      } finally {
        setMessagesLoading(false);
      }
    }
    loadMessages();
  }, [selectedSessionId, API_URL, token]);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto p-4 text-[#2F2F2F]">
      
      {/* Editorial Title */}
      <div className="border-b border-[#2F2F2F]/15 pb-4">
        <h1 className="font-serif text-3xl font-bold tracking-wide">Concierge Logs</h1>
        <p className="text-xs text-[#7A756B] mt-1 font-serif italic">
          Audit customer sessions and analyze the performance, accuracy, and citation rates of the AI Shopping Assistant.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-4 shadow-[3px_3px_0px_0px_#2F2F2F]">
          <div className="flex items-center justify-between text-[#7A756B]">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Total Conversations</span>
            <MessageSquare size={14} className="text-[#8B5E3C]" />
          </div>
          <div className="font-serif text-2xl font-bold mt-2">{analytics.totalSessions}</div>
        </div>

        <div className="bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-4 shadow-[3px_3px_0px_0px_#2F2F2F]">
          <div className="flex items-center justify-between text-[#7A756B]">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Context Hit Rate</span>
            <TrendingUp size={14} className="text-[#8B5E3C]" />
          </div>
          <div className="font-serif text-2xl font-bold mt-2">{analytics.hitRate}%</div>
        </div>

        <div className="bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-4 shadow-[3px_3px_0px_0px_#2F2F2F]">
          <div className="flex items-center justify-between text-[#7A756B]">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Avg Chat Length</span>
            <Users size={14} className="text-[#8B5E3C]" />
          </div>
          <div className="font-serif text-2xl font-bold mt-2">{analytics.averageMessages} msgs</div>
        </div>

        <div className="bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-4 shadow-[3px_3px_0px_0px_#2F2F2F]">
          <div className="flex items-center justify-between text-[#7A756B]">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Escalation Rate</span>
            <ShieldAlert size={14} className="text-[#8B5E3C]" />
          </div>
          <div className="font-serif text-2xl font-bold mt-2">{analytics.escalations} runs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Sessions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-5 shadow-[4px_4px_0px_0px_#2F2F2F]">
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-[#8B5E3C]" /> Active Sessions
            </h3>

            {loading ? (
              <div className="text-center py-8 text-xs text-[#7A756B] italic">Loading logs...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#7A756B] italic">No conversations recorded yet.</div>
            ) : (
              <div className="divide-y divide-[#2F2F2F]/10 max-h-[350px] overflow-y-auto pr-1">
                {sessions.map((sess) => (
                  <button
                    key={sess.id}
                    onClick={() => setSelectedSessionId(sess.id)}
                    className={`w-full text-left py-3 px-2 flex items-center justify-between border-l-2 transition-all cursor-pointer ${
                      selectedSessionId === sess.id 
                        ? 'border-[#8B5E3C] bg-[#F5F1E8]/50' 
                        : 'border-transparent hover:bg-[#FAF8F3]/60'
                    }`}
                  >
                    <div>
                      <div className="text-[12px] font-semibold">
                        {sess.customer 
                          ? `${sess.customer.first_name} ${sess.customer.last_name}` 
                          : 'Guest Customer'}
                      </div>
                      <div className="text-[10px] text-[#7A756B] mt-0.5 font-mono truncate max-w-[180px]">
                        Token: {sess.session_token.substring(0, 16)}...
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-[#7A756B]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Session Transcripts */}
        <div className="lg:col-span-3">
          <div className="bg-[#FAF8F3] border-[0.5px] border-[#2F2F2F]/20 p-5 shadow-[4px_4px_0px_0px_#2F2F2F] h-full flex flex-col min-h-[350px]">
            <h3 className="font-serif text-lg font-bold mb-4">
              Conversation Transcript
            </h3>

            {!selectedSessionId ? (
              <div className="flex-1 flex items-center justify-center text-xs text-[#7A756B] italic">
                Select a customer session from the list to audit transcripts.
              </div>
            ) : messagesLoading ? (
              <div className="flex-1 flex items-center justify-center text-xs text-[#7A756B] italic">
                Loading transcript...
              </div>
            ) : sessionMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-[#7A756B] italic">
                No messages recorded in this session.
              </div>
            ) : (
              <div className="flex-1 space-y-4 max-h-[380px] overflow-y-auto pr-2 text-xs">
                {sessionMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] p-3 border-[0.5px] relative ${
                        msg.sender === 'user' 
                          ? 'bg-[#2F2F2F] text-[#FAF8F3] border-[#2F2F2F]' 
                          : 'bg-[#F5F1E8] text-[#2F2F2F] border-[#2F2F2F]/15'
                      }`}
                    >
                      <div className="font-semibold text-[9px] mb-1 uppercase tracking-wider text-[#7A756B]">
                        {msg.sender === 'user' ? 'User' : 'Concierge'}
                      </div>
                      <div className="leading-relaxed">{renderMessage(msg.message, msg.sender === 'user')}</div>
                      
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-1.5 border-t border-[#2F2F2F]/10 flex flex-wrap gap-1 font-mono text-[9px] text-[#8B5E3C]">
                          <span className="flex items-center gap-0.5"><FileText size={8} /> Citations:</span>
                          {msg.sources.map((src, sIdx) => (
                            <span 
                              key={sIdx}
                              className="bg-[#FAF8F3] px-1 border border-[#2F2F2F]/10 text-[9px]"
                            >
                              {src.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
