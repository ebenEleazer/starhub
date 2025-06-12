import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useRequireAuth from "../hooks/useRequireAuth";

export default function Profile() {
  useRequireAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://starhub-backend.onrender.com/api/profile", {
      headers: { Authorization: "Bearer " + token }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message));
  }, [navigate]);

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-6">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white drop-shadow">StarHub</h1>
        <p className="text-sm italic text-white opacity-80">Connecting Space Enthusiasts Across the Universe</p>
      </header>

      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

        {profile.avatar_url && (
          <div className="flex justify-center mb-4">
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
            />
          </div>
        )}

        <div className="space-y-2 text-center">
          <p><strong>Username:</strong> {profile.username}</p>
          {profile.name && <p><strong>Name:</strong> {profile.name}</p>}
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.bio && <p className="text-gray-300 mt-2 whitespace-pre-wrap">{profile.bio}</p>}
        </div>

        <div className="flex justify-center mt-4">
          <Link
            to="/settings"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
          >
            ⚙️ Settings
          </Link>
        </div>

        <div className="flex justify-around mt-6 text-sm text-blue-300">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/channels" className="hover:underline">Channels</Link>
          <Link to="/articles" className="hover:underline">Articles</Link>
        </div>
      </div>
    </div>
  );
}