export const MB = 1024 * 1024;
export const QUOTA = 1024 * MB;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const MAX_IMAGE = 5 * MB;
export const MAX_VIDEO = 50 * MB;
export const MAX_BATCH = 20;
export const KINDS = ["men", "women", "kids&baby", "home", "discover"];

export const emptyForm = () => ({
  productName: "",
  brand: "",
  price: "",
  description: "",
  isTrending: false,
  kind: "",
  category: "",
  colorName: "",
  sizesText: "",
});

export const SEED = [
  {
    id: 1,
    productName: "Slim Fit Polo",
    brand: "Studio",
    price: 2499,
    description: "Breathable cotton polo",
    isTrending: true,
    kind: "men",
    category: "slim",
    colorName: "Navy",
    colorImage: null,
    colorFallback: "linear-gradient(135deg,#0d6efd,#1e3a8a)",
    sizes: ["S", "M", "L", "XL"],
    lookImage: null,
    slideImage: [],
    lookFallback: "linear-gradient(135deg,#0d6efd,#6f42c1)",
    uploaded: new Date(2026, 9, 12),
    bytes: 2.4 * MB,
  },
  {
    id: 2,
    productName: "Classic Hoodie",
    brand: "Studio",
    price: 3999,
    description: "Heavyweight fleece",
    isTrending: false,
    kind: "men",
    category: "classic",
    colorName: "Charcoal",
    colorImage: null,
    colorFallback: "linear-gradient(135deg,#4b5563,#111827)",
    sizes: ["M", "L", "XL", "XXL"],
    lookImage: null,
    slideImage: [],
    lookFallback: "linear-gradient(135deg,#6f42c1,#d63384)",
    uploaded: new Date(2026, 9, 10),
    bytes: 3.1 * MB,
  },
];