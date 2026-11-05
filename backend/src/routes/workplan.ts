import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const workPlanRouter = Router();

const include = { responsible: true };

workPlanRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const items = await prisma.workPlanItem.findMany({
      where: status ? { status: status as never } : undefined,
      include,
      orderBy: { date: "asc" },
    });
    res.json(items);
  })
);

workPlanRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.workPlanItem.create({
      data: {
        date: new Date(req.body.date),
        title: req.body.title,
        description: req.body.description,
        workType: req.body.workType,
        status: req.body.status,
        responsibleId: req.body.responsibleId || null,
      },
      include,
    });
    res.status(201).json(item);
  })
);

workPlanRouter.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.workPlanItem.update({
      where: { id: req.params.id },
      data: {
        date: req.body.date ? new Date(req.body.date) : undefined,
        title: req.body.title,
        description: req.body.description,
        workType: req.body.workType,
        status: req.body.status,
        responsibleId: req.body.responsibleId || null,
      },
      include,
    });
    res.json(item);
  })
);

workPlanRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.workPlanItem.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  })
);
