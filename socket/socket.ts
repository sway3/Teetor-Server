import { Server } from "socket.io";
import http, { METHODS } from "http";
import express from "express";
import userRoutes from "../routes/userRoutes";
import { getUserId } from "../utils/authFunctions";
import cookieParser from "cookie-parser";

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "https://teetor-client.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.options("*", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://teetor-client.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

app.use(userRoutes);

const server = http.createServer(app);
const io = new Server(server);

const cookie = require("cookie");

export const getRecicipientSocketId = (receiverId: string) => {
  console.log(userSocketMap);
  return userSocketMap[receiverId];
};

const userSocketMap: { [key: string]: string } = {};

io.on("connection", (socket) => {
  console.log("a user connected ", socket.id);

  let userId: null | string;

  const cookieHeader = socket.handshake.headers.cookie;

  if (cookieHeader) {
    const cookies = cookie.parse(cookieHeader);
    const accessToken = cookies.accessToken;
    userId = getUserId(accessToken);

    if (userId != "undefined") userSocketMap[userId] = socket.id;
    console.log(userSocketMap);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("user disconnected ", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
