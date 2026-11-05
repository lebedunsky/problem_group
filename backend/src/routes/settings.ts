import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const settingsRouter = Router();

settingsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const settings = await prisma.groupSettings.findUnique({ where: { id: "main" } });
    res.json(settings);
  })
);

settingsRouter.put(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const settings = await prisma.groupSettings.update({
      where: { id: "main" },
      data: req.body,
    });
    res.json(settings);
  })
);
