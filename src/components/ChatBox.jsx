
// import { useEffect, useRef, useState, useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { getChatHistory, markMessagesRead } from "../api/chatApi";

// export default function ChatBox({ interestId }) {
//   const { user } = useContext(AuthContext);

//   const socketRef = useRef(null);
//   const bottomRef = useRef(null);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [connected, setConnected] = useState(false);

//   /* -------------------------------
//      LOAD CHAT HISTORY
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId || !user) return;

//     const loadHistory = async () => {
//       try {
//         const res = await getChatHistory(interestId);
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Failed to load history", err);
//       }
//     };

//     loadHistory();
//   }, [interestId, user]);

//   /* -------------------------------
//      MARK MESSAGES AS READ
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId || !user) return;

//     const markRead = async () => {
//       try {
//         await markMessagesRead(interestId);

//         // Update local state immediately
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.sender !== user.username
//               ? { ...msg, is_read: true }
//               : msg
//           )
//         );
//       } catch (err) {
//         console.error("Failed to mark read", err);
//       }
//     };

//     markRead();
//   }, [interestId, user]);

//   /* -------------------------------
//      WEBSOCKET CONNECTION
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId || !user) return;


// const protocol =
//   window.location.protocol === "https:" ? "wss" : "ws";

// const socket = new WebSocket(
//   `${protocol}://${window.location.hostname}:8000/ws/chat/interest/${interestId}/`
// );


//     socketRef.current = socket;

//     socket.onopen = () => setConnected(true);

//     socket.onmessage = (event) => {
//   const data = JSON.parse(event.data);

//   if (data.type === "read_receipt") {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         data.message_ids.includes(msg.id)
//           ? { ...msg, is_read: true }
//           : msg
//       )
//     );
//   } else {
//     // normal chat message
//     setMessages((prev) => [...prev, data]);
//   }
// };


//     socket.onclose = () => setConnected(false);

//     return () => socket.close();
//   }, [interestId, user]);

//   /* -------------------------------
//      AUTO SCROLL
//   -------------------------------- */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* -------------------------------
//      SEND MESSAGE
//   -------------------------------- */
//   const sendMessage = () => {
//     if (!input.trim()) return;

//     if (!socketRef.current ||
//         socketRef.current.readyState !== WebSocket.OPEN) {
//       alert("Chat not connected");
//       return;
//     }

//     socketRef.current.send(
//       JSON.stringify({ message: input })
//     );

//     setInput("");
//   };

//   const formatTime = (iso) =>
//     new Date(iso).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   if (!user) return null;

//   return (
//     <div className="border rounded p-3 max-w-md">
//       <h3 className="font-semibold mb-2">Live Chat</h3>

//       <div className="border h-48 overflow-y-auto mb-2 p-2 bg-gray-50 flex flex-col gap-1">
//         {messages.map((msg) => {
//           const isMe = msg.sender === user.username;

//           return (
//             <div
//               key={msg.id}
//               className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
//                 isMe
//                   ? "self-end bg-blue-600 text-white"
//                   : "self-start bg-gray-200 text-gray-900"
//               }`}
//             >
//               {!isMe && (
//                 <div className="text-xs font-semibold mb-1">
//                   {msg.sender}
//                 </div>
//               )}

//               <div className="flex flex-col">
//                 <div>{msg.message}</div>
//                 <div className="text-[10px] mt-1 self-end">
//                   {formatTime(msg.time)}
//                   {isMe && (
//                     <span className="ml-1">
//                       {msg.is_read ? "✔✔" : "✔"}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <div className="flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="border flex-1 px-2 py-1 rounded"
//           placeholder="Type message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-3 py-1 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
// import { useEffect, useRef, useState, useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { getChatHistory, markMessagesRead } from "../api/chatApi";

// export default function ChatBox({ interestId, socketRef }) {
//   const { user } = useContext(AuthContext);
//   const bottomRef = useRef(null);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     if (!interestId) return;
//     getChatHistory(interestId).then((res) =>
//       setMessages(res.data)
//     );
//   }, [interestId]);

//   useEffect(() => {
//     if (!interestId) return;
//     markMessagesRead(interestId);
//   }, [interestId]);

//   useEffect(() => {
//     if (!socketRef?.current) return;
//     const socket = socketRef.current;

//     const handleMessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.type === "read_receipt") {
//         setMessages((prev) =>
//           prev.map((m) =>
//             data.message_ids.includes(m.id)
//               ? { ...m, is_read: true }
//               : m
//           )
//         );
//       } else if (data.message) {
//         setMessages((prev) => [...prev, data]);
//       }
//     };

//     socket.addEventListener("message", handleMessage);
//     return () =>
//       socket.removeEventListener("message", handleMessage);
//   }, [socketRef]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     socketRef.current.send(
//       JSON.stringify({ type: "message", message: input })
//     );
//     setInput("");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
//         {messages.map((m) => {
//           const isMe = m.sender === user.username;
//           return (
//             <div
//               key={m.id}
//               className={`mb-1 max-w-[70%] px-3 py-2 rounded ${
//                 isMe
//                   ? "ml-auto bg-blue-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {m.message}
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <div className="flex gap-2 p-2 border-t">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border rounded px-2"
//           placeholder="Type message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 rounded"
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

    getChatHistory(interestId).then((res) => {
      setMessages(res.data);
    });
  }, [interestId]);

  /* -------------------------------
     MARK MESSAGES AS READ
  -------------------------------- */
  useEffect(() => {
    if (!interestId) return;
    markMessagesRead(interestId);
  }, [interestId]);

  /* -------------------------------
     WEBSOCKET (AUTO-RECONNECT)
  -------------------------------- */
  useEffect(() => {
    if (!interestId) return;

    let socket;

    const connect = () => {
      const protocol =
        window.location.protocol === "https:" ? "wss" : "ws";

      socket = new WebSocket(
        `${protocol}://${window.location.hostname}:8000/ws/chat/interest/${interestId}/`
      );

      socketRef.current = socket;
      onSocketReady?.(socket);

      socket.onopen = () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
      };

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
        console.warn("⚠️ WebSocket closed — reconnecting...");
        setConnected(false);

        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, 1500);
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
      socket?.close();
      socketRef.current = null;
      setConnected(false);
    };
  }, [interestId]);

  /* -------------------------------
     SEND MESSAGE (SAFE)
  -------------------------------- */
  const sendMessage = () => {
    if (!input.trim()) return;

    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.warn("Socket not ready, message skipped");
      return;
    }

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.sender === user.username;

          return (
            <div
              key={msg.id}
              className={`mb-2 max-w-[75%] px-3 py-2 rounded ${
                isMe
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              <div>{msg.message}</div>
              <div className="text-[10px] text-right mt-1">
                {new Date(msg.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {isMe && <span> {msg.is_read ? "✔✔" : "✔"}</span>}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 p-2 border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder={
            connected ? "Type message..." : "Connecting..."
          }
        />
        <button
          onClick={sendMessage}
          disabled={!connected}
          className={`px-3 rounded ${
            connected
              ? "bg-indigo-600 text-white"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
