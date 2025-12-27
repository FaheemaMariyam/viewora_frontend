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

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div
      className="min-h-screen flex justify-center py-20
      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
      relative overflow-hidden"
    >
      {/* Ambient background glow */}
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
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Account Overview
          </h2>

          <div className="space-y-4 text-sm">

            {/* Role */}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Role</span>
              <span className="font-medium capitalize text-gray-800">
                {user.role}
              </span>
            </div>

            {/* Profile Status */}
            <div className="flex justify-between items-center">
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

            {/* Admin Approval (non-client only) */}
            {user.role !== "client" && (
              <div className="flex justify-between items-center">
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

          {/* Profile completion notice */}
          {!user.is_profile_complete && (
            <div
              className="mt-6 p-4 rounded-lg
              bg-orange-50/80
              border border-orange-200
              text-sm text-orange-700"
            >
              Please complete your profile to unlock all platform features.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
