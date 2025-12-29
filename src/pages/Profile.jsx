// import { useEffect, useState } from "react";
// import { getProfile } from "../api/authApi";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     getProfile().then((res) => setProfile(res.data));
//   }, []);

//   return <pre>{JSON.stringify(profile, null, 2)}</pre>;
// };

// export default Profile;
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div
      className="min-h-screen flex justify-center py-20
      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
      relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-slate-600/20 blur-3xl rounded-full" />

      {/* Profile Card */}
      <div
        className="relative w-full max-w-lg
        bg-gradient-to-b from-white/90 to-white/80
        backdrop-blur-xl
        border border-white/20
        rounded-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Account Overview
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Profile Status</span>
            <span
              className={`font-medium ${
                user.is_profile_complete
                  ? "text-green-600"
                  : "text-orange-500"
              }`}
            >
              {user.is_profile_complete ? "Complete" : "Incomplete"}
            </span>
          </div>

          {user.role !== "client" && (
            <div className="flex justify-between">
              <span className="text-gray-500">Admin Approval</span>
              <span
                className={`font-medium ${
                  user.is_admin_approved
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {user.is_admin_approved ? "Approved" : "Pending"}
              </span>
            </div>
          )}
        </div>

        {!user.is_profile_complete && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
            Please complete your profile to unlock all features.
          </div>
        )}

        {/* 🔐 Account Security */}
        <div className="mt-8 border-t border-gray-200/60 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Account Security
          </h3>

          <button
            onClick={() => navigate("/change-password")}
            className="
              w-full py-2.5 rounded-lg
              bg-gradient-to-r from-indigo-700 to-slate-900
              text-white text-sm font-semibold
              hover:from-indigo-800 hover:to-black
              transition
            "
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
