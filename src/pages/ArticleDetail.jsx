import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/articles/" + id)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [id]);

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