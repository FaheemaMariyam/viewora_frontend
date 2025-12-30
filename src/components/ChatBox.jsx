
// import { useEffect, useRef, useState, useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { getChatHistory } from "../api/chatApi";

// export default function ChatBox({ interestId }) {
//   const { user } = useContext(AuthContext);

//   const socketRef = useRef(null);
//   const bottomRef = useRef(null);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [connected, setConnected] = useState(false);

//   /* -------------------------------
//      1️⃣ LOAD CHAT HISTORY (ON REFRESH)
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId || !user) return;

//     const loadHistory = async () => {
//       try {
//         const res = await getChatHistory(interestId);
//         setMessages(res.data); // restore chat
//       } catch (err) {
//         console.error("❌ Failed to load chat history", err);
//       }
//     };

//     loadHistory();
//   }, [interestId, user]);

//   /* -------------------------------
//      2️⃣ WEBSOCKET CONNECTION
//   -------------------------------- */
//   useEffect(() => {
//     if (!interestId || !user) return;

//     const protocol =
//       window.location.protocol === "https:" ? "wss" : "ws";

//     const socket = new WebSocket(
//       `${protocol}://localhost:8000/ws/chat/interest/${interestId}/`
//     );

//     socketRef.current = socket;

//     socket.onopen = () => {
//       console.log("✅ Chat connected");
//       setConnected(true);
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setMessages((prev) => [...prev, data]);
//     };

//     socket.onerror = (err) => {
//       console.error("❌ WebSocket error", err);
//     };

//     socket.onclose = () => {
//       console.log("🔌 Chat disconnected");
//       setConnected(false);
// confirm
//     };

//     return () => socket.close();
//   }, [interestId, user]);

//   /* -------------------------------
//      3️⃣ AUTO SCROLL TO LATEST MESSAGE
//   -------------------------------- */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* -------------------------------
//      4️⃣ SEND MESSAGE
//   -------------------------------- */
//   const sendMessage = () => {
//     if (!input.trim()) return;

//     if (
//       !socketRef.current ||
//       socketRef.current.readyState !== WebSocket.OPEN
//     ) {
//       alert("Chat not connected");
//       return;
//     }

//     socketRef.current.send(
//       JSON.stringify({ message: input })
//     );

//     setInput("");
//   };
//   const formatTime = (isoString) => {
//   if (!isoString) return "";
//   const date = new Date(isoString);
//   return date.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };


//   if (!user) return null;

//   /* -------------------------------
//      5️⃣ UI
//   -------------------------------- */
//     return (
//     <div className="border rounded p-3 max-w-md">
//       <h3 className="font-semibold mb-2">Live Chat</h3>

//       {!connected && (
//         <p className="text-sm text-gray-500 mb-2">
//           Connecting to chat...
//         </p>
//       )}

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
//               {/* <div>{msg.message}</div> */}
//               <div className="flex flex-col">
//   <div>{msg.message}</div>
//   <div
//     className={`text-[10px] mt-1 self-end ${
//       isMe ? "text-blue-200" : "text-gray-500"
//     }`}
//   >
//     {formatTime(msg.time)}
//   </div>
// </div>

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
import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getChatHistory, markMessagesRead } from "../api/chatApi";

export default function ChatBox({ interestId }) {
  const { user } = useContext(AuthContext);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  /* -------------------------------
     LOAD CHAT HISTORY
  -------------------------------- */
  useEffect(() => {
    if (!interestId || !user) return;

    const loadHistory = async () => {
      try {
        const res = await getChatHistory(interestId);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    loadHistory();
  }, [interestId, user]);

  /* -------------------------------
     MARK MESSAGES AS READ
  -------------------------------- */
  useEffect(() => {
    if (!interestId || !user) return;

    const markRead = async () => {
      try {
        await markMessagesRead(interestId);

        // Update local state immediately
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender !== user.username
              ? { ...msg, is_read: true }
              : msg
          )
        );
      } catch (err) {
        console.error("Failed to mark read", err);
      }
    };

    markRead();
  }, [interestId, user]);

  /* -------------------------------
     WEBSOCKET CONNECTION
  -------------------------------- */
  useEffect(() => {
    if (!interestId || !user) return;

//  const protocol =
//   window.location.protocol === "https:" ? "wss" : "ws";

// const socket = new WebSocket(
//   `${protocol}://${window.location.host}/ws/chat/interest/${interestId}/`
// );
const protocol =
  window.location.protocol === "https:" ? "wss" : "ws";

const socket = new WebSocket(
  `${protocol}://${window.location.hostname}:8000/ws/chat/interest/${interestId}/`
);


    socketRef.current = socket;

    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "read_receipt") {
    setMessages((prev) =>
      prev.map((msg) =>
        data.message_ids.includes(msg.id)
          ? { ...msg, is_read: true }
          : msg
      )
    );
  } else {
    // normal chat message
    setMessages((prev) => [...prev, data]);
  }
};


    socket.onclose = () => setConnected(false);

    return () => socket.close();
  }, [interestId, user]);

  /* -------------------------------
     AUTO SCROLL
  -------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------------------
     SEND MESSAGE
  -------------------------------- */
  const sendMessage = () => {
    if (!input.trim()) return;

    if (!socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN) {
      alert("Chat not connected");
      return;
    }

    socketRef.current.send(
      JSON.stringify({ message: input })
    );

    setInput("");
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!user) return null;

  return (
    <div className="border rounded p-3 max-w-md">
      <h3 className="font-semibold mb-2">Live Chat</h3>

      <div className="border h-48 overflow-y-auto mb-2 p-2 bg-gray-50 flex flex-col gap-1">
        {messages.map((msg) => {
          const isMe = msg.sender === user.username;

          return (
            <div
              key={msg.id}
              className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                isMe
                  ? "self-end bg-blue-600 text-white"
                  : "self-start bg-gray-200 text-gray-900"
              }`}
            >
              {!isMe && (
                <div className="text-xs font-semibold mb-1">
                  {msg.sender}
                </div>
              )}

              <div className="flex flex-col">
                <div>{msg.message}</div>
                <div className="text-[10px] mt-1 self-end">
                  {formatTime(msg.time)}
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

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border flex-1 px-2 py-1 rounded"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
