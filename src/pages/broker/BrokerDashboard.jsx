
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
  
  // 'requests' | 'clients'
  const [activeTab, setActiveTab] = useState("requests");
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
  const handleAccept = async (interestId, e) => {
    // Prevent selecting the item when clicking accept
    e.stopPropagation();
    try {
      await acceptInterest(interestId);
      // Remove from available list
      setAvailableInterests((prev) => prev.filter((i) => i.id !== interestId));
      // Reload assigned interests
      const res = await getAssignedInterests();
      setAssignedInterests(res.data);
      
      // Optional: switch tab to clients
      setActiveTab("clients");
    } catch (err) {
      alert("Failed to accept interest");
    }
  };

  /* ---------------- SELECT INTEREST ---------------- */
  const handleSelectInterest = async (interest) => {
    setSelectedInterest(interest);

    // If it's a client interaction and just assigned, start it
    if (activeTab === "clients" && interest.status === "assigned") {
      try {
        await startInterest(interest.id);
        
        const updated = { ...interest, status: "in_progress" };
        
        setAssignedInterests((prev) =>
          prev.map((i) => (i.id === interest.id ? updated : i))
        );
        setSelectedInterest(updated);
      } catch (err) {
        console.error("Failed to start interest", err);
      }
    }
  };

  /* ---------------- STATUS BADGE ---------------- */
  const statusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "in_progress":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "closed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  /* ---------------- RENDER SIDEBAR LIST ---------------- */
  const renderList = () => {
    const list = activeTab === "requests" ? availableInterests : assignedInterests;

    if (fetching) return <div className="p-6 text-sm text-text-muted">Loading...</div>;

    if (list.length === 0) {
      return (
        <div className="p-8 text-center text-text-muted">
          <p className="text-sm">No {activeTab === "requests" ? "new requests" : "active clients"}.</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-100">
        {list.map((interest) => (
          <div
            key={interest.id}
            onClick={() => handleSelectInterest(interest)}
            className={`
              p-4 cursor-pointer transition-all border-l-4
              ${selectedInterest?.id === interest.id 
                ? "bg-blue-50/50 border-brand-accent scale-[1.02] shadow-sm z-10" 
                : "border-transparent hover:bg-gray-50"}
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold text-brand-primary line-clamp-1">
                {interest.property}
              </h4>
              {activeTab === "clients" && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${statusColor(interest.status)}`}>
                  {interest.status.replace("_", " ")}
                </span>
              )}
            </div>

            <p className="text-xs text-text-muted mb-2">
              Client: <span className="text-text-main font-medium">{interest.client}</span>
            </p>

            {activeTab === "requests" && (
              <button
                onClick={(e) => handleAccept(interest.id, e)}
                className="
                  mt-1 w-full py-1.5 rounded text-xs font-semibold
                  bg-brand-primary text-white
                  hover:bg-brand-secondary transition
                  shadow-sm
                "
              >
                Accept Request
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-page flex flex-col md:flex-row max-w-7xl mx-auto md:py-6 md:px-6 h-[100vh]">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col bg-white border-r border-gray-200 shadow-xl z-10 md:rounded-l-lg overflow-hidden">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <h1 className="text-xl font-bold text-brand-primary tracking-tight">Broker Dashboard</h1>
          <p className="text-xs text-text-muted mt-1">Manage your leads and clients</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setActiveTab("requests"); setSelectedInterest(null); }}
            className={`
              flex-1 py-3 text-sm font-medium transition-colors relative
              ${activeTab === "requests" ? "text-brand-primary bg-gray-50" : "text-text-muted hover:text-text-main hover:bg-gray-50"}
            `}
          >
            New Requests
            {availableInterests.length > 0 && (
              <span className="ml-2 bg-brand-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {availableInterests.length}
              </span>
            )}
            {activeTab === "requests" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
          </button>
          
          <button
            onClick={() => { setActiveTab("clients"); setSelectedInterest(null); }}
            className={`
              flex-1 py-3 text-sm font-medium transition-colors relative
              ${activeTab === "clients" ? "text-brand-primary bg-gray-50" : "text-text-muted hover:text-text-main hover:bg-gray-50"}
            `}
          >
            My Clients
            {activeTab === "clients" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderList()}
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">
               {user?.username?.charAt(0).toUpperCase()}
             </div>
             <div className="text-xs">
               <p className="font-semibold text-brand-primary">Logged in as {user?.username}</p>
               <p className="text-green-600 font-medium">● Online</p>
             </div>
           </div>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="hidden md:flex flex-1 flex-col bg-bg-surface md:rounded-r-lg shadow-xl overflow-hidden border border-l-0 border-gray-200 relative">
        
        {selectedInterest ? (
          <>
            {/* Header */}
            <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
              <div>
                <h2 className="text-sm font-bold text-brand-primary">{selectedInterest.property}</h2>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>Client: {selectedInterest.client}</span>
                  {selectedInterest.status && (
                    <span className={`px-1.5 rounded-sm border ${statusColor(selectedInterest.status)}`}>
                      {selectedInterest.status.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <button
                   onClick={async () => {
                     const permission = await Notification.requestPermission();
                     console.log("Permission:", permission);
                   }}
                   title="Enable Notifications"
                   className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                 </button>

                 {selectedInterest.status === "in_progress" && (
                   <button
                    onClick={async () => {
                      if (!window.confirm("Are you sure you want to close this deal?")) return;
                      await closeInterest(selectedInterest.id);
                      alert("Deal closed successfully");
                      setSelectedInterest(null);
                      fetchAll();
                    }}
                    className="
                      px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-bold uppercase
                      hover:bg-emerald-700 transition shadow-sm
                    "
                   >
                     Close Deal
                   </button>
                 )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-white">
              {activeTab === "clients" ? (
                <ChatBox interestId={selectedInterest.id} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-brand-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-brand-primary mb-2">Request Details</h3>
                  <p className="text-text-muted text-sm max-w-sm mb-6">
                    {selectedInterest.client} is interested in <span className="font-semibold">{selectedInterest.property}</span>.
                    Accept the request to start chatting and negotiating.
                  </p>
                  <button
                    onClick={(e) => handleAccept(selectedInterest.id, e)}
                    className="px-6 py-2.5 bg-brand-primary text-white font-semibold rounded hover:bg-brand-secondary transition shadow-lg"
                  >
                    Accept Request
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted bg-gray-50/50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100 text-brand-primary/50">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
               </svg>
            </div>
            <h3 className="text-lg font-bold text-brand-primary mb-2">Welcome Back, {user?.username}</h3>
            <p className="text-sm max-w-xs text-center">
              Select a request or an active client from the sidebar to view details and messages.
            </p>
          </div>
        )}
      </div>
      
      {/* Mobile Notice: Show only on very small screens if sidebar is hidden (handled via media queries implicitly by flex structure, but here we keep sidebar always visible on mobile for now, overlaying main content would be better for real mobile app but this is sufficient for web-view) */}
    </div>
  );
}
