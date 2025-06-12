import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://starhub-backend.onrender.com");

export default function ChatRoom() {
  const { id } = useParams();
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
      headers: { Authorization: `Bearer ${token}` },
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
            created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
      });
      setInput("");
    }
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = (msg, i) => {
    const isImage = typeof msg.message === "string" && msg.message.includes("/uploads/");
    const senderName = msg.sender || "unknown";
    const isOwn = senderName === username;
    const timestamp = msg.created_at ? formatTime(msg.created_at) : "";

    const initials = senderName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div key={i} className={`flex ${isOwn ? "justify-end" : "justify-start"} w-full`}>
        <div className={`flex items-end space-x-2 ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
          {/* Avatar */}
          <div className="w-8 h-8 bg-indigo-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-inner">
            {initials}
          </div>

          {/* Message bubble */}
          <div className="flex flex-col max-w-xs sm:max-w-sm">
            <span className="text-xs text-indigo-400 mb-0.5">@{senderName}</span>
            {isImage ? (
              <img
                src={msg.message}
                alt="uploaded"
                className="max-w-[240px] max-h-[200px] rounded-lg border border-gray-700 object-contain shadow"
              />
            ) : (
              <div
                className={`rounded-xl px-3 py-2 text-sm shadow-md ${
                  isOwn ? "bg-indigo-600 text-white" : "bg-gray-800 text-white"
                }`}
              >
                {msg.message}
              </div>
            )}
            <span className="text-[10px] text-gray-400 mt-1 self-end">{timestamp}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white flex flex-col items-center p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold drop-shadow text-white">#{id}</h1>
        <p className="text-sm text-gray-400 italic">
          Real-time communication in the {id} channel
        </p>
      </header>

      {/* Chat box */}
      <div
        ref={scrollRef}
        className="w-full max-w-2xl h-[30rem] overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4 mb-6 shadow-inner"
      >
        {messages.map((msg, i) => renderMessage(msg, i))}
      </div>

      {/* Input section */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-2xl">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-white"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg text-white font-medium glow"
        >
          Send
        </button>
      </div>
    </div>
  );
}