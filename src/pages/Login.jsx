import { login } from "../api/authApi";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
const Login = () => {
  
  const { loginUser } = useContext(AuthContext);
  const navigate=useNavigate()


 const handleSubmit = async (e) => {
  e.preventDefault();

  await login({
    username: e.target.username.value,
    password: e.target.password.value,
  });

  loginUser(); // ✅ no token
  alert("login successful")
};


  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <input name="password" type="password" />
      <button>Login</button>
      <button onClick={()=>navigate("/")}>Home</button>
    </form>
  );
};

export default Login;
