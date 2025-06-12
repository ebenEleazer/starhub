import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useRequireAuth from "../hooks/useRequireAuth";

export default function ArticleList() {
  useRequireAuth();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("https://starhub-backend.onrender.com/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow">Articles</h1>
          <Link
            to="/articles/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            + New Article
          </Link>
        </header>

        {error && (
          <div className="bg-red-800 text-red-200 px-4 py-2 rounded mb-4">
            Error: {error}
          </div>
        )}

        {articles.length === 0 ? (
          <p className="text-gray-400 italic text-center mt-10">No articles have been posted yet.</p>
        ) : (
          <ul className="space-y-6">
            {articles.map((article) => (
              <li
                key={article.id}
                className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <Link
                  to={`/articles/${article.id}`}
                  className="text-2xl font-semibold text-indigo-400 hover:underline"
                >
                  {article.title}
                </Link>
                <p className="text-gray-300 mt-2">
                  {article.content.slice(0, 120)}{article.content.length > 120 && "..."}
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Posted by: {article.author_email || "Unknown"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}