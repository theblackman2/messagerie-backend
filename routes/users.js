import { Router } from "express";
import { login, register } from "../controllers/userController.js";
import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

export default userRouter;
