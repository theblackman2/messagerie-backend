import express from "express";
import "dotenv/config";
const PORT = process.env.PORT || 5000;
import cors from "cors";
import userRouter from "./routes/users.js";
import passport from "passport";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(cors());

import "./middlewares/auth/auth.js";

app.get("/", (request, response) => {
  response.send("Hello from the backend");
});

app.use("/users", userRouter);

app.use("/auth", authRouter);

app.get("/protected", passport.authenticate("jwt", { session: false }));

app.all("*", (request, response) => {
  response.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
