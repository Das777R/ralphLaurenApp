export const MB = 1024 * 1024;
export const QUOTA = 1024 * MB;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const MAX_IMAGE = 5 * MB;
export const MAX_VIDEO = 50 * MB;
export const MAX_BATCH = 20;

// Capitalized to match your MongoDB data or kept uniform
export const CATEGORIES = ["Men", "Women", "Kids & Baby", "Home", "Discover"];


export const DEFAULT_COLOR_FALLBACK = "linear-gradient(135deg,#9ca3af,#4b5563)";
export const DEFAULT_LOOK_FALLBACK = "linear-gradient(135deg,#64748b,#1e293b)";

export const emptyForm = () => ({
  productName: "",
  brand: "",
  price: "",
  description: "",
  isTrending: false,
  kind: "",
  category: "",
  colorName: "",
  sizesText: "", // Comma-separated text, parsed into the sizesAvailable array on submit
  stock: "",
  colorImage: null,
  lookImage: null,
  slideImages: [],
});