import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyAdminOtp } from "../../api/authApi";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

export default function AdminOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const submitOtp = async () => {
    try {
      await verifyAdminOtp({
        username: state.username,
        otp,
      });

      await loginUser();
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Admin OTP Verification</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="border p-2 w-full mb-4"
        />

        <button
          onClick={submitOtp}
          className="bg-black text-white px-4 py-2 w-full"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
