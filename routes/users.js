import { Router } from "express";
import {
  getAll,
  getOne,
  updateProfileImage,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getAll);
userRouter.get("/:id", getOne);
userRouter.put("/profilePicture", updateProfileImage);

export default userRouter;
