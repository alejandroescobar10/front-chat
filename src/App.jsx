import React, { useState, useEffect, useRef } from "react";
import { Realtime } from "ably";

function App() {
  const [message, setMessage] = useState(""); // Mensaje que escribe el usuario
  const [messages, setMessages] = useState([]); // Todos los mensajes
  const messagesEndRef = useRef(null); // Referencia al final del contenedor de mensajes

  useEffect(() => {
    const ably = new Realtime({
      key: "6bgz8Q.pc07CQ:rjC34iblLGHkCAcy4YUVArd0gFn0cg4WKVuXgEKsNR4",
    });
    const channel = ably.channels.get("chat-demo");

    channel.subscribe((msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "Other", body: msg.data },
      ]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { from: "Me", body: message },
    ]);

    const ably = new Realtime({
      key: "6bgz8Q.pc07CQ:rjC34iblLGHkCAcy4YUVArd0gFn0cg4WKVuXgEKsNR4",
    });
    const channel = ably.channels.get("chat-demo");
    channel.publish("message", message);

    setMessage("");
  };

  // Desplazar hacia abajo al final del contenedor de mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
        <ul className="max-h-60 overflow-y-auto">
          {messages.map((msg, i) => (
            <li
              key={i}
              className={`my-2 p-2 table text-sm rounded-md ${
                msg.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
            >
              {msg.from}: {msg.body}
            </li>
          ))}
          <div ref={messagesEndRef} />{" "}
          {/* Elemento de referencia para el desplazamiento */}
        </ul>
      </form>
    </div>
  );
}

export default App;
