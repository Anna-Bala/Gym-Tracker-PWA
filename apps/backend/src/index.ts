import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";
import { PORT } from "./secrets";
import rootRouter from "./routes";

const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

export const prismaClient = new PrismaClient();

app.use("/api", rootRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
