// frontend/src/services/socket.js
import { io } from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // force websocket
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
