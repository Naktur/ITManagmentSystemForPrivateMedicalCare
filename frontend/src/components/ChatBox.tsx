import React, { useState, useEffect, useRef } from "react";
import api from "../api/axiosConfig";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Cześć! Jestem asystentem. Mogę pomóc ze wstępnymi zaleceniami, informacjami o placówce lub podpowiedzieć jak umówić wizytę.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await api.post("/chat/", { message: text });
      const data = resp.data as { role: "assistant"; message: string };
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "❌ Nie udało się skontaktować z lokalnym modelem AI. Sprawdź, czy działa Ollama (http://localhost:11434) i pobrany jest model.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="h-full flex flex-col bg-white rounded shadow p-4">
      <div className="flex-1 overflow-auto space-y-3 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded px-3 py-2 text-sm leading-relaxed ${
                m.role === "user" ? "bg-sky-100" : "bg-gray-100"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div className="mt-1 text-[11px] text-gray-500">
                {new Date(m.timestamp).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={loading ? "Asystent pisze..." : "Napisz wiadomość..."}
          disabled={loading}
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-60"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
