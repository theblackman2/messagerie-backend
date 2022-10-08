import mongoose from "mongoose";
const MONGO_DB_URL = process.env.MONGO_DB_URL;

mongoose.connect(MONGO_DB_URL, (err) => {
  if (err) throw err;
  console.log("Connected to the DB");
});

export default mongoose.connection;
