import React from "react";
import io from "socket.io-client";
import { useState, useEffect } from "react";

// Se asigna el dominio del backend (debe coincidir con el backend)
// Aquí se establece la conexión con el servidor de Socket.io.
const socket = io("http://localhost:4000");

function App() {
  // Definimos el estado para almacenar el mensaje que el usuario está escribiendo
  const [message, setMessage] = useState("");
  // Estado para almacenar todos los mensajes que se han enviado y recibido
  const [messages, setMessages] = useState([]);

  // Función que maneja el envío de mensajes
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario (recargar la página)
    // Creamos un objeto con el mensaje actual y la información del remitente
    const newMessage = {
      body: message, // El mensaje que el usuario ha escrito
      from: "Me", // Este mensaje es enviado desde el cliente ("Me" representa al usuario)
    };
    //ver los mensjaes que uno envia
    setMessages([...messages, newMessage]);
    // Actualizamos el estado local con el nuevo mensaje (solo en el frontend por ahora)
    socket.emit("message", message);
  };

  // useEffect es un hook que se ejecuta después de que el componente se haya montado
  useEffect(() => {
    // Escuchamos el evento "message" que viene del backend (cuando alguien más envía un mensaje)
    socket.on("message", receiveMessage); //llama a la función para actualizar los mensajes en el estado  de la app

    // Limpiamos el evento cuando el componente se desmonta, para evitar posibles fugas de memoria
    return () => {
      socket.off("message", receiveMessage); // Deja de escuchar el evento "message" cuando se desmonta
    };
  }, []); // [] asegura que solo se ejecute una vez, al montarse el componente

  // Función para manejar los mensajes recibidos del servidor y agregarlos al estado local
  const receiveMessage = (message) =>
    // Actualiza el estado añadiendo el nuevo mensaje al final del array de mensajes
    setMessages((state) => [...state, message]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center rounded-md">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat</h1>
        <input
          type="text"
          placeholder="Escribe el mensaje"
          className="border-2 border-zinc-500 p-2 w-full text-black"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Enviar</button>
        <ul>
          {messages.map((message, i) => (
            <li
              key={i}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === "Me" ? "bg-sky-700 ml-auto" : `bg-black`
              }`}
            >
              {/* Si el mensaje es mío, muestra "Me", si no, muestra "You" */}
              {message.from === "Me" ? "Me" : "You"}: {message.body}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
