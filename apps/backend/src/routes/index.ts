import { Router } from "express";
import authRoutes from "./auth";
import onboardingRoutes from "./onboarding";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/onboarding", onboardingRoutes);

export default rootRouter;
