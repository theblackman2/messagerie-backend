import { Router } from "express";
import { getAll, getOne } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getAll);
userRouter.get("/:id", getOne);

export default userRouter;
