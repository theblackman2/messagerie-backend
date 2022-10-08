import { Router } from "express";
import {
  findOrCreate,
  getAll,
  getOne,
} from "../controllers/conversationController.js";

const conversationsRouter = Router();

conversationsRouter.get("/", getAll);

conversationsRouter.post("/", findOrCreate);

export default conversationsRouter;
