import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { settingsRouter } from "./routes/settings";
import { statsRouter } from "./routes/stats";
import { participantsRouter } from "./routes/participants";
import { registrationsRouter } from "./routes/registrations";
import { workPlanRouter } from "./routes/workplan";
import { scheduleRouter } from "./routes/schedule";
import { meetingsRouter } from "./routes/meetings";
import { resultsRouter } from "./routes/results";
import { newsRouter } from "./routes/news";
import { materialsRouter, uploadsRouter } from "./routes/materials";

const app = express();
const port = Number(process.env.PORT || 4000);

function normalizeOrigin(url: string) {
  return url.trim().replace(/\/+$/, "");
}

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, origin);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/participants", participantsRouter);
app.use("/api/registrations", registrationsRouter);
app.use("/api/work-plan", workPlanRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/meetings", meetingsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/news", newsRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/uploads", uploadsRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Внутрішня помилка сервера" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
