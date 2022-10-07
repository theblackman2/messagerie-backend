import { Router } from "express";
import { login, register } from "../controllers/userController.js";
import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  const users = User.find();
  res.send(users);
});

export default userRouter;
