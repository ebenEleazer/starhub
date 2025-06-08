import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      setMessage("Registration successful! Redirecting to login...");
      // Redirect to login after 2 seconds
      setTimeout(function () {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={function (e) {
            setEmail(e.target.value);
          }}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={function (e) {
            setPassword(e.target.value);
          }}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-2 text-center">{message}</p>}
    </div>
  );
}