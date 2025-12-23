import { Router } from "express";
import authRoutes from "./auth";
import exercisesRoutes from "./exercises";
import onboardingRoutes from "./onboarding";
import userRoutes from "./user";
import workoutHistoryRouter from "./workoutHistory";
import workoutPlansRouter from "./workoutPlans";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/onboarding", onboardingRoutes);
rootRouter.use("/exercises", exercisesRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/workout-plans", workoutPlansRouter);
rootRouter.use("/workout-history", workoutHistoryRouter);

export default rootRouter;
