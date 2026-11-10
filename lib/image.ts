const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/** Accepts a full URL OR just a filename and always returns a valid image URL. */
export function imageSrc(image?: string | null): string {
  if (!image) return "";
  if (/^(https?:|data:|blob:)/i.test(image)) return image;

  const name = image.replace(/^\/+/, "").replace(/^uploads\//, "");
  return `${API_URL}/uploads/${encodeURIComponent(name)}`;
}