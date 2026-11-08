import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const scheduleRouter = Router();

const include = { responsible: true };

scheduleRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await prisma.scheduleItem.findMany({
      include,
      orderBy: { date: "asc" },
    });
    res.json(items);
  })
);

scheduleRouter.get(
  "/upcoming",
  asyncHandler(async (_req, res) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const item = await prisma.scheduleItem.findFirst({
      where: {
        date: { gte: now },
        status: { in: ["PLANNED", "CONFIRMED"] },
      },
      include,
      orderBy: { date: "asc" },
    });
    res.json(item);
  })
);

scheduleRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.scheduleItem.create({
      data: {
        date: new Date(req.body.date),
        time: req.body.time,
        location: req.body.location,
        topic: req.body.topic,
        status: req.body.status,
        responsibleId: req.body.responsibleId || null,
      },
      include,
    });
    res.status(201).json(item);
  })
);

scheduleRouter.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.scheduleItem.update({
      where: { id: String(req.params.id) },
      data: {
        date: req.body.date ? new Date(req.body.date) : undefined,
        time: req.body.time,
        location: req.body.location,
        topic: req.body.topic,
        status: req.body.status,
        responsibleId: req.body.responsibleId || null,
      },
      include,
    });
    res.json(item);
  })
);

scheduleRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.scheduleItem.delete({ where: { id: String(req.params.id) } });
    res.json({ ok: true });
  })
);
