import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://starhub-backend.onrender.com");

export default function ChatRoom() {
  const { id } = useParams(); // Channel ID
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

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
    const sender = "anonymous";

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
          socket.emit("chatMessage", {
            room: id,
            message: `${sender}: ${data.url}`,
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
        message: `${sender}: ${input.trim()}`,
      });
      setInput("");
    }
  };

  const renderMessage = (msg, i) => {
    const isImage = typeof msg.message === "string" && msg.message.includes("/uploads/");
    const [sender, rest] = msg.message.split(": ");

    return (
      <div key={i} className="flex flex-col items-start space-y-1">
        <span className="text-xs text-gray-500">{sender}</span>
        {isImage ? (
          <img src={rest} alt="uploaded" className="max-w-xs rounded" />
        ) : (
          <div className="bg-gray-100 rounded px-3 py-1 text-sm">{rest}</div>
        )}
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