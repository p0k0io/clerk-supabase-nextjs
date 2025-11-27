"use client";

import { FolderOpen, Pencil, Save, XCircle, Trash } from "lucide-react";
import { useState } from "react";

export default function EndpointDetails({ selectedCard, handleClose }) {
  const [isEditing, setIsEditing] = useState(false);

  const [jsonValue, setJsonValue] = useState(
    selectedCard ? JSON.stringify(selectedCard.info, null, 2) : ""
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const startEditing = () => {
    setIsEditing(true);

    setJsonValue(
        JSON.stringify(
        typeof selectedCard.info === "string"
            ? JSON.parse(selectedCard.info)
            : selectedCard.info,
        null,
        2
        )
    );
    };


  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
    setSuccessMsg("");
    setJsonValue(JSON.stringify(selectedCard.info, null, 2));
  };

  const saveChanges = async () => {
    setError("");
    setSuccessMsg("");

    // Validar JSON
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonValue);
    } catch (err) {
      setError("El JSON es inválido.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/edit/endpoint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCard.id,
          info: parsedJson,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      setSuccessMsg("JSON actualizado correctamente.");
      setIsEditing(false);
    } catch (err) {
      setError("Error al guardar el JSON.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEndpoint = async () => {
    try {
      await fetch("/api/delete/endpoint", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCard.id }),
      });
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  return (
    <div
      className={`
        absolute w-[560px] p-6 glass-card transition-all duration-500
        bg-white/10 border border-white/20 rounded-xl shadow-lg
        ${selectedCard ? "translate-x-[260px] opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      {selectedCard && (
        <>
          {/* Título + Editar + Borrar */}
          <div className="flex items-center justify-between">
            <h2 className="text-white text-2xl font-bold flex items-center gap-2">
              <FolderOpen size={22} />
              {selectedCard.name}
            </h2>

            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="p-2 bg-blue-500/70 hover:bg-blue-600 rounded-xl text-white transition"
                >
                  <Pencil size={18} />
                </button>
              )}

              {/* Botón eliminar */}
              <button
                onClick={deleteEndpoint}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-xl text-white transition"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>

          {/* Info general */}
          <div className="text-white/80 mt-4 space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
            <p>
              <span className="font-semibold">ID del Endpoint:</span>{" "}
              {selectedCard.id}
            </p>

            <p>
              <span className="font-semibold">Fecha creación:</span>{" "}
              {new Date(selectedCard.created_at).toLocaleString()}
            </p>

            <p>
              <span className="font-semibold">Request to:</span>{" "}
              
            </p>
            <p>http://localhost:8000/{selectedCard.id}</p>
          </div>

          {/* JSON editor */}
          <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-xl">
            <p className="font-semibold text-white mb-2">JSON del endpoint</p>

            {isEditing ? (
              <textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                className="
                  w-full h-72 p-3 bg-black/30 border border-white/20 rounded-lg 
                  text-white font-mono text-xs leading-5
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                "
              />
            ) : (
              <pre
                className="
                  text-xs text-white/80 bg-black/30 p-4 rounded-lg 
                  font-mono max-h-72 overflow-auto whitespace-pre-wrap
                "
              >
                {JSON.stringify(
  typeof selectedCard.info === "string"
    ? JSON.parse(selectedCard.info)
    : selectedCard.info,
  null,
  2
)}
              </pre>
            )}
          </div>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          {successMsg && <p className="text-green-400 text-sm mt-2">{successMsg}</p>}

          {/* Botones edición */}
          {isEditing && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white transition"
              >
                <Save size={18} />
                {saving ? "Guardando..." : "Guardar"}
              </button>

              <button
                onClick={cancelEditing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-xl text-white transition"
              >
                <XCircle size={18} />
                Cancelar
              </button>
            </div>
          )}

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white transition"
          >
            Cerrar
          </button>
        </>
      )}
    </div>
  );
}
