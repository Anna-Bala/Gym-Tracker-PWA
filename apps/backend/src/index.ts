import express, { Express } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";
import { PORT } from "./secrets";
import rootRouter from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());

export const prismaClient = new PrismaClient();

app.use("/api", rootRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
