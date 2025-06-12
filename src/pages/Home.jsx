import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://starhub-backend.onrender.com/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setError("Failed to load posts"));
  }, [navigate]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      const res = await fetch("https://starhub-backend.onrender.com/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to post");
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setImage(null);
      setCaption("");
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`https://starhub-backend.onrender.com/api/posts/${postId}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch {
      setComments((prev) => ({ ...prev, [postId]: [] }));
    }
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId];
    if (!text) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`https://starhub-backend.onrender.com/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      const newComment = await res.json();

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black text-white">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1 drop-shadow-lg">StarHub</h1>
          <p className="text-sm text-gray-300 italic">Connecting Space Enthusiasts Across the Universe</p>
        </header>

        <nav className="flex justify-center gap-4 mb-6">
          <Link to="/profile" className="text-indigo-300 hover:text-white">Profile</Link>
          <Link to="/channels" className="text-indigo-300 hover:text-white">Channels</Link>
          <Link to="/articles" className="text-indigo-300 hover:text-white">Articles</Link>
        </nav>

        <section className="mb-10">
          <form onSubmit={handlePostSubmit} className="bg-gray-800 p-4 rounded shadow space-y-4">
            <h2 className="text-xl font-semibold mb-2">Share a New Post</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full bg-gray-700 p-2 rounded"
              required
            />
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              rows="2"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Post
            </button>
            {error && <p className="text-red-400">{error}</p>}
          </form>
        </section>

        <section className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-center text-gray-400">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <img
                  src={post.image_url}
                  alt="User post"
                  className="w-full h-72 object-cover border-b border-gray-700"
                />
                <div className="p-4">
                  <p className="text-sm text-indigo-400 font-semibold mb-1">
  <Link to={`/users/${post.user_id}`} className="hover:underline">
    @{post.username || post.user_id}
  </Link>
</p>
                  {post.caption && (
                    <p className="text-gray-200 mb-2 whitespace-pre-wrap">{post.caption}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <span>❤️ {post.likes || 0}</span>
                    <span className="ml-4">💬 {comments[post.id]?.length || 0}</span>
                    <span className="ml-auto text-xs">{new Date(post.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded"
                    >
                      ❤️ Like
                    </button>
                    <button
                      onClick={() => {
                        const expanded = expandedPostId === post.id ? null : post.id;
                        setExpandedPostId(expanded);
                        if (expanded !== null && !comments[post.id]) {
                          fetchComments(post.id);
                        }
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded"
                    >
                      💬 Comment
                    </button>
                  </div>

                  {expandedPostId === post.id && (
                    <div className="mt-4 space-y-2">
                      <div className="space-y-1">
                        {(comments[post.id] || []).map((comment) => (
                          <div key={comment.id} className="text-sm text-gray-300 border-t border-gray-700 pt-2">
                           <p className="text-indigo-300 font-semibold">
  <Link to={`/users/${comment.user_id}`} className="hover:underline">
    @{comment.user_id}
  </Link>
</p>
                            <p>{comment.text}</p>
                            <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          className="flex-1 bg-gray-800 text-white p-2 rounded"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}