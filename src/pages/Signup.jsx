
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   signup,
//   sendPhoneOtp,
//   verifyPhoneOtp,
// } from "../api/authApi";
// import AuthLayout from "../components/AuthLayout";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [verified, setVerified] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSendOtp = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       await sendPhoneOtp(phone);
//       setOtpSent(true);
//     } catch {
//       setError("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       await verifyPhoneOtp(phone, otp);
//       setVerified(true);
//     } catch {
//       setError("Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!verified) {
//       setError("Please verify phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await signup({
//         username: e.target.username.value,
//         email: e.target.email.value,
//         password: e.target.password.value,
//         role: e.target.role.value,
//         phone_number: phone,
//       });

//       if (res.data.role === "client") {
//         navigate("/login");
//       } else {
//         navigate("/pending-approval");
//       }
//     } catch {
//       setError("Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout title="Create your Viewora account">
//       {error && (
//         <p className="text-red-500 text-sm mb-4 text-center">
//           {error}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="username"
//           placeholder="Username"
//           className="w-full border px-3 py-2 rounded"
//           required
//         />

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="w-full border px-3 py-2 rounded"
//           required
//         />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           className="w-full border px-3 py-2 rounded"
//           required
//         />

//         <select
//           name="role"
//           className="w-full border px-3 py-2 rounded"
//         >
//           <option value="client">Client</option>
//           <option value="seller">Seller</option>
//           <option value="broker">Broker</option>
//         </select>

//         <input
//           placeholder="+91XXXXXXXXXX"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//           required
//         />

//         {!otpSent && (
//           <button
//             type="button"
//             onClick={handleSendOtp}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded"
//           >
//             {loading ? "Sending OTP..." : "Send OTP"}
//           </button>
//         )}

//         {otpSent && !verified && (
//           <>
//             <input
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border px-3 py-2 rounded"
//             />
//             <button
//               type="button"
//               onClick={handleVerifyOtp}
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-2 rounded"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         {verified && (
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-2 rounded"
//           >
//             {loading ? "Creating account..." : "Sign Up"}
//           </button>
//         )}

//         <p className="text-sm text-center text-gray-600">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-blue-600 cursor-pointer hover:underline"
//           >
//             Login
//           </span>
//         </p>
//       </form>
//     </AuthLayout>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signup,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "../api/authApi";

export default function Signup() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await sendPhoneOtp(phone);
      setOtpSent(true);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await verifyPhoneOtp(phone, otp);
      setVerified(true);
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!verified) {
      setError("Please verify your phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
        role: e.target.role.value,
        phone_number: phone,
      });

      if (res.data.role === "client") {
        navigate("/login");
      } else {
        navigate("/pending-approval");
      }
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 
      relative overflow-hidden">

      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-slate-600/20 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative w-full max-w-md
        bg-gradient-to-b from-white/90 to-white/80
        backdrop-blur-xl
        border border-white/20
        rounded-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        p-8">

        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Create your account
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            Join Viewora to explore virtual real estate
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <input
              name="username"
              placeholder="Username"
              required
              className="w-full px-4 py-3 rounded-lg
              bg-white/70
              border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600
              focus:border-indigo-600
              outline-none"
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full px-4 py-3 rounded-lg
              bg-white/70
              border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600
              focus:border-indigo-600
              outline-none"
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg
              bg-white/70
              border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600
              focus:border-indigo-600
              outline-none"
            />

            {/* Role */}
            <select
              name="role"
              className="w-full px-4 py-3 rounded-lg
              bg-white/70
              border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600
              focus:border-indigo-600
              outline-none"
            >
              <option value="client">Client (Buy / Rent)</option>
              <option value="seller">Property Owner</option>
              <option value="broker">Broker / Agent</option>
            </select>

            {/* Phone */}
            <input
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg
              bg-white/70
              border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600
              focus:border-indigo-600
              outline-none"
            />

            {/* OTP SEND */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 rounded-lg
                bg-gradient-to-r from-indigo-700 to-slate-900
                text-white font-semibold
                hover:from-indigo-800 hover:to-black
                transition shadow-lg"
              >
                {loading ? "Sending OTP..." : "Send Verification Code"}
              </button>
            )}

            {/* OTP VERIFY */}
            {otpSent && !verified && (
              <>
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg
                  bg-white/70
                  border border-gray-300/70
                  text-center tracking-widest
                  focus:ring-2 focus:ring-green-600
                  focus:border-green-600
                  outline-none"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3 rounded-lg
                  bg-green-600 text-white font-semibold
                  hover:bg-green-700 transition shadow-md"
                >
                  {loading ? "Verifying..." : "Verify Phone Number"}
                </button>
              </>
            )}

            {/* SUBMIT */}
            {verified && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg
                bg-gradient-to-r from-indigo-700 to-slate-900
                text-white font-semibold
                hover:from-indigo-800 hover:to-black
                transition shadow-lg"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            )}

            <p className="text-sm text-center text-gray-600 pt-3">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-700 font-medium cursor-pointer hover:underline"
              >
                login
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
