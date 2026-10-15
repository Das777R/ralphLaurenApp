import { MB, IMAGE_TYPES, VIDEO_TYPES, MAX_IMAGE, MAX_VIDEO } from "./constants";

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