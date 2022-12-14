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

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(passport.initialize());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
    origin: "*",
  },
});

// store all online users
global.onlineUsers = {};

io.on("connection", (socket) => {
  global.chatSocket = socket;

  // store a user among online users when connected
  socket.on("add-user", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  // send a message to a specifique user
  socket.on("send-msg", async (data) => {
    const sendUserSocket = onlineUsers[data.to];
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive", {
        sender: data.sender,
        conversationId: data.conversation,
        message: data.message,
      });
    }
  });

  // send a message when a user create account
  socket.on("first-time", (data) => {
    socket.broadcast.emit("user-joined", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
