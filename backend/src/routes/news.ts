import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const newsRouter = Router();

newsRouter.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.category.findMany({ orderBy: { name: "asc" } }));
  })
);

newsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const category = req.query.category as string | undefined;
    const published = req.query.published;
    const q = req.query.q as string | undefined;
    const where: Record<string, unknown> = {};
    if (published !== "all") where.published = true;
    if (category) {
      where.category = { slug: category };
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ];
    }
    const items = await prisma.news.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
    });
    res.json(items);
  })
);

newsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.news.findUnique({
      where: { id: req.params.id },
      include: { category: true, materials: true },
    });
    if (!item) {
      res.status(404).json({ error: "Новину не знайдено" });
      return;
    }
    res.json(item);
  })
);

newsRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.news.create({
      data: {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        date: new Date(req.body.date),
        author: req.body.author,
        imageUrl: req.body.imageUrl || null,
        published: Boolean(req.body.published),
        categoryId: req.body.categoryId,
      },
      include: { category: true },
    });
    res.status(201).json(item);
  })
);

newsRouter.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        date: req.body.date ? new Date(req.body.date) : undefined,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        published: req.body.published,
        categoryId: req.body.categoryId,
      },
      include: { category: true },
    });
    res.json(item);
  })
);

newsRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  })
);
