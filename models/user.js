import mongoose from "mongoose";
import db from "./../services/mongoose.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    pseudo: String,
    password: String,
    imageUrl: {
      type: String,
      default: "",
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const User = db.model("User", userSchema);

export default User;
