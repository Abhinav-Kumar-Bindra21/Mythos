import express from "express";
import { createChat, deleteChat, getChat } from "../controllers/chat.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.use(protectRoute);

chatRouter.get("/create", createChat);
chatRouter.get("/get", getChat);
chatRouter.post("/delete", deleteChat);

export default chatRouter;
