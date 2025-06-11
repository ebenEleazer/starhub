import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// 🟢 CONNECT TO PRODUCTION BACKEND
const socket = io("https://starhub-backend.onrender.com");

export default function ChatRoom() {
  const { id } = useParams(); // channel name
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // 🔵 Load previous messages from backend (Supabase)
  useEffect(() => {
    fetch(`https://starhub-backend.onrender.com/api/messages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data.map((msg) => msg.content));
        }
      })
      .catch((err) => console.error("Failed to load messages:", err));
  }, [id]);

  // 🟣 Setup Socket.io listeners
  useEffect(() => {
    socket.emit("joinRoom", id);
    socket.on("chatMessage", (msg) => {
      // If backend returns { message: "...", room: "...", created_at: "..." }
      if (typeof msg === "object" && msg.message) {
        setMessages((prev) => [...prev, msg.message]);
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [id]);

  // 🔽 Auto-scroll when messages update
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // 📨 Handle send
  const handleSend = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("https://starhub-backend.onrender.com/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          socket.emit("chatMessage", { room: id, message: data.url });
        }
      } catch (err) {
        console.error("Upload failed", err);
      }

      setFile(null);
      fileInputRef.current.value = "";
    }

    if (input.trim()) {
      socket.emit("chatMessage", { room: id, message: input });
      setInput("");
    }
  };

  // 🖼️ Render each message
  const renderMessage = (msg, i) => {
    if (typeof msg === "string") {
      if (msg.includes("/uploads/") && msg.startsWith("http")) {
        return (
          <img
            key={i}
            src={msg}
            alt="media"
            className="max-w-xs rounded shadow"
          />
        );
      }

      return (
        <div key={i} className="bg-gray-100 rounded px-3 py-1 text-sm">
          {msg}
        </div>
      );
    }

    // Safe fallback for unexpected formats
    return (
      <div key={i} className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded">
        [Unsupported message format]
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Channel: {id}</h1>

      <div
        ref={scrollRef}
        className="w-full max-w-xl h-72 overflow-y-auto border p-4 rounded bg-white space-y-2 mb-4"
      >
        {messages.map((msg, i) => renderMessage(msg, i))}
      </div>

      <div className="flex items-center w-full max-w-xl space-x-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}