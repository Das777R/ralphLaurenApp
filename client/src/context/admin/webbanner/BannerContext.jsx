import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../../../api/api.js"; // adjust path if needed

/* ---------- Config (match backend) ---------- */
export const PLACEMENTS = {
  landing: { label: "Landing", size: "1920 x 600", api: "landing" },
  men: { label: "Men", size: "1920 x 600", api: "page" },
  women: { label: "Women", size: "1920 x 600", api: "page" },
  "kids&baby": { label: "Kids & Baby", size: "1920 x 600", api: "page" },
  home: { label: "Home", size: "1920 x 600", api: "page" },
  discover: { label: "Discover", size: "1920 x 600", api: "page" },
};

/** Landing (homepage) sections — URL param uses hyphens */
export const LANDING_SECTIONS = {
  "rlc-hero": { label: "RLC Hero", pill: "pill-info", db: "rlc_hero" },
  "rlc-block": { label: "RLC Block", pill: "pill-muted", db: "rlc_block" },
  "rlc-wrapper": { label: "RLC Wrapper", pill: "pill-muted", db: "rlc_wrapper" },
  "rlc-trend": { label: "RLC Trend", pill: "pill-success", db: "rlc_trend" },
  "rlc-ads": { label: "RLC Ads", pill: "pill-muted", db: "rlc_ads" },
};

/** Category / nav pages */
export const PAGE_SECTIONS = {
  carousel: { label: "Carousel", pill: "pill-info" },
  category: { label: "Category", pill: "pill-muted" },
  stories: { label: "Stories", pill: "pill-success" },
  trend: { label: "Trend", pill: "pill-success" },
  explore: { label: "Explore", pill: "pill-muted" },
};

export const SECTIONS_BY_PLACEMENT = {
  landing: LANDING_SECTIONS,
  men: PAGE_SECTIONS,
  women: PAGE_SECTIONS,
  "kids&baby": PAGE_SECTIONS,
  home: PAGE_SECTIONS,
  discover: PAGE_SECTIONS,
};

export const SECTIONS = { ...LANDING_SECTIONS, ...PAGE_SECTIONS };

export const getSectionsForPlacement = (placement) =>
  SECTIONS_BY_PLACEMENT[placement] || SECTIONS;

/** Where the extra "tab thumbnail" upload is shown:
 *  - landing page          -> rlc-trend
 *  - men/women/kids&baby/home/discover -> carousel, trend */
const PAGE_THUMB_SECTIONS = ["carousel", "trend"];
export const THUMB_SECTIONS = {
  landing: ["rlc-trend"],
  men: PAGE_THUMB_SECTIONS,
  women: PAGE_THUMB_SECTIONS,
  "kids&baby": PAGE_THUMB_SECTIONS,
  home: PAGE_THUMB_SECTIONS,
  discover: PAGE_THUMB_SECTIONS,
};
export const needsThumb = (placement, section) =>
  !!THUMB_SECTIONS[placement]?.includes(section);

export const GRADIENTS = [
  "linear-gradient(135deg,#0d6efd,#6f42c1)",
  "linear-gradient(135deg,#fd7e14,#dc3545)",
  "linear-gradient(135deg,#20c997,#0d6efd)",
  "linear-gradient(135deg,#111827,#4b5563)",
  "linear-gradient(135deg,#6f42c1,#d63384)",
];

export const LIFECYCLE_PILL = {
  Live: "pill-success",
  Scheduled: "pill-info",
  Paused: "pill-muted",
  Expired: "pill-danger",
};

export const MAX_IMAGE_MB = 2;
export const MAX_VIDEO_MB = 50; // keep in sync with the backend upload limit

/* ---------- Backend origin (where uploaded files are served from) ---------- */
// Set VITE_API_URL in .env, e.g. VITE_API_URL=http://localhost:5000
// A trailing "/api" is stripped because uploads are usually served from the root.
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/api\/?$/,
  ""
);

/* ---------- Media helpers ---------- */
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;

