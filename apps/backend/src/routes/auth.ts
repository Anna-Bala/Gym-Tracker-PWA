import { Router } from "express";
import { errorHandler } from "../error-handler";
import { googleAuth, login, logout, refresh, signup } from "../controllers/auth";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandler(signup));
authRouter.post("/login", errorHandler(login));
authRouter.post("/google", errorHandler(googleAuth));
authRouter.post("/logout", errorHandler(logout));
authRouter.post("/refresh", errorHandler(refresh));

export default authRouter;
