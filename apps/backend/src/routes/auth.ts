import { Router } from "express";
import { errorHandler } from "../error-handler";
import { login, signup } from "../controllers/auth";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandler(signup));
authRouter.post("/login", errorHandler(login));

export default authRouter;
