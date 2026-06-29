import express from "express";
import { getUser, login, logout, registerUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.get("/data", protectRoute, getUser);

export default userRouter;
