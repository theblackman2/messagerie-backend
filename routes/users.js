import { Router } from "express";
import { getAll, register } from "../controllers/userController.js";

const userRouter = Router();
userRouter.get("/", getAll);

export default userRouter;
