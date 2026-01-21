
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import {
  isValidPhone,
  isValidEmail,
  isStrongPassword,
} from "../utils/validators";
import { toast } from "react-toastify";
import { ArrowRight, User, Mail, Lock, Phone, MapPin, Building2, Briefcase, FileCheck, Upload } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("client");

  // Seller / Broker extra fields
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [ownershipProof, setOwnershipProof] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [certificate, setCertificate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const phone = e.target.phone.value;

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (role === "seller" || role === "broker") {
      if (!city) {
        setError("City is required");
        return;
      }
      if (!area) {
        setError("Area is required");
        return;
      }
    }

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

    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("phone_number", phone);

    if (role === "seller" || role === "broker") {
      formData.append("city", city);
      formData.append("area", area);
    }

    if (role === "seller") {
      formData.append("ownership_proof", ownershipProof);
    }

    if (role === "broker") {
      formData.append("license_number", licenseNumber);
      formData.append("certificate", certificate);
    }

    try {
      await signup(formData);
      toast.success("Registration successful!");
      navigate(role === "client" ? "/login" : "/pending-approval");
    } catch (err) {
      const msg = err.response?.data
        ? "Registration failed. Please check your details."
        : "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleConfigs = {
    client: { icon: User, label: "Client" },
    seller: { icon: Building2, label: "Seller" },
    broker: { icon: Briefcase, label: "Broker" },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-16 px-4 font-sans text-[#1A1A1A] flex flex-col items-center">
      
      {/* Background Decorative Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-brand-primary/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-brand-primary/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2">Join Viewora</h1>
          <p className="text-sm font-medium text-gray-400">Select your role and create your professional account</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100/50">
          
          {/* Enhanced Role Selection */}
          <div className="flex bg-gray-50 p-1.5 rounded-[1.5rem] border border-gray-100 mb-10">
            {Object.entries(roleConfigs).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`
                  flex-1 py-3 px-2 rounded-[1.25rem] flex flex-col items-center gap-1.5 transition-all duration-300
                  ${role === key 
                    ? "bg-white text-[#1A1A1A] shadow-md shadow-black/5 ring-1 ring-gray-100" 
                    : "text-gray-400 hover:text-gray-600"}
                `}
              >
                <config.icon size={18} className={role === key ? "text-brand-primary" : "text-gray-300"} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{config.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-8 p-4 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Username</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
                  <input
                    name="username"
                    placeholder="Enter username"
                    required
                    className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
                  <input
                    name="phone"
                    placeholder="+91 0000 000000"
                    required
                    className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Premium Role Extra Fields */}
            {(role === "seller" || role === "broker") && (
              <div className="pt-8 border-t border-gray-100 space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 ml-1 mb-2">
                   <div className="w-1 h-3 bg-brand-primary rounded-full"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#1A1A1A]">Professional Credentials</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                  <div className="relative group">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      placeholder="Area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                {role === "broker" && (
                  <div className="relative group">
                    <FileCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      placeholder="License Number"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    {role === "seller" ? "Proof of Ownership" : "Broker Certificate"}
                  </label>
                  <div className="relative group/file">
                    <div className="w-full border-2 border-dashed border-gray-100 rounded-[1.5rem] p-6 bg-gray-50/50 group-hover/file:bg-white group-hover/file:border-brand-primary/30 transition-all flex flex-col items-center gap-2">
                       <Upload size={20} className="text-gray-300 group-hover/file:text-brand-primary transition-colors" />
                       <span className="text-[11px] font-bold text-gray-400 group-hover/file:text-[#1A1A1A] text-center max-w-[200px] truncate">
                         {(role === "seller" ? ownershipProof?.name : certificate?.name) || "Select Document (PDF/Image)"}
                       </span>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => role === "seller" ? setOwnershipProof(e.target.files[0]) : setCertificate(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl text-sm font-black tracking-tight hover:bg-black hover:shadow-xl hover:shadow-black/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-black/5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register as {role.charAt(0).toUpperCase() + role.slice(1)}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#1A1A1A] font-black hover:underline hover:underline-offset-4 decoration-2"
          >
            Sign In
          </button>
        </p>

        {/* Footer Info */}
        <div className="mt-16 text-center opacity-30 select-none flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-400">
           <span>Professional Identity Verified Platform</span>
        </div>
      </div>
    </div>
  );
}
