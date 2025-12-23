import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { create, get } from "../controllers/workoutHistory";

const workoutHistoryRouter: Router = Router();

workoutHistoryRouter.get("/", authenticateToken, errorHandler(get));
workoutHistoryRouter.post("/", authenticateToken, errorHandler(create));

export default workoutHistoryRouter;
