import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const resultsRouter = Router();

const include = { authors: { include: { participant: true } }, materials: true };

resultsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const type = req.query.type as string | undefined;
    const items = await prisma.result.findMany({
      where: type ? { type: type as never } : undefined,
      include,
      orderBy: { date: "desc" },
    });
    res.json(items);
  })
);

resultsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.result.findUnique({ where: { id: req.params.id }, include });
    if (!item) {
      res.status(404).json({ error: "Результат не знайдено" });
      return;
    }
    res.json(item);
  })
);

resultsRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { authorIds = [], ...rest } = req.body;
    const item = await prisma.result.create({
      data: {
        title: rest.title,
        description: rest.description,
        date: new Date(rest.date),
        supervisor: rest.supervisor,
        type: rest.type,
        category: rest.category,
        link: rest.link || null,
        fileUrl: rest.fileUrl || null,
        status: rest.status,
        authors: {
          create: (authorIds as string[]).map((id) => ({ participantId: id })),
        },
      },
      include,
    });
    res.status(201).json(item);
  })
);

resultsRouter.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { authorIds, ...rest } = req.body;
    const item = await prisma.$transaction(async (tx) => {
      if (authorIds) {
        await tx.resultAuthor.deleteMany({ where: { resultId: req.params.id } });
        await tx.resultAuthor.createMany({
          data: (authorIds as string[]).map((id) => ({
            resultId: req.params.id,
            participantId: id,
          })),
        });
      }
      return tx.result.update({
        where: { id: req.params.id },
        data: {
          title: rest.title,
          description: rest.description,
          date: rest.date ? new Date(rest.date) : undefined,
          supervisor: rest.supervisor,
          type: rest.type,
          category: rest.category,
          link: rest.link,
          fileUrl: rest.fileUrl,
          status: rest.status,
        },
        include,
      });
    });
    res.json(item);
  })
);

resultsRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.result.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  })
);
