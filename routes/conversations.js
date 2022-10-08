import { Router } from "express";
import {
  addMessage,
  findOrCreate,
  getAll,
} from "../controllers/conversationController.js";

const conversationsRouter = Router();

conversationsRouter.get("/", getAll);

conversationsRouter.post("/", findOrCreate);

conversationsRouter.post("/message", addMessage);

export default conversationsRouter;
