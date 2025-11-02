import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { create } from "../controllers/onboarding";
import { errorHandler } from "../error-handler";

const onboardingRouter: Router = Router();

onboardingRouter.post("/create", authenticateToken, errorHandler(create));

export default onboardingRouter;
