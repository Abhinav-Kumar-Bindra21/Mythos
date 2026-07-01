import express from "express";
import { imageMessageController, textMessageController } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.use(protectRoute);

messageRouter.post("/text", textMessageController);
messageRouter.post("/image", imageMessageController);

export default messageRouter;
