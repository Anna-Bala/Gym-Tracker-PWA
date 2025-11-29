import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { create, patch } from "../controllers/onboarding";
import { errorHandler } from "../error-handler";

const onboardingRouter: Router = Router();

onboardingRouter.post("/", authenticateToken, errorHandler(create));
onboardingRouter.patch("/", authenticateToken, errorHandler(patch));

export default onboardingRouter;
