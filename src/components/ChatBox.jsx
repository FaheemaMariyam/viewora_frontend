

// import { useEffect, useRef, useState, useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { getChatHistory, markMessagesRead } from "../api/chatApi";

// export default function ChatBox({ interestId, onSocketReady }) {
//   const { user } = useContext(AuthContext);

//   const socketRef = useRef(null);
//   const bottomRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [connected, setConnected] = useState(false);

//   /* -------------------------------
//      RESET ON CHAT CHANGE
//   -------------------------------- */
//   useEffect(() => {
//     setMessages([]);
//   }, [interestId]);

//   /* -------------------------------
//      LOAD CHAT HISTORY
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId) return;

//     getChatHistory(interestId).then((res) => {
//       setMessages(res.data);
//     });
//   }, [interestId]);

//   /* -------------------------------
//      MARK MESSAGES AS READ
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId) return;
//     markMessagesRead(interestId);
//   }, [interestId]);

//   /* -------------------------------
//      WEBSOCKET (AUTO-RECONNECT)
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId) return;

//     let socket;

//     const connect = () => {
//       const protocol =
//         window.location.protocol === "https:" ? "wss" : "ws";

//       socket = new WebSocket(
//         `${protocol}://${window.location.hostname}:8000/ws/chat/interest/${interestId}/`
//       );

//       socketRef.current = socket;
//       onSocketReady?.(socket);

//       socket.onopen = () => {
//         console.log("✅ WebSocket connected");
//         setConnected(true);
//       };

//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);

//         if (data.type === "chat_message") {
//           setMessages((prev) => [...prev, data]);
//         }

//         if (data.type === "read_receipt") {
//           setMessages((prev) =>
//             prev.map((m) =>
//               data.message_ids.includes(m.id)
//                 ? { ...m, is_read: true }
//                 : m
//             )
//           );
//         }
//       };

//       socket.onclose = () => {
//         console.warn("⚠️ WebSocket closed — reconnecting...");
//         setConnected(false);

//         if (!reconnectTimeoutRef.current) {
//           reconnectTimeoutRef.current = setTimeout(() => {
//             reconnectTimeoutRef.current = null;
//             connect();
//           }, 1500);
//         }
//       };

//       socket.onerror = () => {
//         socket.close();
//       };
//     };

//     connect();

//     return () => {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//       socket?.close();
//       socketRef.current = null;
//       setConnected(false);
//     };
//   }, [interestId]);

//   /* -------------------------------
//      SEND MESSAGE (SAFE)
//   -------------------------------- */
//   const sendMessage = () => {
//     if (!input.trim()) return;

//     if (
//       !socketRef.current ||
//       socketRef.current.readyState !== WebSocket.OPEN
//     ) {
//       console.warn("Socket not ready, message skipped");
//       return;
//     }

//     socketRef.current.send(
//       JSON.stringify({ type: "message", message: input })
//     );

//     setInput("");
//   };

//   /* -------------------------------
//      AUTO SCROLL
//   -------------------------------- */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* -------------------------------
//      UI
//   -------------------------------- */
//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
//         {messages.map((msg) => {
//           const isMe = msg.sender === user.username;

//           return (
//             <div
//               key={msg.id}
//               className={`mb-2 max-w-[75%] px-3 py-2 rounded ${
//                 isMe
//                   ? "ml-auto bg-indigo-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               <div>{msg.message}</div>
//               <div className="text-[10px] text-right mt-1">
//                 {new Date(msg.time).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//                 {isMe && <span> {msg.is_read ? "✔✔" : "✔"}</span>}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <div className="flex gap-2 p-2 border-t bg-white">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border rounded px-2 py-1"
//           placeholder={
//             connected ? "Type message..." : "Connecting..."
//           }
//         />
//         <button
//           onClick={sendMessage}
//           disabled={!connected}
//           className={`px-3 rounded ${
//             connected
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl shadow-inner">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            Start the conversation 💬
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
                className={`max-w-[72%] px-4 py-3 rounded-2xl shadow-sm ${
                  isMe
                    ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md border"
                }`}
              >
                <div className="text-sm leading-relaxed">
                  {msg.message}
                </div>

                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                    isMe ? "text-indigo-100" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && (
                    <span className="ml-1">
                      {msg.is_read ? "✔✔" : "✔"}
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
      <div className="sticky bottom-0 bg-white border-t px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              connected ? "Type your message..." : "Connecting..."
            }
            className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={sendMessage}
            disabled={!connected}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              connected
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
