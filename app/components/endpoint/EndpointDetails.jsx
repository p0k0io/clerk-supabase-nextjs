"use client";

import {
  FolderOpen,
  Pencil,
  Save,
  XCircle,
  Trash,
  FlaskConical,
  Link as LinkIcon,
  Clock,
  Hash,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function EndpointDetails({ selectedCard, handleClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonValue, setJsonValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!selectedCard) return;

    setIsEditing(false);
    setError("");
    setSuccessMsg("");

    setJsonValue(
      JSON.stringify(
        typeof selectedCard.info === "string"
          ? JSON.parse(selectedCard.info)
          : selectedCard.info,
        null,
        2
      )
    );
  }, [selectedCard]);

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
    setSuccessMsg("");
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

  const testEndpoint = () => {
    console.log("Probando endpoint:", selectedCard.id);
  };

  const saveChanges = async () => {
    setError("");
    setSuccessMsg("");

    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonValue);
    } catch {
      setError("El JSON es inválido.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/edit/endpoint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCard.id, info: parsedJson }),
      });

      if (!res.ok) throw new Error(await res.text());

      setSuccessMsg("JSON actualizado correctamente.");
      setIsEditing(false);
    } catch {
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

  if (!selectedCard) return null;

  return (
    <div className="glass-card relative flex min-h-[60vh] w-full max-w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-xl">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/30 px-6 py-5 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-blue-500/20 p-2 text-blue-400">
            <FolderOpen size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white">
              {selectedCard.name}
            </h2>
            <p className="text-xs text-white/60">Detalles del endpoint</p>
          </div>
        </div>

        {/* Top right actions with tooltip */}
        <div className="flex shrink-0 items-center gap-2">
          <TooltipButton label="Probar endpoint" onClick={testEndpoint} className="bg-yellow-500 text-black hover:bg-yellow-400">
            <FlaskConical size={16} />
          </TooltipButton>

          {!isEditing && (
            <TooltipButton label="Editar JSON" onClick={startEditing} className="bg-blue-500/70 text-white hover:bg-blue-600">
              <Pencil size={16} />
            </TooltipButton>
          )}

          <TooltipButton label="Eliminar endpoint" onClick={deleteEndpoint} className="bg-red-600 text-white hover:bg-red-700">
            <Trash size={16} />
          </TooltipButton>
        </div>
      </header>

      {/* Content */}
      <div className="grid flex-1 grid-cols-1 gap-8 overflow-hidden p-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="flex h-full flex-col gap-6 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5">
          <InfoItem icon={Hash} label="ID" value={selectedCard.id} mono />
          <InfoItem
            icon={Clock}
            label="Creado"
            value={new Date(selectedCard.created_at).toLocaleString()}
          />
          <InfoItem
            icon={LinkIcon}
            label="Request URL"
            value={`http://localhost:8000/${selectedCard.id}`}
            mono
          />
        </aside>

        {/* JSON */}
        <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="shrink-0 border-b border-white/10 px-5 py-4">
            <p className="text-sm font-semibold text-white">JSON del endpoint</p>
          </div>

          <div className="relative flex-1 overflow-hidden p-5">
            {isEditing ? (
              <textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                className="absolute inset-0 h-full w-full resize-none overflow-auto rounded-lg border border-white/20 bg-black/30 p-5 font-mono text-xs leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <pre className="absolute inset-0 overflow-auto whitespace-pre-wrap rounded-lg bg-black/30 p-5 font-mono text-xs text-white/80">
                {jsonValue}
              </pre>
            )}
          </div>
        </section>
      </div>

      {/* Feedback */}
      {(error || successMsg) && (
        <div className="px-8 pb-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {successMsg && <p className="text-sm text-green-400">{successMsg}</p>}
        </div>
      )}

      {/* Footer */}
      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-8 py-5">
        <button
          onClick={handleClose}
          className="rounded-xl bg-gray-600 px-5 py-2.5 text-sm text-white hover:bg-gray-700 transition"
        >
          Cerrar
        </button>

        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={cancelEditing}
              className="flex items-center gap-2 rounded-xl bg-gray-500 px-5 py-2.5 text-sm text-white hover:bg-gray-600 transition"
            >
              <XCircle size={16} />
              Cancelar
            </button>

            <button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}

function TooltipButton({ children, label, onClick, className }) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={`flex items-center justify-center rounded-xl px-3 py-2 transition ${className}`}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute right-1/2 top-full z-20 mt-2 w-max translate-x-1/2 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-white/10 p-2 text-white/70">
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-white/50">
          {label}
        </p>
        <p className={`break-all text-sm text-white ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
