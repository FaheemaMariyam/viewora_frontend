import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { AuthContext } from "../auth/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../api/authApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

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
      const res = await login({
        username: e.target.username.value,
        password: e.target.password.value,
      });

      // // 🔐 Broker OTP flow
      // if (res.data?.otp_required && res.data.role === "broker") {
      //   navigate("/broker-otp", {
      //     state: { username: e.target.username.value },
      //   });
      //   return;
      // }
      if (res.data?.mfa_required) {
  navigate("/admin/otp", {
    state: { username: e.target.username.value },
  });
  return;
}

// 🔐 Broker OTP flow
if (res.data?.otp_required && res.data.role === "broker") {
  navigate("/broker-otp", {
    state: { username: e.target.username.value },
  });
  return;
}

      // ✅ Normal login
      await loginUser();
      navigate("/profile");

    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-4">
      
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-primary mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-text-muted">
            Sign in to access your property dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="username"
            label="Username"
            placeholder="Enter your username"
            required
          />

          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <div className="pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-brand-accent hover:underline font-medium"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-text-muted hover:text-brand-primary"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center">
          <GoogleLogin
            theme="outline"
            size="large"
            width="100%"
            text="continue_with"
            onSuccess={async (res) => {
              try {
                await googleLogin(res.credential);
                await loginUser();
                navigate("/profile");
              } catch {
                setError("Google login failed");
              }
            }}
            onError={() => setError("Google login failed")}
          />
        </div>

      </div>
    </div>
  );
}
