import { login } from "../api/authApi";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const Login = () => {
  const { loginUser } = useContext(AuthContext);

 const handleSubmit = async (e) => {
  e.preventDefault();

  await login({
    username: e.target.username.value,
    password: e.target.password.value,
  });

  loginUser(); // ✅ no token
};


  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <input name="password" type="password" />
      <button>Login</button>
    </form>
  );
};

export default Login;
