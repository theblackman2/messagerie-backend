import express from "express";
import "dotenv/config";
const PORT = process.env.PORT || 5000;
import cors from "cors";
import userRouter from "./routes/users.js";
import passport from "passport";
import authRouter from "./routes/auth.js";
import authMiddleware from "./middlewares/auth/auth.js";
import conversationsRouter from "./routes/conversations.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { log } from "console";
import Conversation from "./models/conversation.js";

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello from the backend");
});

app.use("/auth", authRouter);

// This part requires an authentification
app.use(authMiddleware.authenticate("jwt", { session: false }));

app.use("/users", userRouter);
app.use("/conversations", conversationsRouter);

app.all("*", (request, response) => {
  response.sendStatus(404);
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// store all online users
global.onlineUsers = {};

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("send-msg", async (data) => {
    const sendUserSocket = onlineUsers[data.to];
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive", {
        conversationId: data.conversation,
        message: data.message,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
