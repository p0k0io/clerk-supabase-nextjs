"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X } from "lucide-react";

export default function IaAssistant({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hola 👋 Soy tu asistente IA. ¿En qué puedo ayudarte?",
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  /* ✅ LOS HOOKS SIEMPRE ARRIBA */
  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  /* ✅ EL RETURN CONDICIONAL VA DESPUÉS */
  if (!open) return null;

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    /* Mock IA response */
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "🤖 Respuesta IA simulada. Aquí irá tu modelo.",
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-[380px] border-r border-white/10 bg-neutral-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Bot className="text-cyan-400" size={18} />
          IA Assistant
        </div>

        <button
          onClick={onClose}
          className="text-white/40 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat history */}
      <div className="flex h-[calc(100%-120px)] flex-col gap-3 overflow-y-auto px-4 py-4 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed ${
                msg.role === "user"
                  ? "bg-cyan-500 text-black"
                  : "bg-neutral-800 text-white"
              }`}
            >
              <div className="mb-1 flex items-center gap-1 text-xs opacity-70">
                {msg.role === "user" ? (
                  <>
                    <User size={12} /> Tú
                  </>
                ) : (
                  <>
                    <Bot size={12} /> IA
                  </>
                )}
              </div>
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe tu mensaje…"
            className="flex-1 rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          />

          <button
            onClick={sendMessage}
            className="rounded-xl bg-cyan-500 p-2 text-black hover:bg-cyan-400"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
