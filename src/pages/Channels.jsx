import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://starhub-backend.onrender.com/api/channels")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch channels");
        return res.json();
      })
      .then((data) => setChannels(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Select a Channel</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => navigate(`/channels/${channel.name}`)}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
}