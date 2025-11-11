import { Router } from "express";
import authRoutes from "./auth";
import onboardingRoutes from "./onboarding";
import exercisesRoutes from "./exercises";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/onboarding", onboardingRoutes);
rootRouter.use("/exercises", exercisesRoutes);

export default rootRouter;
