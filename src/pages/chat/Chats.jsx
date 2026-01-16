
// import { useEffect, useRef, useState, useContext } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import ChatBox from "../../components/ChatBox";
// import VideoCall from "../../components/VideoCall";
// import axiosInstance from "../../utils/axiosInstance";

// export default function Chats() {
//   const { user, loading, setTotalUnread } = useContext(AuthContext);

//   const [interests, setInterests] = useState([]);
//   const [selectedInterest, setSelectedInterest] = useState(null);
//   const [showVideo, setShowVideo] = useState(false);

//   const socketRef = useRef(null);

//   /* -------------------------------
//      LOAD CHAT LIST (WITH POLLING)
//   -------------------------------- */
//   const loadInterests = async () => {
//     if (!user) return;

//     const url =
//       user.role === "broker"
//         ? "/api/interests/broker/interests/"
//         : "/api/interests/client/interests/";

//     const res = await axiosInstance.get(url);
//     setInterests(res.data);

//     // update navbar unread count
//     const totalUnread = res.data.reduce(
//       (sum, i) => sum + (i.unread_count || 0),
//       0
//     );
//     setTotalUnread(totalUnread);
//   };

//   useEffect(() => {
//     if (!user || loading) return;

//     loadInterests(); // initial load

//     const interval = setInterval(loadInterests, 5000); // 🔁 poll every 5s
//     return () => clearInterval(interval);
//   }, [user, loading]);

//   /* -------------------------------
//      SELECT CHAT
//   -------------------------------- */
//   const handleSelectChat = async (interest) => {
//     setSelectedInterest(interest);

//     if (interest.unread_count > 0) {
//       await axiosInstance.post(
//         `/api/chat/interest/${interest.id}/read/`
//       );

//       // update list immediately
//       setInterests((prev) =>
//         prev.map((i) =>
//           i.id === interest.id
//             ? { ...i, unread_count: 0 }
//             : i
//         )
//       );

//       setTotalUnread((prev) =>
//         Math.max(prev - interest.unread_count, 0)
//       );
//     }
//   };

//   /* -------------------------------
//      UI
//   -------------------------------- */
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
//       {/* LEFT: CHAT LIST */}
//       <div className="border-r p-4 overflow-y-auto">
//         <h2 className="font-semibold mb-4">My Chats</h2>

//         {interests.length === 0 && (
//           <p className="text-sm text-gray-500">
//             No chats yet
//           </p>
//         )}

//         {interests.map((i) => (
//           <div
//             key={i.id}
//             onClick={() => handleSelectChat(i)}
//             className={`p-3 mb-2 rounded cursor-pointer ${
//               selectedInterest?.id === i.id
//                 ? "bg-indigo-50 border border-indigo-400"
//                 : "hover:bg-slate-50"
//             }`}
//           >
//             <p className="font-medium text-sm">
//               {i.property}
//             </p>

//             {i.unread_count > 0 && (
//               <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
//                 {i.unread_count} unread
//               </span>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* RIGHT: CHAT + VIDEO */}
//       <div className="md:col-span-2 flex flex-col relative">
//         {!selectedInterest && (
//           <div className="flex-1 flex items-center justify-center text-gray-400">
//             Select a chat to start
//           </div>
//         )}

//         {selectedInterest && (
//           <>
//             {/* HEADER */}
//             <div className="flex justify-between items-center p-3 bg-white border-b">
//               <div>
//                 <p className="font-semibold">
//                   {selectedInterest.property}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Live chat
//                 </p>
//               </div>

//               <button
//                 onClick={() => setShowVideo(true)}
//                 className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
//               >
//                 📹 Video Call
//               </button>
//             </div>

//             {/* VIDEO CALL */}
//             {showVideo && socketRef.current && (
//               <div className="absolute top-12 left-0 right-0 z-20 px-4">
//                 {/* <VideoCall
//                   socket={socketRef.current}
//                   onClose={() => setShowVideo(false)}
//                 /> */}
//                 <VideoCall
//   socket={socketRef.current}
//   currentUser={user.username}
//   onClose={() => setShowVideo(false)}
// />

//               </div>
//             )}

