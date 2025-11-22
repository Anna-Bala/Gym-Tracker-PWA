import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { getUserStatistics } from "../controllers/user";

const userRouter: Router = Router();

userRouter.get("/statistic", authenticateToken, errorHandler(getUserStatistics));

export default userRouter;
