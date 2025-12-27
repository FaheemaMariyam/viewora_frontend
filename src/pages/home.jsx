// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../auth/AuthContext";
// import { logout } from "../api/authApi";
// import { useContext } from "react";
// const Home = () => {
//  const {logoutUser}=useContext(AuthContext)
//   const navigate = useNavigate(); // ✅ CORRECT place
//   const handleLogout=async()=>{
//   await logout()
//   logoutUser()
//   alert("logout successfully")
//   navigate("/")
//   }
//   return (
//     <>
//       <h1>Hello Welcome</h1>

//       <button onClick={() => navigate("/signup")}>
//         Signup
//       </button>

//       <button onClick={() => navigate("/login")}>
//         Login
//       </button>

//       <button onClick={() => navigate("/profile")}>
//         Profile
//       </button>
//       <button onClick={handleLogout}>Logout</button>
//     </>
//   );
// };

// export default Home;
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
