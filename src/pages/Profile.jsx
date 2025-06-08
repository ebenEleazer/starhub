import { useState, useEffect } from "react";
import { getProfile } from "../api";

export default function Profile() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    getProfile(token)
      .then(function (data) {
        setMessage(data.message);  // e.g. “Welcome, yourUsername”
      })
      .catch(function (err) {
        setError(err.message);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-lg">{message}</p>
      )}
    </div>
  );
}