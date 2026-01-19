import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import AIChatBot from './AIChatBot';

export default function FloatingAIChat() {
  const { isAuthenticated } = useContext(AuthContext);
  const chatRef = useRef(null);
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("viewora_ai_chat_open") === "true";
  });

  if (!isAuthenticated) return null;

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem("viewora_ai_chat_open", nextState);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      chatRef.current?.clearChat();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[400px] max-w-[90vw] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
            {/* Header Actions */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button 
                onClick={handleClear}
                title="Clear Chat"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
              <button 
                onClick={toggleChat}
                title="Close Chat"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AIChatBot ref={chatRef} />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 ${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-brand-primary hover:bg-blue-900 -rotate-0'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-20 group-hover:opacity-40"></div>
        
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white drop-shadow-lg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.1"/>
              <rect x="5" y="10" width="14" height="9" rx="3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M9 14H9.01M15 14H15.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 10V8M12 8C12 8 12 6 10 6M12 8C12 8 12 6 14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 13V15M22 13V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Notification Dot */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-accent border-2 border-white"></span>
            </span>
          </div>
        )}

        {/* Hover Label */}
        {!isOpen && (
          <div className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
            Ask Viewora AI
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-8 border-transparent border-l-gray-900"></div>
          </div>
        )}
      </button>
    </div>
  );
}
