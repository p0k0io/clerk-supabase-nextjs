"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function CreateApiKeyPopup({ open, onClose }) {
  const { user } = useUser();
  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!keyName) return;

    setLoading(true);
    try {
      const response = await fetch("/api/create/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name: keyName }),
      });

      if (!response.ok) throw new Error("Error al generar la API Key");

      const data = await response.json();
      setApiKey(data.apiKey);
    } catch (error) {
      console.error("Hubo un problema:", error);
      alert("Hubo un problema generando la API Key");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setKeyName("");
    setApiKey("");
    setCopied(false);
    onClose();
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-96 p-6 flex flex-col gap-4">
        {!apiKey ? (
          <>
            <h2 className="text-xl font-semibold text-white text-center">
              Generar nueva API Key
            </h2>

            <input
              type="text"
              placeholder="Nombre de la API Key"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleCancel}
                className="flex-1 mr-2 px-4 py-2 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !keyName}
                className="flex-1 ml-2 px-4 py-2 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition disabled:opacity-50"
              >
                {loading ? "Generando..." : "Confirmar"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white text-center">
              ¡API Key generada!
            </h2>
            <div className="flex items-center justify-between bg-white/20 rounded-xl px-4 py-2 border border-white/30 text-white font-mono">
              <span className="truncate">{apiKey}</span>
              <button
                onClick={handleCopy}
                className="ml-2 px-2 py-1 bg-white/30 rounded-xl hover:bg-white/40 transition text-sm"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <button
              onClick={handleCancel}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
