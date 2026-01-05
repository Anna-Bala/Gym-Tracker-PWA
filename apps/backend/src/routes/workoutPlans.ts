import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { create, createWithAI, getAllWorkoutPlans, getWorkoutPlan, patch } from "../controllers/workoutPlans";

const workoutPlansRouter: Router = Router();

workoutPlansRouter.get("/", authenticateToken, errorHandler(getAllWorkoutPlans));
workoutPlansRouter.get("/:id", authenticateToken, errorHandler(getWorkoutPlan));
workoutPlansRouter.patch("/:id", authenticateToken, errorHandler(patch));
workoutPlansRouter.post("/", authenticateToken, errorHandler(create));
workoutPlansRouter.post("/ai", authenticateToken, errorHandler(createWithAI));

export default workoutPlansRouter;
