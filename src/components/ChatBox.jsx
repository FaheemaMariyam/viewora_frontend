import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getChatHistory, markMessagesRead } from "../api/chatApi";

export default function ChatBox({ interestId, onSocketReady }) {
  const { user } = useContext(AuthContext);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  /* -------------------------------
     RESET ON CHAT CHANGE
  -------------------------------- */
  useEffect(() => {
    setMessages([]);
  }, [interestId]);

  /* -------------------------------
     LOAD CHAT HISTORY
  -------------------------------- */
  useEffect(() => {
    if (!interestId) return;
    getChatHistory(interestId).then((res) => setMessages(res.data));
  }, [interestId]);

  /* -------------------------------
     MARK MESSAGES AS READ
  -------------------------------- */
  useEffect(() => {
    if (!interestId) return;
    markMessagesRead(interestId);
  }, [interestId]);

  /* -------------------------------
     WEBSOCKET
  -------------------------------- */
  useEffect(() => {
    if (!interestId) return;
    let socket;

    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      socket = new WebSocket(
        `${protocol}://${window.location.hostname}:8000/ws/chat/interest/${interestId}/`
      );

      socketRef.current = socket;
      onSocketReady?.(socket);

      socket.onopen = () => setConnected(true);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "chat_message") {
          setMessages((prev) => [...prev, data]);
        }

        if (data.type === "read_receipt") {
          setMessages((prev) =>
            prev.map((m) =>
              data.message_ids.includes(m.id)
                ? { ...m, is_read: true }
                : m
            )
          );
        }
      };

      socket.onclose = () => {
        setConnected(false);
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, 1500);
        }
      };

      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      socket?.close();
      socketRef.current = null;
      setConnected(false);
    };
  }, [interestId]);

  /* -------------------------------
     SEND MESSAGE
  -------------------------------- */
  const sendMessage = () => {
    if (!input.trim()) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    socketRef.current.send(
      JSON.stringify({ type: "message", message: input })
    );
    setInput("");
  };

  /* -------------------------------
     AUTO SCROLL
  -------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="text-sm">Start the conversation</span>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender === user.username;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[72%] px-4 py-3 shadow-sm ${
                  isMe
                    ? "bg-brand-primary text-white rounded-2xl rounded-tr-sm"
                    : "bg-white text-text-main border border-gray-100 rounded-2xl rounded-tl-sm"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>

                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    isMe ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && (
                    <span className="ml-1 font-bold">
                      {msg.is_read ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              connected ? "Type your message..." : "Connecting..."
            }
            className="flex-1 bg-gray-50 text-text-main rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
          />

          <button
            onClick={sendMessage}
            disabled={!connected}
            className={`p-2.5 rounded-full text-white transition-all shadow-sm ${
              connected
                ? "bg-brand-accent hover:bg-blue-600 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
