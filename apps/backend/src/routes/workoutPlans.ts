import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { getAllWorkoutPlans, create } from "../controllers/workoutPlans";

const workoutPlansRouter: Router = Router();

workoutPlansRouter.get("/", authenticateToken, errorHandler(getAllWorkoutPlans));
workoutPlansRouter.post("/", authenticateToken, errorHandler(create));

export default workoutPlansRouter;
