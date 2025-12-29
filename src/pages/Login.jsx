
// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../api/authApi";
// import { AuthContext } from "../auth/AuthContext";

// export default function Login() {
//   const { loginUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await login({
//         username: e.target.username.value,
//         password: e.target.password.value,
//       });

//       await loginUser();
//       navigate("/profile");
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center 
//       bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 relative overflow-hidden">

//       {/* Ambient background glow */}
//       <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full" />
//       <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-slate-600/20 blur-3xl rounded-full" />

//       {/* Card */}
//       <div className="relative w-full max-w-md
//         bg-gradient-to-b from-white/90 to-white/80
//         backdrop-blur-xl
//         border border-white/20
//         rounded-2xl
//         shadow-[0_20px_60px_rgba(0,0,0,0.25)]
//         p-8">

//         {/* Inner highlight */}
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl pointer-events-none" />

//         {/* Content */}
//         <div className="relative">
//           <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
//             Welcome back
//           </h2>

//           <p className="text-sm text-gray-600 text-center mb-6">
//             Sign in to continue to Viewora
//           </p>

//           {error && (
//             <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-md text-center">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
            
//             {/* Username */}
//             <input
//               name="username"
//               placeholder="Username"
//               required
//               className="w-full px-4 py-3 rounded-lg
//               bg-white/70
//               border border-gray-300/70
//               focus:ring-2 focus:ring-indigo-600
//               focus:border-indigo-600
//               outline-none"
//             />

//             {/* Password */}
//             <input
//               name="password"
//               type="password"
//               placeholder="Password"
//               required
//               className="w-full px-4 py-3 rounded-lg
//               bg-white/70
//               border border-gray-300/70
//               focus:ring-2 focus:ring-indigo-600
//               focus:border-indigo-600
//               outline-none"
//             />

//             {/* Button */}
//             <button
//               disabled={loading}
//               className="w-full py-3 mt-2 rounded-lg
//               bg-gradient-to-r from-indigo-700 to-slate-900
//               text-white font-semibold
//               hover:from-indigo-800 hover:to-black
//               transition shadow-lg"
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>

//             <p className="text-sm text-center text-gray-600 pt-3">
//               Don’t have an account?{" "}
//               <span
//                 onClick={() => navigate("/signup")}
//                 className="text-indigo-700 font-medium cursor-pointer hover:underline"
//               >
//                 Create account
//               </span>

//             </p>
//             <button
//   type="button"
//   onClick={() => navigate("/forgot-password")}
//   className="text-sm text-indigo-600 mt-3"
// >
//   Forgot password?
// </button>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({
        username: e.target.username.value,
        password: e.target.password.value,
      });

      await loginUser();
      navigate("/profile");
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 relative overflow-hidden">

      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-slate-600/20 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md
        bg-gradient-to-b from-white/90 to-white/80
        backdrop-blur-xl
        border border-white/20
        rounded-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        p-8">

        <div className="relative">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Welcome back
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            Sign in to continue to Viewora
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              required
              className="w-full px-4 py-3 rounded-lg
              bg-white/70
              border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600
              outline-none"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg
              bg-white/70
              border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600
              outline-none"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg
              bg-gradient-to-r from-indigo-700 to-slate-900
              text-white font-semibold
              hover:from-indigo-800 hover:to-black
              transition shadow-lg"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-sm text-center text-gray-600 pt-3">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-indigo-700 font-medium cursor-pointer hover:underline"
              >
                Create account
              </span>
            </p>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-indigo-600"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
