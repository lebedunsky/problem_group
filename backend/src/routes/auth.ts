import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAdmin } from "../middleware/auth";

export const authRouter = Router();

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Вкажіть логін і пароль" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { login: parsed.data.login } });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      res.status(401).json({ error: "Невірний логін або пароль" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, login: user.login, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user.id, login: user.login, role: user.role } });
  })
);

authRouter.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ user: req.auth });
  })
);
