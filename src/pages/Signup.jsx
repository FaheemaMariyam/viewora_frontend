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
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-4 py-12">
      
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-lg p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-primary tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Join <span className="font-semibold text-brand-primary">Viewora</span> to access premium real estate experiences
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Username</label>
              <input
                name="username"
                placeholder="Username"
                required
                className="w-full px-3 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full px-3 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-3 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Account type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md bg-white border border-gray-300 text-text-main focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-sm"
            >
              <option value="client">Client (Buyer / Renter)</option>
              <option value="seller">Property Owner</option>
              <option value="broker">Broker / Agent</option>
            </select>
          </div>

          {/* Seller documents */}
          {role === "seller" && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 space-y-2">
              <p className="text-sm font-medium text-brand-primary">
                Ownership Verification
              </p>
              <input
                type="file"
                onChange={(e) => setOwnershipProof(e.target.files[0])}
                className="block w-full text-sm text-text-muted
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-primary file:text-white
                  hover:file:bg-brand-secondary
                  cursor-pointer"
              />
            </div>
          )}

          {/* Broker documents */}
          {role === "broker" && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 space-y-3">
              <p className="text-sm font-medium text-brand-primary">
                Broker Verification
              </p>

              <input
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />

              <input
                type="file"
                onChange={(e) => setCertificate(e.target.files[0])}
                className="block w-full text-sm text-text-muted
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-primary file:text-white
                  hover:file:bg-brand-secondary
                  cursor-pointer"
              />
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Phone number
            </label>
            <input
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all shadow-sm"
            />
          </div>

          {/* OTP actions */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full py-2.5 rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition shadow-sm"
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
                className="w-full px-3 py-2.5 rounded-md bg-white border border-gray-300 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-2.5 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm"
              >
                Verify Phone
              </button>
            </div>
          )}

          {verified && (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition shadow-md disabled:opacity-75"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          )}

          <p className="text-sm text-center text-text-muted pt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-brand-accent font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
