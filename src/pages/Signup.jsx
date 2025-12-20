import { signup } from "../api/authApi";

const Signup = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value,
    };

    await signup(data);
    alert("Signup successful");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" />
      <input name="email" placeholder="Email" />
      <input name="password" type="password" />
      <select name="role">
        <option value="client">Client</option>
        <option value="seller">Seller</option>
        <option value="broker">Broker</option>
      </select>
      <button>Signup</button>
    </form>
  );
};

export default Signup;
