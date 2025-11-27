"use client";

import { useState, useEffect } from "react";
import CreateEndPopup from "../components/endpoint/CreateEndPopup";

import EndpointList from "../components/endpoint/EndpointList";
import EndpointDetails from "../components/endpoint/EndpointDetails";

export default function Home() {
  const [selectedCard, setSelectedCard] = useState(null);
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

      {/* LISTA IZQUIERDA */}
      <EndpointList
        endpoints={endpoints}
        loading={loading}
        errorMsg={errorMsg}
        handleSelect={handleSelect}
        openCreateModal={openCreateModal}
        selectedCard={selectedCard}
      />

      {/* DETALLES DERECHA */}
      <EndpointDetails
        selectedCard={selectedCard}
        handleClose={handleClose}
        refresh={fetchEndpoints}
      />

      {/* POPUP CREAR */}
      <CreateEndPopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          fetchEndpoints();
        }}
      />
    </div>
  );
}
