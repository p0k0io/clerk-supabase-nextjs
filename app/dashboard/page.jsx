"use client";

import { useState, useEffect } from "react";
import { Plus, FolderOpen } from "lucide-react";
import CreateEndPopup from "../components/endpoint/CreateEndPopup";

export default function Home() {
  const [selectedCard, setSelectedCard] = useState(null); // ahora puede ser el endpoint seleccionado
  const [popupOpen, setPopupOpen] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openCreateModal = () => setPopupOpen(true);

  const handleSelect = (endpoint) => setSelectedCard(endpoint);
  const handleClose = () => setSelectedCard(null);

  // Fetch endpoints desde el API
  const fetchEndpoints = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/get/endpoint");
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const data = await res.json();
      setEndpoints(data.endpoints || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error fetching endpoints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-start pt-10 p-8 overflow-hidden relative">

      {/* Lista de tarjetas de endpoints */}
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

        {endpoints.length === 0 && !loading && <p className="text-white/40 text-sm mt-2">No endpoints found.</p>}
      </div>

      {/* Detalle del endpoint seleccionado */}
      <div
        className={`
          absolute w-[560px] p-6 glass-card transition-all duration-500
          bg-white/10 border border-white/20 rounded-xl shadow-md
          ${selectedCard ? "translate-x-[260px] opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {selectedCard && (
          <>
            <h2 className="text-white text-2xl font-bold flex items-center gap-2">
              <FolderOpen size={22} />
              {selectedCard.name}
            </h2>

            <div className="text-white/80 mt-3">
              <p><span className="font-semibold">Endpoint ID:</span> {selectedCard.id}</p>
              <p><span className="font-semibold">User ID:</span> {selectedCard.id_user}</p>
              <p><span className="font-semibold">Created At:</span> {new Date(selectedCard.created_at).toLocaleString()}</p>

              <div className="mt-2 p-2 bg-white/5 rounded-xl">
                <p className="font-semibold">Schema & Callback URL:</p>
                <pre className="text-xs overflow-x-auto">
                  {typeof selectedCard.info === "string" ? JSON.stringify(JSON.parse(selectedCard.info), null, 2) : JSON.stringify(selectedCard.info, null, 2)}
                </pre>
              </div>

              <p className="mt-2"><span className="font-semibold">Public URL:</span> http://127.0.0.1/{selectedCard.id}</p>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 w-fit px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white transition"
            >
              Cerrar
            </button>
          </>
        )}
      </div>

      {/* Popup para crear nuevo endpoint */}
      <CreateEndPopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          fetchEndpoints(); // refresca la lista al cerrar el popup
        }}
      />
    </div>
  );
}
