import mongoose from "mongoose";
const mongodbUrl = process.env.MONGO_DB_URL;

mongoose.connect(mongodbUrl, (err) => {
  if (err) throw err;
  console.log("Connected to the DB");
});

export default mongoose;
