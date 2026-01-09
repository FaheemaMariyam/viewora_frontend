
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { confirmPasswordReset } from "../../api/authApi";
import { isValidOTP, isStrongPassword } from "../../utils/validators";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    //  validation before loading
    if (!isValidOTP(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset({
        email,
        otp,
        new_password: newPassword,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">
          Reset Password
        </h2>

        <input
          placeholder="OTP"
          className="w-full border px-3 py-2 rounded-md mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New password"
          className="w-full border px-3 py-2 rounded-md mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-xs text-red-600 mb-2 text-center">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-indigo-700 text-white py-2 rounded-md"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
