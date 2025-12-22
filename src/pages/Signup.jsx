// import { signup } from "../api/authApi";

// const Signup = () => {
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//       username: e.target.username.value,
//       email: e.target.email.value,
//       password: e.target.password.value,
//       role: e.target.role.value,
//     };

//     await signup(data);
//     alert("Signup successful");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="username" placeholder="Username" />
//       <input name="email" placeholder="Email" />
//       <input name="password" type="password" />
//       <select name="role">
//         <option value="client">Client</option>
//         <option value="seller">Seller</option>
//         <option value="broker">Broker</option>
//       </select>
//       <div id="recaptcha-container"></div>

//       <button>Signup</button>
//     </form>
//   );
// };

// export default Signup;
import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { signup } from "../api/authApi";

export default function Signup() {
  const recaptchaRef = useRef(null);
  const confirmationRef = useRef(null);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "normal" }
      );
      recaptchaRef.current.render();
    }
  }, []);

  const sendOtp = async () => {
    try {
      confirmationRef.current = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaRef.current
      );
      setOtpSent(true);
      alert("OTP sent");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmationRef.current.confirm(otp);
      setVerified(true);
      alert("Phone verified");
    } catch {
      alert("Invalid OTP");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const token = await auth.currentUser.getIdToken();

    await signup({
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value,
      firebase_token: token,
    });

    alert("Signup success");
  };

  return (
    <>
      <form onSubmit={submit}>
        <input name="username" placeholder="Username" required />
        <input name="email" placeholder="Email" required />
        <input name="password" type="password" required />
        <select name="role">
          <option value="client">Client</option>
          <option value="seller">Seller</option>
          <option value="broker">Broker</option>
        </select>

        <input
          placeholder="+916282422838"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {!otpSent && (
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        )}

        {otpSent && !verified && (
          <>
            <input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {verified && <button type="submit">Signup</button>}
      </form>

      <div id="recaptcha-container"></div>
    </>
  );
}
