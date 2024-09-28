import React, { useState, useEffect, useRef } from "react";
import { Realtime } from "ably";

function App() {
  const [message, setMessage] = useState(""); // Mensaje que escribe el usuario
  const [messages, setMessages] = useState([]); // Todos los mensajes
  const ably = useRef(
    new Realtime({
      key: "6bgz8Q.pc07CQ:rjC34iblLGHkCAcy4YUVArd0gFn0cg4WKVuXgEKsNR4",
    })
  ); // Reutilizar la misma instancia de Ably
  const channel = useRef(null); // Referencia al canal

  useEffect(() => {
    // Conectarse al canal solo una vez cuando el componente se monta
    channel.current = ably.current.channels.get("chat-demo");

    // Escuchar los mensajes que llegan en el canal
    channel.current.subscribe((msg) => {
      // Diferenciar si el mensaje es del usuario actual o de otro
      const isCurrentUser = msg.connectionId === ably.current.connection.id;
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: isCurrentUser ? "Me" : "Other", body: msg.data },
      ]);
    });

    // Limpiar la suscripción cuando el componente se desmonta
    return () => {
      channel.current.unsubscribe();
    };
  }, []);

  // Función para enviar un mensaje
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario
    if (message.trim() === "") return; // No permitir mensajes vacíos

    // Enviar el mensaje a través de Ably
    channel.current.publish("message", message);

    // Limpiar el campo de texto
    setMessage("");
  };

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center rounded-md">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat</h1>
        <input
          type="text"
          placeholder="Escribe el mensaje"
          className="border-2 border-zinc-500 p-2 w-full text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
        <ul>
          {messages.map((message, i) => (
            <li
              key={i}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
            >
              {message.from}: {message.body}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
