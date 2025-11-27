"use client";

import { Plus } from "lucide-react";

export default function EndpointList({
  endpoints,
  loading,
  errorMsg,
  handleSelect,
  openCreateModal,
  selectedCard
}) {
  return (
    <div
      className={`
        absolute z-20 w-96 p-6 glass-card flex flex-col gap-6 transform transition-all duration-500
        ${selectedCard ? "-translate-x-[260px] opacity-70" : "translate-x-0 opacity-100"}
      `}
    >
      <button
        onClick={openCreateModal}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-xl text-white transition shadow-md"
      >
        <Plus size={18} />
        Crear nuevo endpoint
      </button>

      {loading && <p className="text-white/60 mt-2">Loading endpoints...</p>}
      {errorMsg && <p className="text-red-400 text-sm mt-2">{errorMsg}</p>}

      {endpoints.map((endpoint) => (
        <div
          key={endpoint.id}
          onClick={() => handleSelect(endpoint)}
          className="p-4 bg-white/10 hover:bg-white/20 cursor-pointer rounded-xl border border-white/20 transition-all shadow-md"
        >
          <h2 className="text-white text-xl font-semibold">{endpoint.name}</h2>
          <p className="text-white/60 text-sm">/{endpoint.id}</p>
          <p className="text-white/40 text-xs mt-1">
            Requests: {endpoint.requests || 0}
          </p>
        </div>
      ))}

      {endpoints.length === 0 && !loading && (
        <p className="text-white/40 text-sm mt-2">No endpoints found.</p>
      )}
    </div>
  );
}
