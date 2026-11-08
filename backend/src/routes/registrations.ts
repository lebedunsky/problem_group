import { Router } from "express";
import { RequestStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const registrationsRouter = Router();

registrationsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, academicGroup, course, direction, about, motivation } =
      req.body;
    if (!firstName || !lastName || !email || !phone || !academicGroup || !course || !direction) {
      res.status(400).json({ error: "Заповніть усі обов'язкові поля" });
      return;
    }
    const item = await prisma.registrationRequest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        academicGroup,
        course: Number(course),
        direction,
        about: about || "",
        motivation: motivation || "",
      },
    });
    res.status(201).json(item);
  })
);

registrationsRouter.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const status = req.query.status as RequestStatus | undefined;
    const items = await prisma.registrationRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  })
);

registrationsRouter.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await prisma.registrationRequest.update({
      where: { id: String(req.params.id) },
      data: { status: req.body.status },
    });
    res.json(item);
  })
);

registrationsRouter.post(
  "/:id/approve",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const request = await prisma.registrationRequest.findUnique({ where: { id } });
    if (!request) {
      res.status(404).json({ error: "Заявку не знайдено" });
      return;
    }
    if (request.status === "APPROVED") {
      res.status(409).json({ error: "Заявку вже схвалено" });
      return;
    }
    const participant = await prisma.$transaction(async (tx) => {
      const created = await tx.participant.create({
        data: {
          firstName: request.firstName,
          lastName: request.lastName,
          academicGroup: request.academicGroup,
          course: request.course,
          role: "Учасник",
          direction: request.direction,
          bio: request.about,
          email: request.email,
        },
      });
      await tx.registrationRequest.update({
        where: { id: request.id },
        data: { status: "APPROVED" },
      });
      return created;
    });
    res.json({ requestStatus: "APPROVED", participant });
  })
);

registrationsRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.registrationRequest.delete({ where: { id: String(req.params.id) } });
    res.json({ ok: true });
  })
);
