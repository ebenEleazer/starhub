import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import useRequireAuth from "../hooks/useRequireAuth";

const socket = io("https://starhub-backend.onrender.com");

export default function ChatRoom() {
  useRequireAuth();
  const { id } = useParams(); // Channel name
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState("anonymous");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://starhub-backend.onrender.com/api/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`https://starhub-backend.onrender.com/api/messages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch((err) => console.error("Failed to load messages:", err));
  }, [id]);

  useEffect(() => {
    socket.emit("joinRoom", id);

    const handleIncoming = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chatMessage", handleIncoming);
    return () => socket.off("chatMessage", handleIncoming);
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    const token = localStorage.getItem("token");

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("https://starhub-backend.onrender.com/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();

        if (data.url) {
          socket.emit("chatMessage", {
            room: id,
            sender: username,
            message: data.url,
          });
        }
      } catch (err) {
        console.error("Upload failed", err);
      }

      setFile(null);
      fileInputRef.current.value = "";
    }

    if (input.trim()) {
      socket.emit("chatMessage", {
        room: id,
        sender: username,
        message: input.trim(),
      });
      setInput("");
    }
  };

  const renderMessage = (msg, i) => {
    const isImage = typeof msg.message === "string" && msg.message.includes("/uploads/");
    const senderName = msg.sender || "unknown";

    return (
      <div key={i} className="flex flex-col space-y-1">
        <span className="text-xs text-indigo-400">@{senderName}</span>
        {isImage ? (
          <img
            src={msg.message}
            alt="uploaded"
            className="max-w-xs rounded shadow border border-gray-700"
          />
        ) : (
          <div className="bg-gray-800 text-white rounded px-3 py-2 text-sm w-fit max-w-sm">
            {msg.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-1 drop-shadow">#{id}</h1>
      <p className="text-sm text-gray-400 mb-6 italic">
        Real-time communication in the {id} channel
      </p>

      <div
        ref={scrollRef}
        className="w-full max-w-2xl h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4 mb-6"
      >
        {messages.map((msg, i) => renderMessage(msg, i))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-2xl">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white p-2 rounded border border-gray-600"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-white"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}