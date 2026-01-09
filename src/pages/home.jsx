
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">
        Viewora
      </h1>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-2 border border-blue-600 text-blue-600 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
