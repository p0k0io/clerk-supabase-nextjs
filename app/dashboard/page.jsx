"use client";

import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";

export default function Home() {
  const [selectedCard, setSelectedCard] = useState(false);

  const cardData = {
    name: "Get User Data",
    endpoint: "/api/user/get",
    requests: 128,
  };

  const handleSelect = () => setSelectedCard(true);
  const handleClose = () => setSelectedCard(false);

  return (
    <div className="w-full h-screen flex justify-center items-start pt-10 p-8 overflow-hidden relative">

      {/* -------- CONTENEDOR IZQUIERDO (LISTA) -------- */}
      <div
        className={`
          absolute z-20 w-96 p-6 glass-card flex flex-col gap-6 transform transition-all duration-500
          ${selectedCard ? "-translate-x-[260px] opacity-70" : "translate-x-0 opacity-100"}
        `}
      >

        {/* Botón crear endpoint */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-xl text-white transition shadow-md">
          <Plus size={18} />
          Crear nuevo endpoint
        </button>

        {/* Card clickeable */}
        <div
          onClick={handleSelect}
          className="p-4 bg-white/10 hover:bg-white/20 cursor-pointer rounded-xl border border-white/20 transition-all shadow-md"
        >
          <h2 className="text-white text-xl font-semibold">{cardData.name}</h2>
          <p className="text-white/60 text-sm">{cardData.endpoint}</p>
          <p className="text-white/40 text-xs mt-1">Requests: {cardData.requests}</p>
        </div>
      </div>

      {/* -------- CONTENEDOR DERECHO (DETALLE) -------- */}
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
              {cardData.name}
            </h2>

            <div className="text-white/80 mt-3">
              <p><span className="font-semibold">Endpoint:</span> {cardData.endpoint}</p>
              <p><span className="font-semibold">Requests:</span> {cardData.requests}</p>
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
    </div>
  );
}
