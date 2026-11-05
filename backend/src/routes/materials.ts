import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const materialsRouter = Router();

materialsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const type = req.query.type as string | undefined;
    const q = req.query.q as string | undefined;
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }
    const items = await prisma.material.findMany({
      where,
      orderBy: { date: "desc" },
    });
    res.json(items);
  })
);

materialsRouter.post(
  "/",
  requireAdmin,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl || null;
    const item = await prisma.material.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        category: req.body.category,
        author: req.body.author,
        date: new Date(req.body.date),
        fileUrl,
        url: req.body.url || null,
        meetingId: req.body.meetingId || null,
        newsId: req.body.newsId || null,
        resultId: req.body.resultId || null,
      },
    });
    res.status(201).json(item);
  })
);

materialsRouter.put(
  "/:id",
  requireAdmin,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl;
    const item = await prisma.material.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        category: req.body.category,
        author: req.body.author,
        date: req.body.date ? new Date(req.body.date) : undefined,
        fileUrl,
        url: req.body.url,
        meetingId: req.body.meetingId || null,
        newsId: req.body.newsId || null,
        resultId: req.body.resultId || null,
      },
    });
    res.json(item);
  })
);

materialsRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.material.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  })
);

export const uploadsRouter = Router();

uploadsRouter.post(
  "/",
  requireAdmin,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "Файл не завантажено" });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  })
);
