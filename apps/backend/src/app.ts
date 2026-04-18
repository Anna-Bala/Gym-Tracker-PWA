import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import { errorMiddleware } from "./middlewares/error";
import { FRONT_END_ORIGIN } from "./secrets";
import rootRouter from "./routes";

const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONT_END_ORIGIN,
    credentials: true,
  })
);

app.use("/api", rootRouter);
app.use(errorMiddleware);

export default app;
