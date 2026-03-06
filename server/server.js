const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const pollRoutes = require("./routes/pollRoutes");
const userRoutes = require("./routes/userRoutes");

require("./utils/cronJobs");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

/* SOCKET.IO SETUP */

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/polls", pollRoutes);

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("PollPulse API Running...");
});

/* PROTECTED PROFILE */

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Welcome to your profile 🔐",
    userId: req.user,
  });
});

/* SERVER START */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});