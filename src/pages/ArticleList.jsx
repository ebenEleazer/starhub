import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://starhub-backend.onrender.com/api/articles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch articles");
        return res.json();
      })
      .then((data) => setArticles(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-6">
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

      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="border p-4 rounded shadow bg-white">
            <Link
              to={`/articles/${article.id}`}
              className="text-xl font-semibold text-indigo-700 hover:underline"
            >
              {article.title}
            </Link>
            <p className="text-gray-600 mt-1">
              {article.content.slice(0, 100)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}