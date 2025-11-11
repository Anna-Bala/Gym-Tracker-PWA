import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { errorHandler } from "../error-handler";
import { getAllExercises, getExercisesByName, getFilteredExercises } from "../controllers/exercises";

const exercisesRouter: Router = Router();

exercisesRouter.get("", authenticateToken, errorHandler(getAllExercises));
exercisesRouter.post("/filter", authenticateToken, errorHandler(getFilteredExercises));
exercisesRouter.post("/search", authenticateToken, errorHandler(getExercisesByName));

export default exercisesRouter;
