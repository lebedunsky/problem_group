import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const meetingsRouter = Router();

const include = {
  participants: { include: { participant: true } },
  presentations: { include: { participant: true } },
  materials: true,
};

meetingsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const q = req.query.q as string | undefined;
    const where: Record<string, unknown> = {};
    if (from || to) {
      where.date = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }
    if (q) {
      where.OR = [
        { topic: { contains: q, mode: "insensitive" } },
        { discussion: { contains: q, mode: "insensitive" } },
      ];
    }
    const items = await prisma.meeting.findMany({
      where,
      include,
      orderBy: { date: "desc" },
    });
    res.json(items);
  })
);

meetingsRouter.get(
  "/latest",
  asyncHandler(async (_req, res) => {
    const now = new Date();
    const item = await prisma.meeting.findFirst({
      where: { date: { lte: now } },
      include,
      orderBy: { date: "desc" },
    });
    res.json(item);
  })
);

meetingsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.meeting.findUnique({
      where: { id: String(req.params.id) },
      include,
    });
    if (!item) {
      res.status(404).json({ error: "Засідання не знайдено" });
      return;
    }
    res.json(item);
  })
);

meetingsRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { participantIds = [], presentations = [], ...rest } = req.body;
    const item = await prisma.meeting.create({
      data: {
        number: Number(rest.number),
        date: new Date(rest.date),
        time: rest.time,
        topic: rest.topic,
        shortDescription: rest.shortDescription,
        agenda: rest.agenda,
        discussion: rest.discussion,
        results: rest.results,
        conclusions: rest.conclusions,
        photoUrl: rest.photoUrl || null,
        participants: {
          create: (participantIds as string[]).map((id) => ({ participantId: id })),
        },
        presentations: {
          create: (presentations as Array<Record<string, unknown>>).map((p) => ({
            participantId: String(p.participantId),
            title: String(p.title),
            description: String(p.description || ""),
            materialUrl: (p.materialUrl as string) || null,
            durationMinutes: Number(p.durationMinutes || 15),
          })),
        },
      },
      include,
    });
    res.status(201).json(item);
  })
);

meetingsRouter.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { participantIds, presentations, ...rest } = req.body;
    const meetingId = String(req.params.id);
    const item = await prisma.$transaction(async (tx) => {
      if (participantIds) {
        await tx.meetingParticipant.deleteMany({ where: { meetingId } });
        await tx.meetingParticipant.createMany({
          data: (participantIds as string[]).map((id) => ({
            meetingId,
            participantId: id,
          })),
        });
      }
      if (presentations) {
        await tx.presentation.deleteMany({ where: { meetingId } });
        await tx.presentation.createMany({
          data: (presentations as Array<Record<string, unknown>>).map((p) => ({
            meetingId,
            participantId: String(p.participantId),
            title: String(p.title),
            description: String(p.description || ""),
            materialUrl: (p.materialUrl as string) || null,
            durationMinutes: Number(p.durationMinutes || 15),
          })),
        });
      }
      return tx.meeting.update({
        where: { id: meetingId },
        data: {
          number: rest.number !== undefined ? Number(rest.number) : undefined,
          date: rest.date ? new Date(rest.date) : undefined,
          time: rest.time,
          topic: rest.topic,
          shortDescription: rest.shortDescription,
          agenda: rest.agenda,
          discussion: rest.discussion,
          results: rest.results,
          conclusions: rest.conclusions,
          photoUrl: rest.photoUrl,
        },
        include,
      });
    });
    res.json(item);
  })
);

meetingsRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.meeting.delete({ where: { id: String(req.params.id) } });
    res.json({ ok: true });
  })
);
