
// import { useState, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { AuthContext } from "../../auth/AuthContext";

// export default function BrokerOTP() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { loginUser } = useContext(AuthContext);

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");

//   const verifyOtp = async () => {
//     try {
//       await axiosInstance.post("/api/auth/broker/verify-otp/", {
//         username: state.username,
//         otp,
//       });

//       // ✅ IMPORTANT: update auth state
//       await loginUser();

//       navigate("/broker");
//     } catch {
//       setError("Invalid or expired OTP");
//     }
//   };

//   return (
//     <div>
//       <input
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         placeholder="Enter OTP"
//       />
//       <button onClick={verifyOtp}>Verify OTP</button>
//       {error && <p>{error}</p>}
//     </div>
//   );
// }
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../auth/AuthContext";

export default function BrokerOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verifyOtp = async () => {
    try {
      await axiosInstance.post("/api/auth/broker/verify-otp/", {
        username: state.username,
        otp,
      });

      await loginUser();
      navigate("/broker");
    } catch {
      setError("Invalid or expired OTP");
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
        relative overflow-hidden
      "
    >
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-slate-600/20 blur-3xl rounded-full pointer-events-none" />

      {/* Card */}
      <div
        className="
          relative z-10 w-full max-w-sm
          bg-white/90 backdrop-blur-xl
          border border-white/20
          rounded-3xl
          shadow-[0_30px_80px_rgba(0,0,0,0.35)]
          p-8
        "
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Broker Verification
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter the OTP sent to your email
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mb-4 text-sm text-red-700 bg-red-50
              border border-red-200 px-4 py-2
              rounded-lg text-center
            "
          >
            {error}
          </div>
        )}

        {/* OTP Input */}
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="
            w-full text-center tracking-widest text-lg
            px-4 py-3 rounded-xl
            bg-white/70 border border-gray-300/70
            focus:ring-2 focus:ring-indigo-600
            outline-none
            mb-6
          "
        />

        {/* Button */}
        <button
          onClick={verifyOtp}
          className="
            w-full py-3 rounded-xl
            bg-gradient-to-r from-indigo-700 to-slate-900
            text-white font-semibold
            hover:from-indigo-800 hover:to-black
            transition shadow-lg
          "
        >
          Verify & Continue
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-gray-500">
          Didn’t receive the code? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
