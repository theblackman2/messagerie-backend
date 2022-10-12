import mongoose from "mongoose";
import db from "./../services/mongoose.js";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const Message = db.model("Message", messageSchema);

export default Message;
