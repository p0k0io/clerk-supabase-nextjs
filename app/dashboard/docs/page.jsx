"use client";
import { useState } from "react";

/**
 * Componente principal para la página de documentación de la API.
 * Muestra la documentación técnica de la API de Orbital v2.0.0,
 * incluyendo una barra lateral de navegación y un visualizador de fragmentos de código.
 */
export default function Home() {
  // Estado para controlar el lenguaje activo en el visualizador de fragmentos de código
  const [activeLang, setActiveLang] = useState("curl");

  // Objeto que contiene los fragmentos de código para diferentes lenguajes
  // Estos snippets reflejan ejemplos de uso de la API de Orbital.
  const codeSnippets = {
    curl: `curl -X POST "https://orbial.com/697888ca-9aa1-4c2c-8bd4-423769769f70" \
     -H "Authorization: Bearer 6e00bf49-e573-45ce-a691-aad0ba1686ed" \
     -F "file=@/path/to/your/cv.pdf"`,
    javascript: `import express from 'express';
import crypto from 'crypto';

const app = express();
// ¡MUY IMPORTANTE! Usa express.raw() para poder verificar la firma.
// express.json() modificaría el cuerpo y la firma no coincidiría.
app.use(express.raw({ type: 'application/json' }));

const WEBHOOK_SECRET = process.env.ORBITAL_WEBHOOK_SECRET;

app.post('/webhook-receiver', (req, res) => {
  const signature = req.get('X-Hub-Signature-256');
  if (!signature) {
    return res.status(400).send('No signature provided');
  }

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = \`sha256=\${hmac.update(req.body).digest('hex')}\`;

  if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
    return res.status(401).send('Invalid signature');
  }

  // Ahora que la firma es válida, puedes parsear el cuerpo
  const payload = JSON.parse(req.body);

  console.log('Webhook verificado y recibido:');
  // ... tu lógica para procesar el payload ...

  res.status(200).send('OK');
});`,
    python: `import requests

image_path = "file.png"
with open(image_path, "rb") as img_file:
    files = {"file": (image_path, img_file, "image/png")}
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.post(url, files=files, headers=headers)

print(response.status_code)
print(response.text)`,
  };

  /**
   * Copia el fragmento de código actualmente seleccionado al portapapeles del usuario.
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    alert("Código copiado al portapapeles ✅");
  };

  /**
   * Desplaza suavemente la ventana del navegador a la sección de la página
   * identificada por el 'id' proporcionado.
   * @param {string} id - El ID del elemento HTML al que se desea desplazar.
   */
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen flex gap-8 p-8 text-neutral-200 font-light">
      {/* ------------------------ */}
      {/*       SIDEBAR INDEX      */}
      {/* ------------------------ */}
      {/* Barra de navegacion. */}
      <div className="w-full max-w-xs p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl sticky top-8 h-fit flex flex-col gap-5">
        <h2 className="text-xl font-medium tracking-wide text-neutral-100">
          Índice
        </h2>
        <nav className="flex flex-col gap-4 text-sm text-neutral-300">
          {/* Botones para ir a X seccion. */}
          <button
            onClick={() => scrollTo("quick-start")}
            className="text-left hover:text-white transition-all"
          >
            0. Quick Start
          </button>
          <button
            onClick={() => scrollTo("conceptos-clave")}
            className="text-left hover:text-white transition-all"
          >
            1. Conceptos Clave
          </button>
          <button
            onClick={() => scrollTo("arquitectura")}
            className="text-left hover:text-white transition-all"
          >
            2. Arquitectura y Funcionamiento
          </button>
          <button
            onClick={() => scrollTo("api-endpoints")}
            className="text-left hover:text-white transition-all"
          >
            3. Endpoints de la API
          </button>
          <button
            onClick={() => scrollTo("schema-json")}
            className="text-left hover:text-white transition-all"
          >
            4. Definición del Esquema de Salida (JSON)
          </button>
          <button
            onClick={() => scrollTo("webhooks")}
            className="text-left hover:text-white transition-all"
          >
            5. Recibiendo Datos con Webhooks
          </button>
          <button
            onClick={() => scrollTo("errores")}
            className="text-left hover:text-white transition-all"
          >
            6. Gestión de Errores
          </button>
          <button
            onClick={() => scrollTo("debugging")}
            className="text-left hover:text-white transition-all"
          >
            7. Debugging y Logs
          </button>
        </nav>
      </div>

      {/* ------------------------ */}
      {/*      MAIN CONTENT        */}
      {/* ------------------------ */}
      {/* Área principal de contenido que muestra la documentación de la API. */}
      <div className="w-full max-w-4xl p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col gap-16 leading-relaxed">
        {/* Sección de introducción general a la documentación. */}
        <section>
          <h1 className="text-3xl font-semibold text-white mb-3">
            Documentación de la API de Orbital v2.0.0
          </h1>
          <p className="text-neutral-300">
            Bienvenido a la documentación oficial de la API de `Orbital`. Esta
            guía te proporcionará todo lo que necesitas para integrar nuestra
            potente solución de procesamiento de documentos en tu aplicación.
          </p>
        </section>

        {/* Sección 0 | Guía rapida para empezar a usar la API. */}
        <section id="quick-start" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            0. Quick Start (5 minutos)
          </h2>
          <ol className="list-decimal pl-6 text-neutral-300 space-y-2">
            <li>
              **Crea tu API Key**: Se usará para autenticar tus peticiones.
            </li>
            <li>
              **Define tu Endpoint**: Configura una URL en tu sistema donde
              recibirás los resultados (`webhook`), un `schema` para la
              extracción de datos, y un `secret` para asegurar la comunicación.
            </li>
            <li>
              **Envía un archivo**: Realiza una petición `POST` a nuestro
              endpoint de procesamiento con el archivo y tu `endpoint_id`.
              Recibirás un `request_id`.
            </li>
            <li>
              **Verifica y recibe el resultado**: Tu webhook recibirá una
              petición `POST` con una firma de seguridad y el JSON extraído,
              junto al `request_id` para que puedas asociarlo.
            </li>
          </ol>
          <h3 className="text-xl font-medium text-white mb-2 mt-6">
            Ejemplo Mínimo (cURL)
          </h3>
          {/* Bloque de codigo cURL para ejemplo simple. */}
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
            <code>
              {`# Reemplaza estos valores con los tuyos
API_KEY="6e00bf49-e573-45ce-a691-aad0ba1686ed"
CV_FILE_PATH="ubicacion/donde/guardes/arcivo.pdf" # tanto pdf, imagen, docx...
ENDPOINT_ID="697888ca-9aa1-4c2c-8bd4-423769769f70"
API_URL="https://orbial.com" # URL base de la API

curl -X POST "\\\${API_URL}/\\\${ENDPOINT_ID}" \\
     -H "Authorization: Bearer \\\${API_KEY}" \\
     -F "file=@\\\${FILE_PATH}"`}
            </code>
          </pre>
          <p className="text-neutral-300 mt-3">
            Recibirás una respuesta `202 Accepted` como esta:
          </p>
          {/* Bloque de código JSON que muestra una respuesta exitosa. */}
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
            <code>
              {`{
  "message": "Archivo recibido. El procesamiento ha comenzado.",
  "request_id": "b1b2f345-6789-0123-abcd-efgh45678901"
}`}
            </code>
          </pre>
          <p className="text-yellow-400 mt-4 border-l-4 border-yellow-400 pl-4">
            **Regla Clave**: Una respuesta `202 Accepted` solo confirma la
            recepción. El resultado final del procesamiento siempre se comunica
            a través del webhook.
          </p>
        </section>

        {/* Sección 1 | Conceptos Clave - Define la terminología utilizada en la API. */}
        <section id="conceptos-clave" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            1. Conceptos Clave
          </h2>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>
              **API Key**: Tu clave secreta para autenticarte. Se envía en el
              header `Authorization: Bearer &lt;tu_api_key&gt;`.
            </li>
            <li>
              **Endpoint**: Una configuración en tu cuenta que asocia una URL de
              **webhook**, un **esquema JSON** de datos y un **secreto de
              webhook**. Se le asigna un `endpoint_id` único para identificarlo
              en las peticiones.
            </li>
            <li>
              **Webhook**: Una URL en tu servidor a la que `Orbital` enviará los
              resultados del procesamiento.
            </li>
            <li>
              **Secreto de Webhook**: Una clave secreta que tú defines. Se usa
              para generar una firma digital (`HMAC-SHA256`) y así puedas
              verificar que los webhooks que recibes son auténticos.
            </li>
            <li>
              **Request ID**: Un identificador único (`UUID`) que se genera para
              cada archivo que envías. Es crucial para correlacionar la petición
              inicial con el resultado final.
            </li>
          </ul>
        </section>

        {/* Sección 2 | Arquitectura y Funcionamiento - Explica como funciona la API internamente. */}
        <section id="arquitectura" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            2. Arquitectura y Funcionamiento
          </h2>
          <p className="text-neutral-300">
            La API de `Orbital` está diseñada para ser **totalmente
            asíncrona**, lo que nos permite procesar documentos complejos sin
            que tu aplicación tenga que esperar una respuesta. El flujo de
            trabajo se divide en dos fases principales: una petición síncrona
            inicial y un proceso asíncrono en segundo plano que culmina con una
            llamada a tu webhook.
          </p>
          <p className="text-neutral-300 mt-3">
            El siguiente diagrama de secuencia ilustra la interacción entre tu
            aplicación, los componentes de Orbital y tu servidor.
          </p>
          {/* Diagrama de secuencia Mermaid. */}
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
            <code>
              {`sequenceDiagram
    actor UserApp as Tu Aplicación
    participant Orbital as Plataforma Orbital
    participant Orbital as RestAPI de Orbital
    actor YourServer as Tu Servidor (Webhook)

    UserApp->>+Orbital: 1. POST /{endpoint_id} con Archivo
    Note left of Orbital: Valida API Key, permisos y guarda la petición
    Orbital-->>-UserApp: 2. Respuesta inmediata: 202 Accepted + request_id

    par "Proceso en Segundo Plano"
        Orbital->>+IA de Orbital: 3. Envía el documento para análisis
        IA de Orbital-->>-Orbital: 4. Devuelve el JSON extraído y los tokens usados

        rect rgb(240, 240, 240)
        Note over Orbital: Lógica interna:<br/>- Deduce créditos<br/>- Registra el resultado<br/>- Firma el payload con el 'secret'
        end
    and "Notificación"
        Orbital->>+YourServer: 5. POST al webhook con resultado + firma
        YourServer->>YourServer: 6. ¡CRÍTICO! Validar la firma HMAC
        YourServer-->>-Orbital: 7. Respuesta 200 OK
    end`}
            </code>
          </pre>
        </section>

        {/* Sección 3 | Endpoints de la API - Detalla los puntos de acceso y sus parametros. */}
        <section id="api-endpoints" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            3. Endpoints de la API
          </h2>
          <h3 className="text-xl font-medium text-white mb-2 mt-6">
            3.1. Procesar un Documento
          </h3>
          <p className="text-neutral-300">
            `POST /{`{endpoint_id}`}`
          </p>
          <p className="text-neutral-300 mt-3">
            Este es el endpoint principal para enviar documentos.
          </p>
          <p className="text-neutral-300 mt-3">
            **Parámetros de la URL:**
          </p>
          <ul className="list-disc pl-6 text-neutral-300">
            <li>
              `endpoint_id` (UUID, obligatorio): El identificador de tu
              configuración de endpoint.
            </li>
          </ul>
          <p className="text-neutral-300 mt-3">
            **Headers:**
          </p>
          <ul className="list-disc pl-6 text-neutral-300">
            <li>
              `Authorization` (string, obligatorio): `Bearer &lt;tu_api_key&gt;`.
            </li>
            <li>
              `Content-Type` (string, obligatorio): `multipart/form-data`.
            </li>
          </ul>
          <p className="text-neutral-300 mt-3">
            **Cuerpo (form-data):**
          </p>
          <ul className="list-disc pl-6 text-neutral-300">
            <li>
              `file` (archivo, obligatorio): El documento a procesar (`.pdf`,
              `.docx`, `.png`, `.jpg`).
            </li>
          </ul>
        </section>

        {/* Sección 4 | Definicion del Esquema JSON - Estructurar la salida de datos. */}
        <section id="schema-json" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            4. Definición del Esquema de Salida (JSON)
          </h2>
          <p className="text-neutral-300">
            El esquema de salida es el corazón de `Orbital`. Es un objeto JSON
            que tú defines y que le sirve como plantilla a la IA para saber qué
            información extraer y cómo estructurarla.
          </p>
          <h3 className="text-xl font-medium text-white mb-2 mt-6">
            4.1. ¿Para qué sirve el esquema?
          </h3>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>
              **Define la estructura**: Le dices a la IA exactamente qué campos
              quieres (ej. `nombre`, `experiencia_laboral`, `habilidades`).
            </li>
            <li>
              **Guía a la IA**: Actúa como un conjunto de instrucciones
              precisas, asegurando que la IA busque la información relevante
              para ti.
            </li>
            <li>
              **Garantiza consistencia**: Asegura que cada webhook que recibas
              tenga una estructura JSON predecible, facilitando su
              procesamiento en tu backend.
            </li>
          </ul>
          <p className="text-neutral-300 mt-3">
            **Ejemplo de un esquema para un CV:**
          </p>
          {/* Ejemplo de JSON Schema para un CV. */}
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
            <code>
              {`{
  "nombre_completo": "string",
  "informacion_de_contacto": {
    "email": "string",
    "telefono": "string",
    "linkedin": "string"
  },
  "resumen_profesional": "string",
  "experiencia": [
    {
      "puesto": "string",
      "empresa": "string",
      "periodo": "string",
      "descripcion": "string"
    }
  ],
  "habilidades_tecnicas": ["string"]
}`}
            </code>
          </pre>
          <h3 className="text-xl font-medium text-white mb-2 mt-6">
            4.2. La importancia de los campos `null`
          </h3>
          <p className="text-neutral-300">
            Una regla fundamental de la IA de `Orbital` es la consistencia
            estructural.
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2 mt-3">
            <li>
              **Si la IA no encuentra información** para un campo específico en
              el documento, **no omitirá el campo**. En su lugar, le asignará
              un valor `null`.
            </li>
            <li>
              Si un campo es una lista (como `experiencia` o
              `habilidades_tecnicas`) y no se encuentra ningún elemento, la IA
              devolverá una lista vacía `[]`.
            </li>
          </ul>
          <p className="text-neutral-300 mt-3">
            Esto significa que siempre puedes contar con que el `data` de tu
            webhook contendrá todas las claves definidas en tu esquema,
            evitando errores de `KeyError` o `property does not exist` en tu
            código.
          </p>
        </section>

        {/* Sección 5 | Recibiendo Datos con Webhooks - Como recibir los resultados. */}
        <section id="webhooks" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            5. Recibiendo Datos con Webhooks
          </h2>
          <h3 className="text-xl font-medium text-white mb-2 mt-6">
            5.1. Consumo de Créditos
          </h3>
          <p className="text-neutral-300">
            El coste de cada procesamiento se basa en el número total de
            *tokens* utilizados por la IA.
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2 mt-3">
            <li>
              Tras un procesamiento exitoso, los créditos correspondientes al
              `total_tokens` del `usage` se deducen de tu cuenta.
            </li>
            <li>
              Si no tienes créditos suficientes en el momento de la deducción,
              el procesamiento se marcará como fallido con un error de
              `InsufficientCreditsError`, aunque el análisis de `Orbital` haya
              sido exitoso.
            </li>
          </ul>
          <h3 className="text-xl font-medium text-white mb-2 mt-6">
            5.2. Estructura del Payload (Respuesta)
          </h3>
          <p className="text-neutral-300">
            Tu endpoint de webhook recibirá un `POST` con el resultado.
          </p>
          <p className="text-neutral-300 mt-3">
            **Payload de Éxito (`status: "completed"`):**
          </p>
          {/* Ejemplo de Payload exitoso de webhook. */}
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
            <code>
              {`{
  "status": "completed",
  "data": { ... }, // Objeto con la información extraída según tu schema
  "usage": {
    "prompt_tokens": 512,
    "completion_tokens": 256,
    "total_tokens": 768
  }
}`}
            </code>
          </pre>
          <p className="text-neutral-300 mt-3">
            **Payload de Error (`status: "failed"`):**
          </p>
          {/* Ejemplo de Payload de Error de webhook. */}
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
            <code>
              {`{
  "status": "failed",
  "error": "Créditos insuficientes. Se requieren 768 créditos para esta operación.",
  "data": null
}`}
            </code>
          </pre>
        </section>

        {/* Seccion 6 | Detalla los errores y como manejarlos */}
        <section id="errores" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            6. Gestión de Errores
          </h2>
          <h3 className="text-xl font-medium text-white mb-2 mt-6">
            6.1. Errores Síncronos (Respuesta al `POST` inicial)
          </h3>
          <p className="text-neutral-300">
            Estos errores ocurren inmediatamente al hacer la petición.
          </p>
          {/* Tabla de errores sincronos, mostrando codigos, detalles etc. */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left border border-white/10 rounded-2xl overflow-hidden">
              <thead className="bg-white/10 text-white">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">`detail`</th>
                  <th className="px-4 py-3">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-neutral-300">
                <tr>
                  <td className="px-4 py-3">`401 Unauthorized`</td>
                  <td className="px-4 py-3">
                    `API Key inválida o no proporcionada.` / `No se proporcionó
                    una API Key válida en el formato 'Bearer &lt;key&gt;'.`
                  </td>
                  <td className="px-4 py-3">
                    El header `Authorization` es incorrecto o la clave no es
                    válida.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">`402 Payment Required`</td>
                  <td className="px-4 py-3">
                    `Créditos insuficientes. Se requieren X créditos...`
                  </td>
                  <td className="px-4 py-3">
                    No tienes créditos para iniciar la operación (esto es un
                    chequeo preliminar, el débito final ocurre después).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">`403 Forbidden`</td>
                  <td className="px-4 py-3">
                    `No tienes permiso para usar este endpoint.`
                  </td>
                  <td className="px-4 py-3">
                    La API Key es válida, pero no está asociada al
                    `endpoint_id` solicitado.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">`404 Not Found`</td>
                  <td className="px-4 py-3">
                    `Endpoint con id '...' no encontrado.`
                  </td>
                  <td className="px-4 py-3">
                    El `endpoint_id` en la URL no existe.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">`422 Unprocessable Entity`</td>
                  <td className="px-4 py-3">(Error de FastAPI)</td>
                  <td className="px-4 py-3">
                    El archivo no se adjuntó correctamente en el campo `file`
                    del `multipart/form-data`.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Seccion 7 | Debugging y Logs */}
        <section id="debugging" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold text-white mb-3">
            7. Debugging y Logs
          </h2>
          <p className="text-neutral-300">
            El sistema registra información detallada sobre cada paso del
            proceso, lo cual es invaluable para la depuración.
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2 mt-3">
            <li>
              **Archivo de Log**: Todos los eventos se registran en
              `logs/app.log` dentro del entorno de la API.
            </li>
            <li>
              **Base de Datos de Logs**:
              <ul className="list-disc pl-6 text-neutral-300 space-y-1 mt-1">
                <li>
                  `requests`: Cada petición `POST` inicial crea un registro en
                  esta tabla. Puedes seguir el ciclo de vida de tu petición a
                  través de su `status` (`processing`, `completed`, `failed`).
                </li>
                <li>
                  `request_logs`: Contiene el `payload_out` final que se envía
                  al webhook, el uso de créditos y cualquier mensaje de error.
                </li>
                <li>
                  `webhooks`: Registra cada intento de envío de un webhook,
                  incluyendo el `http_status` de la respuesta de tu servidor y
                  los errores.
                </li>
              </ul>
            </li>
          </ul>
          <p className="text-neutral-300 mt-3">
            Si contactas a soporte, por favor proporciona el `request_id` para
            que podamos rastrear el problema rápidamente.
          </p>
        </section>

        {/* VISUALIZAR CODIGO CON BOTON COPIAR */}
        {/* Seccion que permite visualizar y copiar fragmentos de codigo */}
        <section id="visualizador-codigo" className="scroll-mt-28">
          <h2 className="text-3xl font-semibold text-white mb-4">
            4. Ejemplos de implementación
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex gap-2 mb-3">
              {/* Mapea los lenguajes disponibles en 'codeSnippets' para crear botones de seleccion. */}
              {Object.keys(codeSnippets).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeLang === lang
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
              {/* Boton para copiar el fragmento de codigo al portapapeles. */}
              <button
                onClick={copyToClipboard}
                className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
              >
                Copiar
              </button>
            </div>
            {/* Muestra el fragmento de codigo correspondiente del lenguaje seleccionado. */}
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
              <code>{codeSnippets[activeLang]}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
