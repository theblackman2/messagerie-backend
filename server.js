const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require("./services/mongoose");

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
