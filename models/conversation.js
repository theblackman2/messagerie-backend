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

const conversationSchema = new Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Conversation = db.model("Conversation", conversationSchema);

export default Conversation;
