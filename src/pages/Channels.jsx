import { useNavigate } from "react-router-dom";

export default function Channels() {
  const navigate = useNavigate();
  const channels = ["astronomy", "stargazing", "space-news"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Select a Channel</h1>
      <div className="space-y-4">
        {channels.map((channel) => (
          <button
            key={channel}
            onClick={() => navigate(`/channels/${channel}`)}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            {channel}
          </button>
        ))}
      </div>
    </div>
  );
}