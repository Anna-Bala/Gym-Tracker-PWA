import express, { Express } from "express";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";
import { FRONT_END_ORIGIN, PORT, REDIS_URL } from "./secrets";
import rootRouter from "./routes";

const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONT_END_ORIGIN,
    credentials: true
  })
);

export const prismaClient = new PrismaClient();
export const redisClient = createClient({ url: REDIS_URL });

redisClient.connect().catch(console.error);

app.use("/api", rootRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
