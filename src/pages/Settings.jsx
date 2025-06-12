import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://starhub-backend.onrender.com/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setBio(data.bio || "");
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await fetch("https://starhub-backend.onrender.com/api/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");
      alert("Profile updated!");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://starhub-backend.onrender.com/api/profile", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete account");

      localStorage.removeItem("token");
      alert("Account deleted");
      navigate("/signup");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Profile Picture (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="text-sm text-gray-300"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
          >
            Save Changes
          </button>
        </form>

        <hr className="my-6 border-gray-700" />

        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}