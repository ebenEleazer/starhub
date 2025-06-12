import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("username", username);
      if (name) formData.append("name", name);
      if (bio) formData.append("bio", bio);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("https://starhub-backend.onrender.com/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-black text-white px-4">
      <div className="max-w-md w-full bg-opacity-10 bg-white backdrop-blur-lg p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-2 text-white drop-shadow-lg">StarHub</h1>
        <p className="text-sm text-center mb-6 text-gray-300 italic">
          Connecting Space Enthusiasts Across the Universe
        </p>

        <h2 className="text-2xl font-bold mb-4">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4" encType="multipart/form-data">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name (optional)"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
          <textarea
            placeholder="Bio (optional)"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded text-white font-medium"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}