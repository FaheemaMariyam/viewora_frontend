// import { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../auth/AuthContext";
// import { getAssignedInterests } from "../../api/brokerApi";
// import ChatBox from "../../components/ChatBox";

// export default function BrokerDashboard() {
//   const { user, loading } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [interests, setInterests] = useState([]);
//   const [selectedInterest, setSelectedInterest] = useState(null);
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     if (loading) return;

//     if (user?.role !== "broker") {
//       navigate("/");
//       return;
//     }

//     fetchInterests();
//   }, [user, loading]);

//   const fetchInterests = async () => {
//     try {
//       setFetching(true);
//       const res = await getAssignedInterests();
//       setInterests(res.data);
//     } catch (err) {
//       console.error("Failed to load interests", err);
//     } finally {
//       setFetching(false);
//     }
//   };

//   const statusColor = (status) => {
//     switch (status) {
//       case "assigned":
//         return "bg-indigo-100 text-indigo-700";
//       case "in_progress":
//         return "bg-amber-100 text-amber-700";
//       case "closed":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-slate-100">
//       <h1 className="text-2xl font-semibold mb-6">
//         Broker Dashboard
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* LEFT: Interests list */}
//         <div className="bg-white p-4 rounded-xl shadow md:col-span-1">
//           <h2 className="font-semibold mb-4">Assigned Interests</h2>

//           {fetching && (
//             <p className="text-sm text-gray-500">Loading interests...</p>
//           )}

//           {!fetching && interests.length === 0 && (
//             <p className="text-sm text-gray-500">
//               No interests assigned yet.
//             </p>
//           )}

//           {!fetching &&
//             interests.map((interest) => (
//               <div
//                 key={interest.id}
//                 onClick={() => setSelectedInterest(interest)}
//                 className={`border p-3 mb-3 rounded-lg cursor-pointer transition
//                   ${
//                     selectedInterest?.id === interest.id
//                       ? "border-indigo-600 bg-indigo-50"
//                       : "hover:bg-slate-50"
//                   }`}
//               >
//                 <p className="font-medium text-sm">
//                   {interest.property}
//                 </p>

//                 <p className="text-xs text-gray-500 mt-1">
//                   Client: {interest.client}
//                 </p>

//                 <span
//                   className={`inline-block mt-2 px-2 py-1 text-xs rounded ${statusColor(
//                     interest.status
//                   )}`}
//                 >
//                   {interest.status.replace("_", " ")}
//                 </span>
//               </div>
//             ))}
//         </div>

//         {/* RIGHT: Chat */}
//         <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
//           {selectedInterest ? (
//             <>
//               <div className="border-b pb-2 mb-3">
//                 <p className="font-semibold">
//                   {selectedInterest.property}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Chat with {selectedInterest.client}
//                 </p>
//               </div>

//               <ChatBox interestId={selectedInterest.id} />
//             </>
//           ) : (
//             <div className="h-full flex items-center justify-center text-gray-400">
//               Select an interest to start chatting
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

import {
  getAvailableInterests,
  getAssignedInterests,
  acceptInterest,
} from "../../api/brokerApi";

import ChatBox from "../../components/ChatBox";

export default function BrokerDashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [availableInterests, setAvailableInterests] = useState([]);
  const [assignedInterests, setAssignedInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [fetching, setFetching] = useState(true);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "broker") {
      navigate("/");
      return;
    }

    fetchAll();
  }, [user, loading]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchAll = async () => {
    try {
      setFetching(true);

      const [availableRes, assignedRes] = await Promise.all([
        getAvailableInterests(),
        getAssignedInterests(),
      ]);

      setAvailableInterests(availableRes.data);
      setAssignedInterests(assignedRes.data);
    } catch (err) {
      console.error("Failed to load broker data", err);
    } finally {
      setFetching(false);
    }
  };

  /* ---------------- ACCEPT INTEREST ---------------- */
  const handleAccept = async (interestId) => {
    try {
      await acceptInterest(interestId);

      // Remove from available list
      setAvailableInterests((prev) =>
        prev.filter((i) => i.id !== interestId)
      );

      // Reload assigned interests
      const res = await getAssignedInterests();
      setAssignedInterests(res.data);
    } catch (err) {
      alert("Failed to accept interest");
    }
  };

  /* ---------------- STATUS BADGE ---------------- */
  const statusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-indigo-100 text-indigo-700";
      case "in_progress":
        return "bg-amber-100 text-amber-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-2xl font-semibold mb-6">
        Broker Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* LEFT: AVAILABLE INTERESTS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">New Requests</h2>

          {fetching && (
            <p className="text-sm text-gray-500">Loading...</p>
          )}

          {!fetching && availableInterests.length === 0 && (
            <p className="text-sm text-gray-500">
              No new interests
            </p>
          )}

          {availableInterests.map((interest) => (
            <div
              key={interest.id}
              className="border p-3 mb-3 rounded-lg"
            >
              <p className="font-medium text-sm">
                {interest.property}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Client: {interest.client}
              </p>

              <button
                onClick={() => handleAccept(interest.id)}
                className="mt-3 w-full py-1.5 rounded
                bg-indigo-600 text-white text-sm
                hover:bg-indigo-700"
              >
                Accept
              </button>
            </div>
          ))}
        </div>

        {/* MIDDLE: ASSIGNED INTERESTS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">My Clients</h2>

          {assignedInterests.length === 0 && (
            <p className="text-sm text-gray-500">
              No active clients
            </p>
          )}

          {assignedInterests.map((interest) => (
            <div
              key={interest.id}
              onClick={() => setSelectedInterest(interest)}
              className={`border p-3 mb-3 rounded-lg cursor-pointer transition
                ${
                  selectedInterest?.id === interest.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "hover:bg-slate-50"
                }`}
            >
              <p className="font-medium text-sm">
                {interest.property}
              </p>

              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded
                  ${statusColor(interest.status)}`}
              >
                {interest.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>

        {/* RIGHT: CHAT */}
        <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
          {selectedInterest ? (
            <>
              <div className="border-b pb-2 mb-3">
                <p className="font-semibold">
                  {selectedInterest.property}
                </p>
                <p className="text-xs text-gray-500">
                  Chat with {selectedInterest.client}
                </p>
              </div>

              <ChatBox interestId={selectedInterest.id} />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a client to start chatting
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
