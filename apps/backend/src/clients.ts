import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
import { REDIS_URL } from "./secrets";

export const prismaClient = new PrismaClient();
export const redisClient = createClient({ url: REDIS_URL });
