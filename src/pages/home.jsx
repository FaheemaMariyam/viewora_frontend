import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { logout } from "../api/authApi";
import { useContext } from "react";
const Home = () => {
 const {logoutUser}=useContext(AuthContext)
  const navigate = useNavigate(); // ✅ CORRECT place
  const handleLogout=async()=>{
  await logout()
  logoutUser()
  alert("logout successfully")
  navigate("/")
  }
  return (
    <>
      <h1>Hello Welcome</h1>

      <button onClick={() => navigate("/signup")}>
        Signup
      </button>

      <button onClick={() => navigate("/login")}>
        Login
      </button>

      <button onClick={() => navigate("/profile")}>
        Profile
      </button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Home;
