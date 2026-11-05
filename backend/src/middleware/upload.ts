import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-а-яА-ЯіІїЇєЄ]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export function fileUrl(filename?: string | null) {
  if (!filename) return null;
  return `/uploads/${filename}`;
}
