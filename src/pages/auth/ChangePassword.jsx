import { useState } from "react";
import { changePassword } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
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
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Old password"
          className="w-full border px-3 py-2 rounded-md mb-3"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
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

        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-indigo-700 text-white py-2 rounded-md"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
