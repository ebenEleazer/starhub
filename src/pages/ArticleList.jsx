import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then(async (articles) => {
        const updatedArticles = await Promise.all(
          articles.map(async (article) => {
            const res = await fetch(`/api/articles/${article.id}/likes`, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            });
            const likeData = await res.json();
            return { ...article, likes: likeData.count, liked: likeData.liked };
          })
        );
        setArticles(updatedArticles);
      });
  }, []);

  const toggleLike = async (articleId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/api/articles/${articleId}/like`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();

    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? {
              ...a,
              liked: data.liked,
              likes: a.likes + (data.liked ? 1 : -1),
            }
          : a
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-space-light">
      <h1 className="text-4xl font-bold mb-4 text-white drop-shadow glow">Articles</h1>
      {articles.map((article) => (
        <div
          key={article.id}
          className="card flex justify-between items-center border border-space-accent"
        >
          <div>
            <Link
              to={`/articles/${article.id}`}
              className="text-xl font-semibold text-space-accent hover:underline"
            >
              {article.title}
            </Link>
            <p className="text-sm mt-1 text-space-light">
              {article.likes} like{article.likes !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => toggleLike(article.id)}
            className={`px-4 py-2 rounded-full transition ${
              article.liked
                ? "bg-red-500 text-white shadow-glow"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {article.liked ? "♥ Liked" : "♡ Like"}
          </button>
        </div>
      ))}
    </div>
  );
}