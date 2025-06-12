import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useRequireAuth from "../hooks/useRequireAuth";

export default function ArticleDetail() {
  useRequireAuth();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://starhub-backend.onrender.com/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        return res.json();
      })
      .then((data) => setArticle(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        <p>Loading article...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/articles"
          className="text-indigo-400 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Articles
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow">
          {article.title}
        </h1>

        <p className="text-sm text-gray-400 mb-6">
          Posted by: {article.author_email || "Unknown"}
        </p>

        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow text-gray-200 whitespace-pre-wrap leading-relaxed">
          {article.content}
        </div>
      </div>
    </div>
  );
}