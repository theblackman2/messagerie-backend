import mongoose from "mongoose";
const MONGO_USER = process.env.MONGO_DB_USER;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;

mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_DB_PASSWORD}@messages.iosmgyv.mongodb.net/?retryWrites=true&w=majority`,
  (err) => {
    if (err) throw err;
    console.log("Connected to the DB");
  }
);

export default mongoose.connection;
