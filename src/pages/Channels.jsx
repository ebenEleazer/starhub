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
      .catch((err) => setError(err.message));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">StarHub</h1>
      <p className="text-gray-300 italic mb-8 text-center">
        Join a channel and start a conversation with the cosmos 🌌
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {channels.length === 0 ? (
          <p className="col-span-full text-gray-400 text-center">
            No channels available.
          </p>
        ) : (
          channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => navigate(`/channels/${channel.name}`)}
              className="bg-indigo-600 hover:bg-indigo-700 transition rounded-xl p-4 shadow-md w-full text-lg font-semibold"
            >
              #{channel.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}