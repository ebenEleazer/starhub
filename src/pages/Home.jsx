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
    <div className="min-h-screen bg-space-dark text-space-light font-futuristic px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-5xl font-bold text-space-accent drop-shadow-glow">StarHub</h1>
          <p className="text-base text-space-light/70 italic mt-2">
            Connecting Space Enthusiasts Across the Universe
          </p>
        </header>

        <nav className="flex justify-center gap-6 text-space-accent text-lg font-medium">
          <Link to="/profile" className="hover:text-white transition">Profile</Link>
          <Link to="/channels" className="hover:text-white transition">Channels</Link>
          <Link to="/articles" className="hover:text-white transition">Articles</Link>
        </nav>

        <section className="bg-space-dark border border-space-accent/30 p-6 rounded-xl shadow-glow">
          <h2 className="text-2xl font-semibold mb-4 text-space-accent">Share a New Post</h2>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full bg-space-dark border border-space-accent/20 p-2 rounded focus:outline-none"
              required
            />
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 bg-space-dark border border-space-accent/20 rounded focus:outline-none"
              rows="3"
            />
            <button
              type="submit"
              className="bg-space-accent text-white px-5 py-2 rounded shadow-glow hover:scale-105 transition-transform"
            >
              Post
            </button>
            {error && <p className="text-red-400">{error}</p>}
          </form>
        </section>

        <section className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-center text-space-light/60">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-space-dark border border-space-accent/10 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={post.image_url}
                  alt="User post"
                  className="w-full h-64 object-cover border-b border-space-accent/10"
                />
                <div className="p-4 space-y-2">
                  <p className="text-space-accent text-sm font-semibold">
                    <Link to={`/users/${post.user_id}`} className="hover:underline">
                      @{post.username || post.user_id}
                    </Link>
                  </p>
                  {post.caption && <p className="whitespace-pre-wrap">{post.caption}</p>}

                  <div className="flex items-center text-sm text-space-light/60 mt-1">
                    <span>❤️ {post.likes || 0}</span>
                    <span className="ml-4">💬 {comments[post.id]?.length || 0}</span>
                    <span className="ml-auto text-xs">{new Date(post.created_at).toLocaleString()}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="bg-space-accent text-white text-sm px-4 py-1 rounded shadow-glow hover:scale-105 transition">
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
                      className="bg-space-light/10 hover:bg-space-light/20 text-space-light text-sm px-4 py-1 rounded transition"
                    >
                      💬 Comment
                    </button>
                  </div>

                  {expandedPostId === post.id && (
                    <div className="mt-4 space-y-3">
                      <div className="space-y-2">
                        {(comments[post.id] || []).map((comment) => (
                          <div key={comment.id} className="border-t border-space-light/10 pt-2">
                            <p className="text-space-accent text-sm font-medium">
                              <Link to={`/users/${comment.user_id}`} className="hover:underline">
                                @{comment.user_id}
                              </Link>
                            </p>
                            <p className="text-sm">{comment.text}</p>
                            <p className="text-xs text-space-light/50">
                              {new Date(comment.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          className="flex-1 bg-space-dark border border-space-accent/20 p-2 rounded"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="bg-space-accent text-white px-3 py-1 rounded shadow-glow hover:scale-105 transition"
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