import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";

export const statsRouter = Router();

statsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [participants, meetings, results, materials, news] = await Promise.all([
      prisma.participant.count(),
      prisma.meeting.count(),
      prisma.result.count(),
      prisma.material.count(),
      prisma.news.count({ where: { published: true } }),
    ]);
    res.json({ participants, meetings, results, materials, news });
  })
);
