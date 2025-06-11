import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
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
    return (
      <div className="p-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      {profile.avatar && (
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
      )}
      <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
      <p className="text-lg"><strong>Email:</strong> {profile.email}</p>
      <p className="mt-2 text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
    </div>
  );
}