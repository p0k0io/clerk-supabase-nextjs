"use client";

import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  const sendPeticion = async () => {
    if (!selectedFile) {
      console.error("No se ha seleccionado un archivo");
      return;
    }

    const apiKey = "4a868774-7654-4106-b1b6-97e05d5c09be";

    const url =
      "https://uncontumaciously-nonoligarchical-marcelo.ngrok-free.dev/cv/d3049ccd-ede3-40b0-a475-d8f620e4b495";

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Respuesta:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Subir imagen</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <button onClick={sendPeticion} className="bg-red-500 p-2">
        Enviar Imagen
      </button>
    </div>
  );
}
