import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const participantsRouter = Router();

participantsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, course, direction } = req.query;
    const where: Record<string, unknown> = {};
    if (course) where.course = Number(course);
    if (direction && typeof direction === "string") {
      where.direction = { contains: direction, mode: "insensitive" };
    }
    if (q && typeof q === "string") {
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { academicGroup: { contains: q, mode: "insensitive" } },
        { role: { contains: q, mode: "insensitive" } },
      ];
    }
    const items = await prisma.participant.findMany({
      where,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });
    res.json(items);
  })
);

participantsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const item = await prisma.participant.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ error: "Учасника не знайдено" });
      return;
    }
    res.json(item);
  })
);

participantsRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.participant.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        photoUrl: req.body.photoUrl || null,
        academicGroup: req.body.academicGroup,
        course: Number(req.body.course),
        role: req.body.role,
        direction: req.body.direction,
        bio: req.body.bio,
        email: req.body.email || null,
      },
    });
    res.status(201).json(item);
  })
);

participantsRouter.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const item = await prisma.participant.update({
      where: { id },
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        photoUrl: req.body.photoUrl,
        academicGroup: req.body.academicGroup,
        course: Number(req.body.course),
        role: req.body.role,
        direction: req.body.direction,
        bio: req.body.bio,
        email: req.body.email,
      },
    });
    res.json(item);
  })
);

participantsRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await prisma.$transaction([
      prisma.presentation.deleteMany({ where: { participantId: id } }),
      prisma.meetingParticipant.deleteMany({ where: { participantId: id } }),
      prisma.resultAuthor.deleteMany({ where: { participantId: id } }),
      prisma.workPlanItem.updateMany({ where: { responsibleId: id }, data: { responsibleId: null } }),
      prisma.scheduleItem.updateMany({ where: { responsibleId: id }, data: { responsibleId: null } }),
      prisma.participant.delete({ where: { id } }),
    ]);
    res.json({ ok: true });
  })
);
