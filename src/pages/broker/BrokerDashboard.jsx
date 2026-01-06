
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { closeInterest } from "../../api/brokerApi";
import {
  getAvailableInterests,
  getAssignedInterests,
  acceptInterest,
} from "../../api/brokerApi";

import ChatBox from "../../components/ChatBox";
import { startInterest } from "../../api/brokerApi";
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
              // onClick={() => setSelectedInterest(interest)}
              onClick={async () => {
  setSelectedInterest(interest);

  if (interest.status === "assigned") {
    try {
      await startInterest(interest.id);

      // update list
      setAssignedInterests((prev) =>
        prev.map((i) =>
          i.id === interest.id
            ? { ...i, status: "in_progress" }
            : i
        )
      );

      // update selected interest
      setSelectedInterest((prev) =>
        prev ? { ...prev, status: "in_progress" } : prev
      );
    } catch (err) {
      console.error("Failed to start interest", err);
    }
  }
}}

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
              {selectedInterest?.status === "in_progress" && (
  <button
    onClick={async () => {
      if (!window.confirm("Are you sure you want to close this deal?")) return;

      await closeInterest(selectedInterest.id);

      alert("Deal closed successfully");

      setSelectedInterest(null);
      fetchAll(); // reload lists
    }}
    className="mb-3 w-full py-2 rounded
      bg-green-600 text-white text-sm font-semibold
      hover:bg-green-700"
  >
    Close Deal
  </button>
)}


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
