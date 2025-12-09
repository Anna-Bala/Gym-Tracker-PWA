import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { changePassword, changeTheme, deleteAllUserRelatedData, get, getUserStatistics, patch } from "../controllers/user";

const userRouter: Router = Router();

userRouter.get("/", authenticateToken, errorHandler(get));
userRouter.patch("/", authenticateToken, errorHandler(patch));
userRouter.delete("/", authenticateToken, errorHandler(deleteAllUserRelatedData));
userRouter.patch("/password", authenticateToken, errorHandler(changePassword));
userRouter.patch("/theme", authenticateToken, errorHandler(changeTheme));
userRouter.get("/statistic", authenticateToken, errorHandler(getUserStatistics));

export default userRouter;
