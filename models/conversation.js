import mongoose from "mongoose";
import db from "./../services/mongoose.js";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

const Conversation = db.model("Conversation", conversationSchema);

export default Conversation;
