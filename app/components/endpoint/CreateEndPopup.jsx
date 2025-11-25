"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function CreateApiKeyPopup({ open, onClose }) {
  const { user } = useUser();

  const [keyName, setKeyName] = useState("");
  const [jsonSchema, setJsonSchema] = useState("");
  const [callbackURL, setCallbackURL] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const resetState = () => {
    setKeyName("");
    setJsonSchema("");
    setCallbackURL("");
    setCreatedUrl("");
    setErrorMsg("");
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleConfirm = async () => {
    setErrorMsg("");

    if (!keyName.trim()) return setErrorMsg("El nombre no puede estar vacío.");
    if (!jsonSchema.trim()) return setErrorMsg("El JSON Schema no puede estar vacío.");
    if (!callbackURL.trim()) return setErrorMsg("La callbackURL no puede estar vacía.");

    let parsedSchema;
    try {
      parsedSchema = JSON.parse(jsonSchema);
    } catch {
      return setErrorMsg("El JSON Schema no es válido.");
    }

    if (!user?.id) return setErrorMsg("Usuario no encontrado.");

    // JSON combinado
    const payloadJson = {
      schema: parsedSchema,
      callbackURL: callbackURL.trim(),
    };

    setLoading(true);

    try {
      const response = await fetch("/api/create/endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: keyName.trim(),
          payloadJson: JSON.stringify(payloadJson),
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data = await response.json();
      setCreatedUrl(data.url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error creando endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-[500px] p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-slate-100">Create new endpoint</h1>
        <hr />

        <form onSubmit={(e) => e.preventDefault()} className="text-slate-50 flex flex-col gap-4">

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="font-semibold">Name of the endpoint</label>
            <input
              className="mt-2 bg-transparent border-2 border-white px-2 py-1 rounded-xl outline-none"
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
            />
          </div>

          {/* JSON Schema */}
          <div className="flex flex-col">
            <label className="font-semibold">JSON Schema</label>
            <textarea
              className="mt-2 bg-transparent border-2 border-white px-2 py-2 h-40 rounded-xl resize-none outline-none"
              placeholder='{
  "type": "object"
}'
              value={jsonSchema}
              onChange={(e) => setJsonSchema(e.target.value)}
            ></textarea>
          </div>

          {/* Callback URL */}
          <div className="flex flex-col">
            <label className="font-semibold">Callback URL</label>
            <input
              className="mt-2 bg-transparent border-2 border-white px-2 py-1 rounded-xl outline-none"
              type="text"
              placeholder="https://miweb.com/webhook"
              value={callbackURL}
              onChange={(e) => setCallbackURL(e.target.value)}
            />
          </div>

          {errorMsg && <p className="text-red-400 text-sm font-semibold">{errorMsg}</p>}

          {/* Resultado URL */}
          {createdUrl && (
            <div className="mt-2 bg-white/20 p-3 rounded-xl">
              <p className="font-semibold">Your endpoint URL:</p>
              <p className="break-all text-green-300">{createdUrl}</p>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
