import { Router } from "express";
import authRoutes from "./auth";
import exercisesRoutes from "./exercises";
import onboardingRoutes from "./onboarding";
import userRoutes from "./user";
import workoutPlansRouter from "./workoutPlans";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/onboarding", onboardingRoutes);
rootRouter.use("/exercises", exercisesRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/workout-plans", workoutPlansRouter);

export default rootRouter;
