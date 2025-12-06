import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { get, getUserStatistics, patch } from "../controllers/user";

const userRouter: Router = Router();

userRouter.get("/", authenticateToken, errorHandler(get));
userRouter.patch("/", authenticateToken, errorHandler(patch));
userRouter.get("/statistic", authenticateToken, errorHandler(getUserStatistics));

export default userRouter;
