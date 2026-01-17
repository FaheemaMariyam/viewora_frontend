import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { getAreaInsights } from "../../api/aiApi";
import MarkdownRenderer from "../ui/MarkdownRenderer";

const SUGGESTED_QUESTIONS = [
  "Is Whitefield good for investment?",
  "What are the pricing trends in Palakkad?",
  "Best areas for 3BHK villas under 1Cr?",
  "Upcoming development near Kanjikode?"
];

export default function AIChatBot() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const storageKey = `viewora_ai_chat_${user?.id || 'guest'}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(msg => ({
          ...msg,
          time: new Date(msg.time)
        }));
      } catch (e) {
        console.error("Failed to load AI chat history", e);
      }
    }
    return [
      {
        role: "assistant",
        content: `Hello ${user?.first_name || 'there'}! I'm your Viewora real estate advisor. How can I help you find your dream property today?`,
        time: new Date()
      }
    ];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    const query = text.trim();
    if (!query) return;

    // Add user message
    const userMsg = { role: "user", content: query, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await getAreaInsights(query);
      const aiMsg = { 
        role: "assistant", 
        content: res.data.answer, 
        sources: res.data.sources || [],
        time: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = { 
        role: "assistant", 
        content: "I'm sorry, I'm having trouble connecting to the AI service. Please try again in a moment.", 
        isError: true,
        time: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initial = [
      {
        role: "assistant",
        content: `Hello ${user?.first_name || 'there'}! I'm your Viewora real estate advisor. How can I help you find your dream property today?`,
        time: new Date()
      }
    ];
    setMessages(initial);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-blue-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-white font-semibold leading-tight">Viewora AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-blue-100 text-xs font-medium">Online & Ready</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          title="Clear Chat History"
          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
        {messages.map((msg, idx) => {
          // Parse references if they exist in assistant messages
          let displayContent = msg.content;
          let filteredSources = msg.sources || [];
          
          if (msg.role === 'assistant' && msg.content.includes('REFERENCES:')) {
            const parts = msg.content.split(/REFERENCES:\s*\[(.*?)\]/);
            if (parts.length >= 2) {
              displayContent = parts[0].trim();
              const refIds = parts[1].split(',').map(id => id.trim());
              
              if (refIds.length > 0 && msg.sources) {
                filteredSources = msg.sources.filter(s => 
                  refIds.includes(String(s.property_id))
                );
              }
            }
          }

          return (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' ? (
                  <MarkdownRenderer content={displayContent} />
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
                
                {filteredSources?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Relevant Listings</p>
                    <div className="grid grid-cols-1 gap-2">
                      {filteredSources.map((s, sIdx) => (
                        <div 
                          key={sIdx} 
                          onClick={() => s.property_id && navigate(`/properties/${s.property_id}`)}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-white transition-all group cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-xl shadow-sm">
                            {s.type === 'apartment' ? '🏢' : '🏡'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate uppercase tracking-tight">{s.locality || 'View Property'}</p>
                            <p className="text-[10px] text-gray-500 truncate">{s.city ? `${s.city}` : 'Click for details'}</p>
                          </div>
                          <div className="p-1.5 rounded-lg bg-brand-primary/5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && !loading && (
        <div className="px-4 py-2 border-t border-gray-50 bg-white">
          <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wide">Suggested Queries</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about local insights, pricing, or trends..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white focus:border-brand-primary transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-lg disabled:opacity-50 disabled:bg-gray-400 hover:shadow-lg hover:bg-blue-800 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          AI generated responses may vary. Cross-reference with property listings.
        </p>
      </div>
    </div>
  );
}
