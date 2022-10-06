import express from "express";
import "dotenv/config";
const PORT = process.env.PORT || 5000;
import cors from "cors";
import { encrypt } from "./services/bcrypt.js";

console.log(encrypt("test"));

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello from the backend");
});

app.all("*", (request, response) => {
  response.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
