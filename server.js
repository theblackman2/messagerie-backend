import express from "express";
import "dotenv/config";
const PORT = process.env.PORT || 5000;
import cors from "cors";
import userRouter from "./routes/users.js";
import passport from "passport";
import authRouter from "./routes/auth.js";
import authMiddleware from "./middlewares/auth/auth.js";

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

app.all("*", (request, response) => {
  response.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
