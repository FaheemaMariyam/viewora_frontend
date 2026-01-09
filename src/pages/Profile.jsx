
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
    <div
      className="
        min-h-screen flex items-center justify-center px-4
        bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
        relative overflow-hidden
      "
    >
      {/* 🌈 Ambient glows (FIXED: cannot block clicks anymore) */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-slate-600/20 blur-3xl rounded-full" />

      {/* 💳 Card (raised above glows) */}
      <div
        className="
          relative z-10 w-full max-w-xl
          bg-white/90 backdrop-blur-xl
          border border-white/20
          rounded-3xl
          shadow-[0_30px_80px_rgba(0,0,0,0.35)]
          p-8
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Account Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account & security
          </p>
        </div>

        {/* Info */}
        <div className="space-y-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Role</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Profile Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                user.is_profile_complete
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {user.is_profile_complete ? "Complete" : "Incomplete"}
            </span>
          </div>

          {user.role !== "client" && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Admin Approval</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.is_admin_approved
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {user.is_admin_approved ? "Approved" : "Pending"}
              </span>
            </div>
          )}
        </div>

        {!user.is_profile_complete && (
          <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-700">
            Complete your profile to unlock all platform features.
          </div>
        )}

        {/* Security */}
        <div className="mt-10 pt-6 border-t border-gray-200/60 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Account Security
          </h3>

          <button
            onClick={() => navigate("/change-password")}
            className="
              w-full py-3 rounded-xl
              bg-gradient-to-r from-indigo-700 to-slate-900
              text-white text-sm font-semibold
              hover:from-indigo-800 hover:to-black
              transition shadow-lg
            "
          >
            Change Password
          </button>

          {/* 🔔 WORKING Enable Notifications button */}
          <button
            onClick={() =>
              setupNotifications({
                onUnreadIncrement: () =>
                  setTotalUnread((prev) => prev + 1),
              })
            }
            className="
              w-full py-3 rounded-xl
              bg-indigo-600 text-white text-sm font-semibold
              hover:bg-indigo-700
              transition shadow-md
            "
          >
            Enable Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
