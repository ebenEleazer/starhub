import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams(); // this is the user_id from the URL
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch user's profile info
    fetch(`https://starhub-backend.onrender.com/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message));

    // Fetch user's posts
    fetch(`https://starhub-backend.onrender.com/api/posts?user_id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUserPosts(data))
      .catch(() => setError("Failed to load posts"));
  }, [id]);

  if (error) return <div className="text-red-400 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        {user ? (
          <div className="mb-8">
            <p className="text-indigo-400 text-xl font-semibold">@{user.username}</p>
            <p className="text-gray-400 text-sm">Joined on {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading user info...</p>
        )}

        <h2 className="text-2xl mb-4">Posts by this user</h2>
        <div className="space-y-6">
          {userPosts.length === 0 ? (
            <p className="text-gray-500">No posts found.</p>
          ) : (
            userPosts.map((post) => (
              <div key={post.id} className="bg-gray-900 p-4 rounded shadow">
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-64 object-cover rounded mb-2"
                />
                <p className="text-gray-200 mb-1">{post.caption}</p>
                <p className="text-sm text-gray-500">
                  Posted on {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}