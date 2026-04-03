import { writeFile, mkdir } from "fs/promises";
import path from "path";

function uploadDir(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
}

/**
 * Saves an uploaded File to disk under UPLOAD_DIR.
 * `segments` form the relative path — the last segment is the filename.
 * Returns the public URL path (served by /api/uploads/...).
 */
export async function saveUpload(
  file: File,
  ...segments: string[]
): Promise<string> {
  const base = uploadDir();
  const dir = path.join(base, ...segments.slice(0, -1));
  const filename = segments[segments.length - 1];
  const dest = path.join(dir, filename);

  // Security: ensure dest is inside UPLOAD_DIR
  if (!dest.startsWith(base)) {
    throw new Error("Invalid upload path");
  }

  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(dest, buffer);

  return `/api/uploads/${segments.join("/")}`;
}

/** Returns the extension (with dot, lowercased) from a File's name or type. */
export function fileExtension(file: File): string {
  const fromName = path.extname(file.name).toLowerCase();
  if (fromName) return fromName;
  // fallback from mime type
  const mime = file.type.split("/")[1];
  return mime ? `.${mime}` : ".jpg";
}
