import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, sendPhoneOtp, verifyPhoneOtp } from "../api/authApi";
import {
  isValidPhone,
  isValidOTP,
  isValidEmail,
  isStrongPassword,
} from "../utils/validators";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("client");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  // Seller / Broker extra fields
  const [ownershipProof, setOwnershipProof] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [certificate, setCertificate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- OTP SEND ---------------- */
  const handleSendOtp = async () => {
    setError("");

    if (!isValidPhone(phone)) {
      setError("Enter a valid Indian phone number with country code (+91)");
      return;
    }

    const normalizedPhone = phone.startsWith("+91")
      ? phone.replace(/\s+/g, "")
      : `+91${phone.replace(/\s+/g, "")}`;

    setLoading(true);
    try {
      await sendPhoneOtp(normalizedPhone);
      setOtpSent(true);
      setPhone(normalizedPhone);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP VERIFY ---------------- */
  const handleVerifyOtp = async () => {
    setError("");

    if (!isValidOTP(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

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

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Frontend validations
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!verified) {
      setError("Please verify your phone number");
      return;
    }

    // Role-specific validations
    if (role === "seller" && !ownershipProof) {
      setError("Ownership document is required");
      return;
    }

    if (role === "broker") {
      if (!licenseNumber) {
        setError("License number is required");
        return;
      }
      if (!certificate) {
        setError("Broker certificate is required");
        return;
      }
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("phone_number", phone);

    if (role === "seller") {
      formData.append("ownership_proof", ownershipProof);
    }

    if (role === "broker") {
      formData.append("license_number", licenseNumber);
      formData.append("certificate", certificate);
    }

    setLoading(true);
    try {
      await signup(formData);
      navigate(role === "client" ? "/login" : "/pending-approval");
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800
    relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-slate-600/20 blur-3xl rounded-full" />

      <div
        className="relative w-full max-w-lg
      bg-gradient-to-b from-white/95 to-white/85
      backdrop-blur-xl
      border border-white/30
      rounded-3xl
      shadow-[0_25px_70px_rgba(0,0,0,0.35)]
      p-8 sm:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join <span className="font-medium text-indigo-700">Viewora</span> to
            access premium real estate experiences
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 text-sm text-red-700 bg-red-50
          border border-red-200 px-4 py-3 rounded-xl text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic details */}
          <div className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              required
              className="w-full px-4 py-3 rounded-xl
              bg-white/70 border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600 outline-none"
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full px-4 py-3 rounded-xl
              bg-white/70 border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600 outline-none"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl
              bg-white/70 border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Account type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl
              bg-white/70 border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="client">Client (Buyer / Renter)</option>
              <option value="seller">Property Owner</option>
              <option value="broker">Broker / Agent</option>
            </select>
          </div>

          {/* Seller documents */}
          {role === "seller" && (
            <div
              className="rounded-xl border border-indigo-200/60
            bg-indigo-50/40 p-4 space-y-2"
            >
              <p className="text-xs font-medium text-indigo-700">
                Ownership Verification
              </p>
              <input
                type="file"
                onChange={(e) => setOwnershipProof(e.target.files[0])}
                className="block w-full text-sm
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700"
              />
            </div>
          )}

          {/* Broker documents */}
          {role === "broker" && (
            <div
              className="rounded-xl border border-indigo-200/60
            bg-indigo-50/40 p-4 space-y-3"
            >
              <p className="text-xs font-medium text-indigo-700">
                Broker Verification
              </p>

              <input
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl
                bg-white/70 border border-gray-300/70
                focus:ring-2 focus:ring-indigo-600 outline-none"
              />

              <input
                type="file"
                onChange={(e) => setCertificate(e.target.files[0])}
                className="block w-full text-sm
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700"
              />
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone number
            </label>
            <input
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl
              bg-white/70 border border-gray-300/70
              focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          {/* OTP actions */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full py-3 rounded-xl
              bg-gradient-to-r from-indigo-700 to-slate-900
              text-white font-semibold
              hover:from-indigo-800 hover:to-black
              transition shadow-lg"
            >
              Send Verification Code
            </button>
          )}

          {otpSent && !verified && (
            <div className="space-y-3">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-center tracking-widest
                bg-white/70 border border-gray-300/70
                focus:ring-2 focus:ring-indigo-600 outline-none"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-xl
                bg-green-600 text-white font-semibold
                hover:bg-green-700 transition"
              >
                Verify Phone
              </button>
            </div>
          )}

          {verified && (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl
              bg-gradient-to-r from-indigo-700 to-slate-900
              text-white font-semibold
              hover:from-indigo-800 hover:to-black
              transition shadow-lg"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          )}

          <p className="text-sm text-center text-gray-600 pt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-700 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
