const mongoose = require("mongoose");
const mongodbUrl = process.env.MONGO_DB_URL;

mongoose.connect(mongodbUrl, (err) => {
  if (err) throw err;
  console.log("Connected to the DB");
});

module.exports = mongoose;
