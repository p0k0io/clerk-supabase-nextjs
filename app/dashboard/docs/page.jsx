"use client";

import { useState } from "react";

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("php");
  const codeSnippets = {
    php: `<?php
$ch = curl_init();
$postFields = ['file' => new CURLFile($filePath)];
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $apiKey"],
    CURLOPT_POSTFIELDS => $postFields,
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch);
} else {
    echo $response;
}
curl_close($ch);`,
    js: `const sendPeticion = async () => {
    if (!selectedFile) return;
    const apiKey = "4a868774-7654-4106-b1b6-97e05d5c09be";
    const url = "https://...";

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: \`Bearer \${apiKey}\` },
        body: formData
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
};`,
    python: `import requests

image_path = "file.png"
with open(image_path, "rb") as img_file:
    files = {"file": (image_path, img_file, "image/png")}
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.post(url, files=files, headers=headers)

print(response.status_code)
print(response.text)`,
    curl: `curl -X 'POST' \\
  'https://...' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer 4a868774-7654-4106-b1b6-97e05d5c09be' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'file=@sample_cv_variant_14.pdf;type=application/pdf'`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    alert("Código copiado al portapapeles ✅");
  };
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen flex gap-8 p-8 text-neutral-200 font-light">

      {/* ------------------------ */}
      {/*       SIDEBAR INDEX      */}
      {/* ------------------------ */}
      <div className="w-full max-w-xs p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl sticky top-8 h-fit flex flex-col gap-5">
        <h2 className="text-xl font-medium tracking-wide text-neutral-100">Índice</h2>

        <nav className="flex flex-col gap-4 text-sm text-neutral-300">
          <button onClick={() => scrollTo("intro")} className="text-left hover:text-white transition-all">
            1. Introducción y funcionamiento
          </button>
          <div className="flex flex-col gap-2 pl-4 text-neutral-400">
            <button onClick={() => scrollTo("intro-que-es")} className="text-left hover:text-white">• ¿Qué es Orbital?</button>
            <button onClick={() => scrollTo("intro-como-funciona")} className="text-left hover:text-white">• Funcionamiento</button>
          </div>

          <button onClick={() => scrollTo("configuracion")} className="text-left hover:text-white transition-all">
            2. Configuración inicial
          </button>
          <div className="flex flex-col gap-2 pl-4 text-neutral-400">
            <button onClick={() => scrollTo("api-key")} className="text-left hover:text-white">• Creación de la API Key</button>
            <button onClick={() => scrollTo("endpoint")} className="text-left hover:text-white">• Creación del Endpoint</button>
          </div>
           <button onClick={() => scrollTo("configuracion")} className="text-left hover:text-white transition-all">
            3. Uso de la API
          </button>
          <div className="flex flex-col gap-2 pl-4 text-neutral-400">
            <button onClick={() => scrollTo("intro-imple")} className="text-left hover:text-white">• Introduccion al uso de la API</button>
            <button onClick={() => scrollTo("")} className="text-left hover:text-white">• Creación del Endpoint</button>
          </div>

        </nav>
      </div>

      {/* ------------------------ */}
      {/*      MAIN CONTENT        */}
      {/* ------------------------ */}
      <div className="w-full max-w-4xl p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col gap-16 leading-relaxed">

        {/* --- INTRO --- */}
        <section id="intro" className="scroll-mt-28">
          <h1 className="text-3xl font-semibold text-white mb-3">1. Introducción y funcionamiento</h1>
          
        </section>

        <section id="intro-que-es" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">¿Qué es Orbital?</h3>
          <p className="text-neutral-400">
     
            Orbital es un servicio que permite a empresas y desarrolladores estandarizar la estructura de sus datos, incluso cuando provienen de documentos digitales o físicos que contienen la misma información pero organizada de formas diferentes o totalmente desestructurada.
         
          </p>
        </section>

        <section id="intro-como-funciona" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Funcionamiento</h3>
          <p className="text-neutral-400">
            El funcionamiento es sencillo: el cliente crea su propio endpoint dentro de Orbital y envía las peticiones adjuntando el archivo A. Nosotros procesamos el documento, extraemos y organizamos la información según la estructura definida y enviamos el resultado en formato JSON a un webhook que el cliente haya configurado. Desde allí, la empresa o el desarrollador puede aplicar cualquier proceso adicional que necesite.
          </p>
        </section>

        {/* --- CONFIGURACIÓN --- */}
        <section id="configuracion" className="scroll-mt-28">
          <h2 className="text-3xl font-semibold text-white mb-3">2. Configuración inicial</h2>
          <p className="text-neutral-300 text-lg">
            Para comenzar a usar Orbital, debes completar dos pasos fundamentales:
          </p>
          <ul className="list-disc pl-6 text-neutral-400">
            <li>Crear tu API Key</li>
            <li>Configurar tu Endpoint</li>
          </ul>
          <p className="text-neutral-300 text-lg">
            Estos dos elementos permiten autenticar tus solicitudes y definir cómo Orbital estructurará tus datos antes de enviarlos a tu webhook.
          </p>
        </section>

        {/* --- API KEY --- */}
        <section id="api-key" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Creación de la API Key</h3>
          <p className="text-neutral-400">
            La API Key es indispensable para interactuar con Orbital. Funciona como un identificador único que valida que las peticiones provienen de un usuario autorizado.
          </p>
          <h4 className="text-lg font-medium text-white mb-1 mt-4">Cómo generar una API Key</h4>
          <ol className="list-decimal pl-6 text-neutral-400">
            <li>Dirígete a la sección de API Keys en tu panel.</li>
            <li>Haz clic en “Generar nueva API Key”.</li>
            <li>El sistema te mostrará tu nueva API Key una sola vez.</li>
          </ol>
          <p className="text-yellow-400 mt-2">
            ⚠️ Importante: Por razones de seguridad, la API Key no volverá a mostrarse. Si la pierdes, deberás eliminarla o generar una nueva.
          </p>
        </section>

        {/* --- ENDPOINT --- */}
        <section id="endpoint" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Creación del Endpoint</h3>
          <p className="text-neutral-400">
            Con tu API Key creada, el siguiente paso es configurar un endpoint donde Orbital recibirá tus documentos y procesará la información.
          </p>
          <h4 className="text-lg font-medium text-white mb-1 mt-4">Cómo crear un Endpoint</h4>
          <ol className="list-decimal pl-6 text-neutral-400">
            <li>Accede a la sección “Endpoints” en tu panel.</li>
            <li>Haz clic en “Nuevo endpoint”.</li>
            <li>Completa los siguientes campos:
              <ul className="list-disc pl-6">
                <li>Nombre: Una etiqueta que te permita identificar fácilmente el endpoint.</li>
                <li>Estructura: Define el esquema JSON que deseas recibir como resultado.</li>
                <li>Webhook: URL donde Orbital enviará la información procesada en formato JSON.</li>
              </ul>
            </li>
            <li>Confirma la creación y el sistema generará automáticamente una URL única.</li>
          </ol>
          <p className="text-neutral-300 text-lg mt-2">
            Esta será la URL a la que deberás enviar tus peticiones POST junto con tus documentos (archivo A).
          </p>
        </section>

         {/* --- VISUALIZADOR DE CÓDIGO CON BOTÓN COPIAR --- */}
        <section id="visualizador-codigo" className="scroll-mt-28">
          <h2 className="text-3xl font-semibold text-white mb-4">4. Ejemplos de implementación</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex gap-2 mb-3">
              {Object.keys(codeSnippets).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                    activeLang === lang ? "bg-blue-600 text-white" : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
              <button
                onClick={copyToClipboard}
                className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
              >
                Copiar
              </button>
            </div>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
              {codeSnippets[activeLang]}
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}
