import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ArticleList() {
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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Articles</h1>

      <Link
        to="/articles/new"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        + New Article
      </Link>

      {error && (
        <p className="text-red-500 mb-4">Error: {error}</p>
      )}

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles yet.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li
              key={article.id}
              className="border p-4 rounded shadow bg-white hover:shadow-md transition"
            >
              <Link
                to={`/articles/${article.id}`}
                className="text-xl font-semibold text-indigo-700 hover:underline"
              >
                {article.title}
              </Link>
              <p className="text-gray-600 mt-1">
                {article.content.slice(0, 100)}...
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Posted by: {article.author_email || "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}