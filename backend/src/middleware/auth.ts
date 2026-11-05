import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthPayload = { userId: string; login: string; role: string };

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: "Потрібна авторизація" });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthPayload;
    if (payload.role !== "ADMIN") {
      res.status(403).json({ error: "Недостатньо прав" });
      return;
    }
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: "Недійсний або прострочений токен" });
  }
}
