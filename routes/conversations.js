import { Router } from "express";
import {
  addMessage,
  findOrCreate,
  getAll,
  getRecents,
} from "../controllers/conversationController.js";

const conversationsRouter = Router();

conversationsRouter.get("/", getAll);

conversationsRouter.post("/", findOrCreate);

conversationsRouter.post("/message", addMessage);

conversationsRouter.get("/recents", getRecents);

export default conversationsRouter;