//             {/* CHAT BOX */}
//             <div className={`flex-1 ${showVideo ? "mt-[260px]" : ""}`}>
//               <ChatBox
//                 interestId={selectedInterest.id}
//                 onSocketReady={(s) => (socketRef.current = s)}
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import ChatBox from "../../components/ChatBox";
import VideoCall from "../../components/VideoCall";
import axiosInstance from "../../utils/axiosInstance";

export default function Chats() {
  const { user, loading, setTotalUnread } = useContext(AuthContext);

  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const socketRef = useRef(null);

  /* -------------------------------
     LOAD CHAT LIST (WITH POLLING)
  -------------------------------- */
  const loadInterests = async () => {
    if (!user) return;

    const url =
      user.role === "broker"
        ? "/api/interests/broker/interests/"
        : "/api/interests/client/interests/";

    const res = await axiosInstance.get(url);
    setInterests(res.data);

    const totalUnread = res.data.reduce(
      (sum, i) => sum + (i.unread_count || 0),
      0
    );
    setTotalUnread(totalUnread);
  };

  useEffect(() => {
    if (!user || loading) return;

    loadInterests();
    const interval = setInterval(loadInterests, 5000);
    return () => clearInterval(interval);
  }, [user, loading]);

  /* -------------------------------
     SELECT CHAT
  -------------------------------- */
  const handleSelectChat = async (interest) => {
    setSelectedInterest(interest);

    if (interest.unread_count > 0) {
      await axiosInstance.post(
        `/api/chat/interest/${interest.id}/read/`
      );

      setInterests((prev) =>
        prev.map((i) =>
          i.id === interest.id
            ? { ...i, unread_count: 0 }
            : i
        )
      );

      setTotalUnread((prev) =>
        Math.max(prev - interest.unread_count, 0)
      );
    }
  };

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[320px_1fr] bg-bg-page">
      {/* ================= LEFT PANEL ================= */}
      <aside className="bg-white border-r border-gray-200 flex flex-col items-stretch">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand-primary">
            My Chats
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Conversations with clients & brokers
          </p>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {interests.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-10">
              No chats yet. Start browsing properties!
            </p>
          )}

          {interests.map((i) => {
            const active = selectedInterest?.id === i.id;

            return (
              <div
                key={i.id}
                onClick={() => handleSelectChat(i)}
                className={`p-3 rounded-md cursor-pointer transition border border-transparent ${
                  active
                    ? "bg-blue-50 border-blue-100"
                    : "hover:bg-gray-50 hover:border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className={`text-sm line-clamp-1 ${active ? "font-bold text-brand-primary" : "font-medium text-text-main"}`}>
                    {i.property}
                  </p>

                  {i.unread_count > 0 && (
                    <span className="ml-2 min-w-[20px] h-[20px] text-[10px] font-bold bg-brand-accent text-white rounded-full flex items-center justify-center">
                      {i.unread_count}
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-muted mt-1 truncate">
                  Click to open chat
                </p>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ================= RIGHT PANEL ================= */}
      <main className="flex flex-col relative bg-white">
        {!selectedInterest && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <div className="text-5xl mb-4 text-gray-200">💬</div>
            <p className="text-sm font-medium">
              Select a conversation to start chatting
            </p>
          </div>
        )}

        {selectedInterest && (
          <>
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-brand-primary">
                  {selectedInterest.property}
                </h3>
                <div className="flex items-center gap-2 text-xs text-green-600 mt-0.5 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live Chat
                </div>
              </div>

              <button
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-brand-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
              >
                <span className="text-lg">📹</span> Video Call
              </button>
            </div>

            {/* VIDEO CALL OVERLAY */}
            {showVideo && socketRef.current && (
              <div className="absolute top-20 left-0 right-0 z-20 px-6">
                <VideoCall
                  socket={socketRef.current}
                  currentUser={user.username}
                  onClose={() => setShowVideo(false)}
                />
              </div>
            )}

            {/* CHAT BOX */}
            <div
              className={`flex-1 ${
                showVideo ? "mt-[280px]" : ""
              }`}
            >
              <ChatBox
                interestId={selectedInterest.id}
                onSocketReady={(s) => (socketRef.current = s)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
