import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/articles`
        );
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error loading articles:", err.message);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-space-dark text-space-light p-6 font-futuristic">
      <h1 className="text-4xl text-space-accent mb-6">Articles</h1>
      <Link
        to="/articles/new"
        className="inline-block mb-4 px-4 py-2 bg-space-accent text-white rounded shadow-glow hover:bg-indigo-500"
      >
        + New Article
      </Link>
      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="p-4 bg-space-light text-black rounded shadow">
              <Link to={`/articles/${article.id}`} className="text-xl font-semibold text-space-dark hover:underline">
                {article.title}
              </Link>
              <p className="text-sm text-gray-600">By {article.author_name || "Unknown"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
