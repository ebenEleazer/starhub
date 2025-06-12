import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getProfile } from "../api"; // make sure the path is correct

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginData = await loginUser(email, password);
      const token = loginData.token;

      localStorage.setItem("token", token);

      const profile = await getProfile(token);
      localStorage.setItem("profile", JSON.stringify(profile));

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-indigo-900 to-black text-white">
      <div className="max-w-md w-full bg-opacity-10 backdrop-blur-md bg-black border border-indigo-600 p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-1">StarHub</h1>
        <p className="text-sm italic text-center mb-6">Connecting Space Enthusiasts Across the Universe</p>
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}