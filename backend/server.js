const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
 // ✅ looks inside backend/db.js



dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/worker", require("./routes/workerRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

io.on("connection", (socket) => {
  console.log("⚡ A client connected:", socket.id);
  socket.on("disconnect", () =>
    console.log("❌ Client disconnected:", socket.id)
  );
});

// Start
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