/** Detects a video from a URL/path, ignoring any ?query or #hash */
export const isVideoUrl = (url) =>
  !!url && VIDEO_EXT.test(String(url).split(/[?#]/)[0]);

/* ---------- Date helpers ---------- */
export const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const formatDate = (s) =>
  s
    ? new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

export const getStatus = (b) => {
  const today = iso(new Date());
  if (!b.enabled) return "Paused";
  if (b.start && b.start > today) return "Scheduled";
  if (b.end && b.end < today) return "Expired";
  return "Live";
};

const groupKey = (b) => `${b.placement}|${b.section}|${b.device}`;

/* ---------- Form ---------- */
export const EMPTY = () => ({
  title: "",
  subtitle: "",
  cta: "Shop now",
  link: "/",
  brand: "",
  placement: "landing",
  section: "rlc-hero",
  device: "desktop",
  start: iso(new Date()),
  end: "",
  gradient: 0,
  imageUrl: null,
  imageName: "",
  mediaType: "image", // "image" | "video"
  file: undefined,
  thumbUrl: null, // tab thumbnail (only where needsThumb is true)
  thumbName: "",
  thumbFile: undefined,
  bgUrl: null, // optional background image
  bgName: "",
  bgFile: undefined,
  enabled: true,
});

export const validate = (f) => {
  const e = {};
  if (!f.title.trim()) e.title = "Title is required.";
  if (!/^(\/|https?:\/\/)/.test((f.link || "").trim())) {
    e.link = "Use a path like /sale or a full https:// URL.";
  }
  if (!f.start) e.start = "Pick a start date.";
  if (f.end && f.end < f.start) e.end = "End date must be on or after the start date.";
  if (!SECTIONS_BY_PLACEMENT[f.placement]?.[f.section]) {
    e.section = "Pick a section for this placement.";
  }
  if (!f.imageUrl && !f.file) e.image = "Banner image or video is required.";
  if (needsThumb(f.placement, f.section) && f.thumbFile) {
    if (!f.thumbFile.type?.startsWith("image/")) {
      e.thumb = "Thumbnail must be an image.";
    } else if (f.thumbFile.size > MAX_IMAGE_MB * 1024 * 1024) {
      e.thumb = `Thumbnail must be under ${MAX_IMAGE_MB} MB.`;
    }
  }
  // Background image is optional — only validate when one was picked
  if (f.bgFile) {
    if (!f.bgFile.type?.startsWith("image/")) {
      e.background = "Background must be an image.";
    } else if (f.bgFile.size > MAX_IMAGE_MB * 1024 * 1024) {
      e.background = `Background must be under ${MAX_IMAGE_MB} MB.`;
    }
  }
  return e;
};

/* ---------- Normalize API → UI banner ---------- */
// Accepts a string path or an object like { url } / { secure_url }.
// Relative paths are pointed at the backend, not the Vite dev server.
const toAbsolute = (path) => {
  const p =
    typeof path === "string" ? path : path?.url || path?.secure_url || "";
  if (!p) return null;
  if (/^(https?:|blob:|data:)/i.test(p)) return p;
  return `${API_ORIGIN}${p.startsWith("/") ? p : `/${p}`}`;
};

let localId = 0;
const nextId = () => `local-${++localId}-${Date.now()}`;

/** One API media entry → banner card shape */
const normalizeEntry = (entry, placement, section) => {
  const mediaArr = Array.isArray(entry.media)
    ? entry.media
    : entry.media
    ? [entry.media]
    : [];
  const first = mediaArr[0] || null;
  const url = toAbsolute(first);
  return {
    id: entry._id || nextId(),
    title: entry.title || "",
    subtitle: entry.description || "",
    cta: entry.cta || "Shop now",
    link: entry.link || "/",
    brand: entry.brand || "",
    placement,
    section,
    device: entry.forMobile ? "mobile" : "desktop",
    start: entry.start || iso(new Date()),
    end: entry.end || "",
    gradient: 0,
    imageUrl: url,
    imageName: "",
    thumbUrl: toAbsolute(entry.thumb),
    thumbName: "",
    bgUrl: toAbsolute(entry.background),
    bgName: "",
    mediaType: entry.mediaType || (isVideoUrl(url) ? "video" : "image"),
    enabled: entry.enabled !== false,
    _raw: entry,
  };
};

/* ---------- Context ---------- */
const BannerContext = createContext(null);

export function BannerProvider({ children }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState("All");
  const [section, setSection] = useState("All");
  const [deviceFilter, setDeviceFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY());
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(null);

  /* ---- Load all banners from both APIs ---- */
  const loadBanners = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const collected = [];

    try {
      // Landing sections
      await Promise.all(
        Object.keys(LANDING_SECTIONS).map(async (sec) => {
          try {
            const res = await api.get(`/landingPage/${sec}`);
            const list = res.data?.data || [];
            list.forEach((entry) =>
              collected.push(normalizeEntry(entry, "landing", sec))
            );
          } catch {
            // empty section is fine
          }
        })
      );

      // Page navs × parts
      const navs = ["men", "women", "kids&baby", "home", "discover"];
      const parts = Object.keys(PAGE_SECTIONS);
      await Promise.all(
        navs.flatMap((nav) =>
          parts.map(async (part) => {
            try {
              const res = await api.get(
                `/mediaforpage/${encodeURIComponent(nav)}/${part}`
              );
              const list = res.data?.data || [];
              list.forEach((entry) =>
                collected.push(normalizeEntry(entry, nav, part))
              );
            } catch {
              // empty is fine
            }
          })
        )
      );

      setBanners(collected);
    } catch (err) {
      setLoadError(err?.response?.data?.message || err.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  /* ---- Derived ---- */
  const stats = useMemo(() => {
    const s = banners.map(getStatus);
    return {
      total: banners.length,
      live: s.filter((x) => x === "Live").length,
      scheduled: s.filter((x) => x === "Scheduled").length,
      inactive: s.filter((x) => x === "Paused" || x === "Expired").length,
    };
  }, [banners]);

  const positions = useMemo(() => {
    const seen = {};
    const map = {};
    banners.forEach((b) => {
      const k = groupKey(b);
      seen[k] = (seen[k] || 0) + 1;
      map[b.id] = seen[k];
    });
    return map;
  }, [banners]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return banners.filter((b) => {
      const matchQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        (b.subtitle || "").toLowerCase().includes(q) ||
        (b.brand || "").toLowerCase().includes(q);
      const matchP = placement === "All" || b.placement === placement;
      const matchS = section === "All" || b.section === section;
      const matchD = deviceFilter === "All" || b.device === deviceFilter;
      return matchQ && matchP && matchS && matchD;
    });
  }, [banners, query, placement, section, deviceFilter]);

  /* ---- Media draft cleanup (banner media, thumbnail and background) ---- */
  const discardDraftImage = useCallback(
    (url) => {
      if (
        url?.startsWith("blob:") &&
        url !== editing?.imageUrl &&
        url !== editing?.thumbUrl &&
        url !== editing?.bgUrl
      ) {
        URL.revokeObjectURL(url);
      }
    },
    [editing]
  );

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(EMPTY());
    setErrors({});
    setShowForm(true);
  }, []);

  const openEdit = useCallback((b) => {
    setEditing(b);
    setForm({ ...b, file: undefined, thumbFile: undefined, bgFile: undefined });
    setErrors({});
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    discardDraftImage(form.imageUrl);
    discardDraftImage(form.thumbUrl);
    discardDraftImage(form.bgUrl);
    setShowForm(false);
  }, [discardDraftImage, form.imageUrl, form.thumbUrl, form.bgUrl]);

  const setField = useCallback(
    (key) => (e) => {
      const value = e.target.value;
      setForm((f) => {
        let next;
        if (key === "placement") {
          const first = Object.keys(getSectionsForPlacement(value))[0];
          next = { ...f, placement: value, section: first };
        } else if (key === "section") {
          next = { ...f, section: value };
        } else {
          next = { ...f, [key]: value };
        }
        // Drop the thumbnail if this placement/section no longer uses one
        if (
          !needsThumb(next.placement, next.section) &&
          (next.thumbUrl || next.thumbFile)
        ) {
          next = { ...next, thumbUrl: null, thumbName: "", thumbFile: undefined };
        }
        return next;
      });
    },
    []
  );

  /* ---- Upload to correct endpoint ---- */
  const uploadBanner = async (formData, placementKey, sectionKey) => {
    if (placementKey === "landing") {
      // POST /api/landingPage/:section
      const res = await api.post(`/landingPage/${sectionKey}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }
    // POST /api/mediaforpage/:nav/:part
    const res = await api.post(
      `/mediaforpage/${encodeURIComponent(placementKey)}/${sectionKey}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  };

  const handleSave = useCallback(async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    if (!form.file && !editing) {
      setErrors({ image: "Banner image or video is required for new banners." });
      return;
    }

    setSaving(true);
    try {
      // Backend only supports create/append via upload — always send FormData when file present
      if (form.file) {
        const fd = new FormData();
        fd.append("media", form.file);
        // Tab thumbnail — only for placements/sections that use it
        if (needsThumb(form.placement, form.section) && form.thumbFile) {
          fd.append("thumb", form.thumbFile);
        }
        // Optional background image
        if (form.bgFile) {
          fd.append("background", form.bgFile);
        }
        fd.append("title", form.title.trim());
        fd.append("brand", (form.brand || "").trim());
        fd.append("description", (form.subtitle || "").trim());
        fd.append("forMobile", String(form.device === "mobile"));
        fd.append("mediaType", form.mediaType || "image");
        // optional extras if backend later supports them
        fd.append("link", (form.link || "/").trim());
        fd.append("cta", (form.cta || "").trim());

        await uploadBanner(fd, form.placement, form.section);
      }

      // Refetch so UI matches server
      await loadBanners();
      discardDraftImage(form.imageUrl);
      discardDraftImage(form.thumbUrl);
      discardDraftImage(form.bgUrl);
      setShowForm(false);
    } catch (err) {
      setErrors({
        form: err?.response?.data?.message || err.message || "Upload failed",
      });
    } finally {
      setSaving(false);
    }
  }, [form, editing, loadBanners, discardDraftImage]);

  const toggleEnabled = useCallback((id) => {
    // Local only until backend supports PATCH
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  }, []);

  const duplicate = useCallback((b) => {
    setBanners((prev) => [
      {
        ...b,
        id: nextId(),
        title: `${b.title} (copy)`,
        enabled: false,
      },
      ...prev,
    ]);
  }, []);

  const move = useCallback((id, dir) => {
    setBanners((prev) => {
      const current = prev.find((b) => b.id === id);
      if (!current) return prev;
      const same = prev.filter((b) => groupKey(b) === groupKey(current));
      const idx = same.findIndex((b) => b.id === id);
      const other = same[idx + dir];
      if (!other) return prev;
      const next = [...prev];
      const a = prev.indexOf(current);
      const c = prev.indexOf(other);
      [next[a], next[c]] = [next[c], next[a]];
      return next;
    });
  }, []);

  const confirmDelete = useCallback(() => {
    // Local only until backend supports DELETE
    setBanners((prev) => prev.filter((b) => b.id !== deleting.id));
    setDeleting(null);
  }, [deleting]);

  const value = useMemo(
    () => ({
      banners,
      loading,
      loadError,
      saving,
      reload: loadBanners,
      query,
      setQuery,
      placement,
      setPlacement,
      section,
      setSection,
      deviceFilter,
      setDeviceFilter,
      showForm,
      editing,
      form,
      setForm,
      errors,
      setErrors,
      deleting,
      setDeleting,
      stats,
      positions,
      visible,
      discardDraftImage,
      openCreate,
      openEdit,
      closeForm,
      setField,
      handleSave,
      toggleEnabled,
      duplicate,
      move,
      confirmDelete,
    }),
    [
      banners,
      loading,
      loadError,
      saving,
      loadBanners,
      query,
      placement,
      section,
      deviceFilter,
      showForm,
      editing,
      form,
      errors,
      deleting,
      stats,
      positions,
      visible,
      discardDraftImage,
      openCreate,
      openEdit,
      closeForm,
      setField,
      handleSave,
      toggleEnabled,
      duplicate,
      move,
      confirmDelete,
    ]
  );

  return (
    <BannerContext.Provider value={value}>{children}</BannerContext.Provider>
  );
}

export function useBanners() {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanners must be used within BannerProvider");
  return ctx;
}