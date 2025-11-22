import { Request, Response } from "express";
import { prismaClient } from "..";

export const getUserStatistics = async (req: Request, res: Response) => {
  const userId = req.userId;

  let onboarding = await prismaClient.onboarding.findFirst({ where: { userId } });

  res.json({ height: onboarding?.height || 0, weight: onboarding?.weight || 0 });
};
