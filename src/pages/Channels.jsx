import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequireAuth from "../hooks/useRequireAuth";

export default function Channels() {
  useRequireAuth();
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://starhub-backend.onrender.com/api/channels", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch channels");
        return res.json();
      })
      .then((data) => setChannels(data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load channels. Please try again later.");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white flex flex-col items-center px-4 py-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">StarHub</h1>
        <p className="text-gray-300 italic mt-1">
          Join a channel and start a cosmic conversation 🌠
        </p>
      </header>

      {error && (
        <p className="bg-red-900 text-red-300 px-4 py-2 rounded shadow mb-6">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {channels.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">
            No channels available yet.
          </p>
        ) : (
          channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => navigate(`/channels/${channel.name}`)}
              className="bg-gradient-to-br from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-indigo-950 transition duration-200 ease-in-out p-4 rounded-2xl shadow-xl w-full text-white text-lg font-semibold tracking-wide backdrop-blur-sm glow"
            >
              #{channel.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}