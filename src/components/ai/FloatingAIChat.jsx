import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import AIChatBot from './AIChatBot';

export default function FloatingAIChat() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("viewora_ai_chat_open") === "true";
  });

  if (!isAuthenticated) return null;

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem("viewora_ai_chat_open", nextState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[400px] max-w-[90vw] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
            <button 
              onClick={toggleChat}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AIChatBot />
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
            <span className="text-2xl">🤖</span>
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
