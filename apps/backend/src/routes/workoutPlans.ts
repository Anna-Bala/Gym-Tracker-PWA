import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { create, getAllWorkoutPlans, getWorkoutPlan } from "../controllers/workoutPlans";

const workoutPlansRouter: Router = Router();

workoutPlansRouter.get("/", authenticateToken, errorHandler(getAllWorkoutPlans));
workoutPlansRouter.get("/:id", authenticateToken, errorHandler(getWorkoutPlan));
workoutPlansRouter.post("/", authenticateToken, errorHandler(create));

export default workoutPlansRouter;
