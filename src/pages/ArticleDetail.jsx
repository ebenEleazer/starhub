import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://starhub-backend.onrender.com/api/articles/" + id)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        return res.json();
      })
      .then((data) => setArticle(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!article) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-700 whitespace-pre-wrap">{article.content}</p>
      <Link to="/articles" className="text-blue-600 underline mt-4 block">
        ← Back to Articles
      </Link>
    </div>
  );
}