
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { setupNotifications } from "../firebase/notification";

export default function Profile() {
  const { user, setTotalUnread } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect brokers / sellers away from profile
  useEffect(() => {
    if (!user) return;

    if (user.role === "broker") {
      navigate("/broker");
    } else if (user.role === "seller") {
      navigate("/seller");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-page py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-brand-primary h-32 relative">
             {/* Cover Pattern or Color */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end space-x-5">
                <div className="h-24 w-24 bg-white rounded-full p-1 shadow-md">
                   <div className="h-full w-full bg-brand-secondary rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {user.username?.[0]?.toUpperCase() || "U"}
                   </div>
                </div>
                <div className="mb-1">
                  <h2 className="text-2xl font-bold text-brand-primary">{user.username}</h2>
                  <p className="text-sm text-text-muted">{user.email}</p>
                </div>
              </div>
              
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-accent border border-blue-100 capitalize">
                {user.role}
              </span>
            </div>

            {/* Profile Status Badge */}
            <div className="flex gap-3">
              <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border ${user.is_profile_complete ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${user.is_profile_complete ? "bg-green-500" : "bg-amber-500"}`}></span>
                {user.is_profile_complete ? "Profile Complete" : "Profile Incomplete"}
              </div>

              {user.role !== "client" && (
                <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border ${user.is_admin_approved ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${user.is_admin_approved ? "bg-green-500" : "bg-amber-500"}`}></span>
                  {user.is_admin_approved ? "Verified" : "Pending Approval"}
                </div>
              )}
            </div>
          </div>
        </div>

        {!user.is_profile_complete && (
          <div className="mb-6 p-4 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-800 flex items-start">
            <span className="mr-2 text-lg">⚠️</span>
            <div className="mt-0.5">
              <p className="font-semibold">Action Required</p>
              <p>Please complete your profile details to unlock full platform features, including messaging and property listings.</p>
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-brand-primary mb-4 border-b border-gray-100 pb-2">
            Account Management
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/change-password")}
              className="flex items-center justify-between p-4 rounded-md border border-gray-200 hover:border-brand-accent hover:bg-blue-50 transition group"
            >
              <span className="font-medium text-text-main group-hover:text-brand-accent">Change Password</span>
              <span className="text-gray-400 group-hover:text-brand-accent">→</span>
            </button>

            <button
              onClick={() =>
                setupNotifications({
                  onUnreadIncrement: () =>
                    setTotalUnread((prev) => prev + 1),
                })
              }
              className="flex items-center justify-between p-4 rounded-md border border-gray-200 hover:border-brand-accent hover:bg-blue-50 transition group"
            >
              <span className="font-medium text-text-main group-hover:text-brand-accent">Enable Notifications</span>
              <span className="text-gray-400 group-hover:text-brand-accent">🔔</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
