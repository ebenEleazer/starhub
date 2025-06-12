import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to post an article.");
        return;
      }

      try {
        const res = await fetch("https://starhub-backend.onrender.com/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.error || "Failed to fetch profile.");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token || !profile?.email) {
      setError("You must be logged in to post an article.");
      return;
    }

    try {
      const res = await fetch("https://starhub-backend.onrender.com/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          author_email: profile.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish article.");
      }

      navigate("/articles");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Publish a New Article</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Article Title"
            className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Write your article here..."
            className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg text-white font-semibold"
          >
            Publish Article
          </button>
        </form>
      </div>
    </div>
  );
}