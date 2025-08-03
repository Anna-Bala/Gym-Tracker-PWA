import express, { Express } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PORT } from "./secrets";

const app: Express = express();

app.use(cors());
app.use(express.json());

export const prismaClient = new PrismaClient();

app.get("/", (_, res) => {
  res.send("Backend is working!");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
