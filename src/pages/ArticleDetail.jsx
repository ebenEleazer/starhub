import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then(setArticle);

    fetch(`/api/articles/${id}/likes`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLikes(data.count);
        setLiked(data.liked);
      });
  }, [id]);

  const toggleLike = async () => {
    const res = await fetch(`/api/articles/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    setLiked(data.liked);
    setLikes((prev) => prev + (data.liked ? 1 : -1));
  };

  if (!article) return <div className="p-6 text-space-light">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto text-space-light">
      <h1 className="text-4xl font-bold mb-4 text-white drop-shadow glow">{article.title}</h1>
      <p className="whitespace-pre-line text-lg mb-6">{article.content}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          className={`px-5 py-2 rounded-full transition ${
            liked
              ? "bg-red-500 text-white shadow-glow"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {liked ? "♥ Liked" : "♡ Like"}
        </button>
        <span className="text-sm text-space-light">
          {likes} like{likes !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}