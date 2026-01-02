
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import ChatBox from "../../components/ChatBox";
// import axiosInstance from "../../utils/axiosInstance";

// export default function Chats() {
//   const { user, loading } = useContext(AuthContext);
//   const [interests, setInterests] = useState([]);
//   const [selectedInterest, setSelectedInterest] = useState(null);

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

//   return (
//     <div className="min-h-screen p-6 bg-slate-100">
//       <h1 className="text-2xl font-semibold mb-6">My Chats</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* LEFT: Chat list */}
//         <div className="bg-white p-4 rounded shadow">
//           {interests.length === 0 && (
//             <p className="text-sm text-gray-500">
//               No chats yet
//             </p>
//           )}

//           {interests.map((interest) => (
//             <div
//               key={interest.id}
//               onClick={() => setSelectedInterest(interest)}
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

//         {/* RIGHT: Chat */}
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
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import ChatBox from "../../components/ChatBox";
import axiosInstance from "../../utils/axiosInstance";

export default function Chats() {
  const {
    user,
    loading,
    setTotalUnread,
  } = useContext(AuthContext);

  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);

  useEffect(() => {
    if (!user || loading) return;

    if (user.role === "client") {
      fetchClientChats();
    } else if (user.role === "broker") {
      fetchBrokerChats();
    }
  }, [user, loading]);

  const fetchClientChats = async () => {
    const res = await axiosInstance.get(
      "/api/interests/client/interests/"
    );
    setInterests(res.data);
  };

  const fetchBrokerChats = async () => {
    const res = await axiosInstance.get(
      "/api/interests/broker/interests/"
    );
    setInterests(res.data);
  };

  // 🔥 KEY LOGIC — clear unread without refresh
  const handleSelectChat = async (interest) => {
    setSelectedInterest(interest);

    if (interest.unread_count > 0) {
      // mark read in backend
      await axiosInstance.post(
        `/api/chat/interest/${interest.id}/read/`
      );

      // update chat list instantly
      setInterests((prev) =>
        prev.map((i) =>
          i.id === interest.id
            ? { ...i, unread_count: 0 }
            : i
        )
      );

      // update navbar instantly
      setTotalUnread((prev) =>
        Math.max(prev - interest.unread_count, 0)
      );
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-2xl font-semibold mb-6">My Chats</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="bg-white p-4 rounded shadow">
          {interests.length === 0 && (
            <p className="text-sm text-gray-500">
              No chats yet
            </p>
          )}

          {interests.map((interest) => (
            <div
              key={interest.id}
              onClick={() => handleSelectChat(interest)}
              className="border p-3 mb-2 rounded cursor-pointer hover:bg-slate-50"
            >
              <p className="font-medium">
                {interest.property}
              </p>

              {interest.unread_count > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  {interest.unread_count} unread
                </span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          {selectedInterest ? (
            <ChatBox interestId={selectedInterest.id} />
          ) : (
            <p className="text-gray-500">
              Select a chat to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
