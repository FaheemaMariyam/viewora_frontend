
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import ChatBox from "../../components/ChatBox";
// import axiosInstance from "../../utils/axiosInstance";

// export default function Chats() {
//   const {
//     user,
//     loading,
//     setTotalUnread,
//   } = useContext(AuthContext);

//   const [interests, setInterests] = useState([]);
//   const [selectedInterest, setSelectedInterest] = useState(null);
//   const [showVideo, setShowVideo] = useState(false);
//   useEffect(() => {
//     if (!user || loading) return;

//     if (user.role === "client") {
//       fetchClientChats();
//     } else if (user.role === "broker") {
//       fetchBrokerChats();
//     }
//   }, [user, loading]);

//   const fetchClientChats = async () => {
//     const res = await axiosInstance.get(
//       "/api/interests/client/interests/"
//     );
//     setInterests(res.data);
//   };

//   const fetchBrokerChats = async () => {
//     const res = await axiosInstance.get(
//       "/api/interests/broker/interests/"
//     );
//     setInterests(res.data);
//   };

//   // 🔥 KEY LOGIC — clear unread without refresh
//   const handleSelectChat = async (interest) => {
//     setSelectedInterest(interest);

//     if (interest.unread_count > 0) {
//       // mark read in backend
//       await axiosInstance.post(
//         `/api/chat/interest/${interest.id}/read/`
//       );

//       // update chat list instantly
//       setInterests((prev) =>
//         prev.map((i) =>
//           i.id === interest.id
//             ? { ...i, unread_count: 0 }
//             : i
//         )
//       );

//       // update navbar instantly
//       setTotalUnread((prev) =>
//         Math.max(prev - interest.unread_count, 0)
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-slate-100">
//       <h1 className="text-2xl font-semibold mb-6">My Chats</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* LEFT */}
//         <div className="bg-white p-4 rounded shadow">
//           {interests.length === 0 && (
//             <p className="text-sm text-gray-500">
//               No chats yet
//             </p>
//           )}

//           {interests.map((interest) => (
//             <div
//               key={interest.id}
//               onClick={() => handleSelectChat(interest)}
//               className="border p-3 mb-2 rounded cursor-pointer hover:bg-slate-50"
//             >
//               <p className="font-medium">
//                 {interest.property}
//               </p>

//               {interest.unread_count > 0 && (
//                 <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
//                   {interest.unread_count} unread
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//         {showVideo && (
//   <VideoCall
//     socket={socketRef.current}
//     username={user.username}
//     onClose={() => setShowVideo(false)}
//   />
// )}

// <button
//   onClick={() => setShowVideo(true)}
//   className="mb-2 bg-indigo-600 text-white px-3 py-1 rounded"
// >
//   📹 Video Call
// </button>

//         {/* RIGHT */}
//         <div className="bg-white p-4 rounded shadow md:col-span-2">
//           {selectedInterest ? (
//             <ChatBox interestId={selectedInterest.id} />
//           ) : (
//             <p className="text-gray-500">
//               Select a chat to continue
//             </p>
//           )}
//         </div>
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

    // update navbar unread count
    const totalUnread = res.data.reduce(
      (sum, i) => sum + (i.unread_count || 0),
      0
    );
    setTotalUnread(totalUnread);
  };

  useEffect(() => {
    if (!user || loading) return;

    loadInterests(); // initial load

    const interval = setInterval(loadInterests, 5000); // 🔁 poll every 5s
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

      // update list immediately
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
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      {/* LEFT: CHAT LIST */}
      <div className="border-r p-4 overflow-y-auto">
        <h2 className="font-semibold mb-4">My Chats</h2>

        {interests.length === 0 && (
          <p className="text-sm text-gray-500">
            No chats yet
          </p>
        )}

        {interests.map((i) => (
          <div
            key={i.id}
            onClick={() => handleSelectChat(i)}
            className={`p-3 mb-2 rounded cursor-pointer ${
              selectedInterest?.id === i.id
                ? "bg-indigo-50 border border-indigo-400"
                : "hover:bg-slate-50"
            }`}
          >
            <p className="font-medium text-sm">
              {i.property}
            </p>

            {i.unread_count > 0 && (
              <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                {i.unread_count} unread
              </span>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT: CHAT + VIDEO */}
      <div className="md:col-span-2 flex flex-col relative">
        {!selectedInterest && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start
          </div>
        )}

        {selectedInterest && (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center p-3 bg-white border-b">
              <div>
                <p className="font-semibold">
                  {selectedInterest.property}
                </p>
                <p className="text-xs text-gray-500">
                  Live chat
                </p>
              </div>

              <button
                onClick={() => setShowVideo(true)}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
              >
                📹 Video Call
              </button>
            </div>

            {/* VIDEO CALL */}
            {showVideo && socketRef.current && (
              <div className="absolute top-12 left-0 right-0 z-20 px-4">
                {/* <VideoCall
                  socket={socketRef.current}
                  onClose={() => setShowVideo(false)}
                /> */}
                <VideoCall
  socket={socketRef.current}
  currentUser={user.username}
  onClose={() => setShowVideo(false)}
/>

              </div>
            )}

            {/* CHAT BOX */}
            <div className={`flex-1 ${showVideo ? "mt-[260px]" : ""}`}>
              <ChatBox
                interestId={selectedInterest.id}
                onSocketReady={(s) => (socketRef.current = s)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
