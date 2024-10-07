import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const sessionId = "unique-session-id"; // Usualmente generado en tu lógica de negocio
const clientId = "unique-client-id"; // Este puede ser el ID del usuario autenticado

ReactDOM.render(
  <React.StrictMode>
    <App sessionId={sessionId} clientId={clientId} />
  </React.StrictMode>,
  document.getElementById("root")
);
