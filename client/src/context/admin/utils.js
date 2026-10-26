import {
  MB,
  IMAGE_TYPES,
  VIDEO_TYPES,
  MAX_IMAGE,
  MAX_VIDEO,
  DEFAULT_COLOR_FALLBACK,
  DEFAULT_LOOK_FALLBACK,
} from "./constants";

export const formatBytes = (b) =>
  b >= 1024 * MB
    ? `${(b / (1024 * MB)).toFixed(1)} GB`
    : b >= MB
    ? `${(b / MB).toFixed(1)} MB`
    : `${Math.max(1, Math.round(b / 1024))} KB`;

export const formatDate = (d) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const isVideoFile = (file) => file && VIDEO_TYPES.includes(file.type);

export const isVideoSrc = (src, file) =>
  (file && isVideoFile(file)) || /\.(mp4|webm|mov|ogg)$/i.test(src || "");

export const checkFile = (f, { imagesOnly = false } = {}) => {
  const isImg = IMAGE_TYPES.includes(f.type);
  const isVid = VIDEO_TYPES.includes(f.type);
  if (imagesOnly && !isImg) return "Only image files allowed here.";
  if (!isImg && !isVid) return "Unsupported type. Use JPG, PNG, WebP, AVIF, MP4, WebM or MOV.";
  if (isImg && f.size > MAX_IMAGE) return `Images must be under ${MAX_IMAGE / MB} MB.`;
  if (isVid && f.size > MAX_VIDEO) return `Videos must be under ${MAX_VIDEO / MB} MB.`;
  return "";
};

export const parseSizes = (text) =>
  (text || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());

export const mediaList = (item) => {
  const list = [];
  if (item.lookImage) list.push({ src: item.lookImage, kind: "look" });
  (item.slideImage || []).forEach((src) => list.push({ src, kind: "slide" }));
  return list;
};

export const revokeItemUrls = (item) => {
  [item.lookImage, item.colorImage, ...(item.slideImage || [])].forEach((u) => {
    if (u?.startsWith("blob:")) URL.revokeObjectURL(u);
  });
};

/* ---------- API mapping ---------- */

/* Backend stores "products/<category>/<kind>/<product>/<folder>/<file>", served statically by Express */
export const toAbsoluteUrl = (path) => {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/i.test(path)) return path; // Cloudinary / already absolute
  return `/${path.replace(/^\/+/, "")}`;
};

/* Mongo document -> the item shape the cards expect */
export const normalizeProduct = (p) => ({
  id: p._id,
  productName: p.productName,
  brand: p.brand,
  price: p.price || 0,
  description: p.description || "",
  isTrending: !!p.trending,
  kind: p.kind,
  category: p.category,
  colorName: p.colorName || "",
  colorImage: toAbsoluteUrl(p.colorImage),
  colorFallback: DEFAULT_COLOR_FALLBACK,
  sizes: p.sizesAvailable || [],
  stock: p.stock,
  lookImage: toAbsoluteUrl(p.lookImage),
  slideImage: (p.slideImage || []).map(toAbsoluteUrl),
  lookFallback: DEFAULT_LOOK_FALLBACK,
  uploaded: new Date(p.createdAt || Date.now()),
  bytes: 0, // the API doesn't return file sizes
});