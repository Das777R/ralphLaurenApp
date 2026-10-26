import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emptyForm, QUOTA, MAX_BATCH } from "./constants";
import { checkFile, parseSizes, revokeItemUrls, normalizeProduct } from "./utils";
import api from "../../api/api.js";

const ProductMediaContext = createContext(null);

const getErrMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

const isCanceled = (err) =>
  err?.code === "ERR_CANCELED" || err?.name === "CanceledError";

export function ProductMediaProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);

  const [previewId, setPreviewId] = useState(null);
  const [confirmIds, setConfirmIds] = useState(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [lookFile, setLookFile] = useState(null);
  const [colorFile, setColorFile] = useState(null);
  const [slideQueue, setSlideQueue] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  /* ---------- Load ---------- */
  const loadItems = useCallback(async (signal) => {
    try {
      setLoadError("");
      const res = await api.get("/product", { signal });
      
      const list = res.data?.data || [];
      setItems(list.map(normalizeProduct));
    } catch (err) {
      if (!isCanceled(err)) {
        setLoadError(getErrMessage(err, "Could not load products."));
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadItems(controller.signal);
    return () => controller.abort();
  }, [loadItems]);

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const total = items.length;
    const trending = items.filter((i) => i.isTrending).length;
    const kinds = new Set(items.map((i) => i.kind).filter(Boolean)).size;

    const productKeys = new Set(
      items.map(
        (i) =>
          `${(i.category || "").toLowerCase()}|${(i.kind || "").toLowerCase()}|${(
            i.productName || ""
          ).toLowerCase()}`
      )
    );

    let units = 0;
    let stockValue = 0;
    let lowStock = 0;

    items.forEach((i) => {
      const price = Number(i.price) || 0;
      let itemUnits = 0;

      if (typeof i.stock === "number") {
        itemUnits = i.stock;
      } else if (i.stock && typeof i.stock === "object") {
        itemUnits = Object.values(i.stock).reduce(
          (sum, v) => sum + (Number(v) || 0),
          0
        );
      }

      units += itemUnits;
      stockValue += itemUnits * price;
      if (itemUnits > 0 && itemUnits < 5) lowStock += 1;
    });

    return {
      total,
      products: productKeys.size,
      trending,
      kinds,
      units,
      stockValue,
      lowStock,
      bytes: items.reduce((s, i) => s + (i.bytes || 0), 0),
    };
  }, [items]);

  /* ---------- Filter options for toolbar ---------- */
  const kindOptions = useMemo(() => {
    const map = new Map();
    items.forEach((i) => {
      const k = i.kind || "—";
      map.set(k, (map.get(k) || 0) + 1);
    });
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const categoryOptions = useMemo(() => {
    const map = new Map();
    items.forEach((i) => {
      const c = i.category || "—";
      map.set(c, (map.get(c) || 0) + 1);
    });
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  /* ---------- Filtered list ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cat = categoryFilter.trim().toLowerCase();

    const list = items.filter((i) => {
      const matchQ =
        !q ||
        i.productName?.toLowerCase().includes(q) ||
        i.colorName?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q) ||
        i.kind?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q);

      const matchK = kindFilter === "All" || i.kind === kindFilter;
      const matchC = !cat || i.category?.toLowerCase().includes(cat);

      return matchQ && matchK && matchC;
    });

    const sorters = {
      newest: (a, b) =>
        (b.uploaded || 0) - (a.uploaded || 0) ||
        String(b.id).localeCompare(String(a.id)),
      name: (a, b) =>
        (a.productName || "").localeCompare(b.productName || ""),
      priceHigh: (a, b) => (b.price || 0) - (a.price || 0),
    };

    return [...list].sort(sorters[sort] || sorters.newest);
  }, [items, query, kindFilter, categoryFilter, sort]);

  const allSelected =
    filtered.length > 0 && filtered.every((i) => selected.has(i.id));
  const previewItem = filtered.find((i) => i.id === previewId) || null;
  const validSlides = slideQueue.filter((q) => !q.error);

  /* ---------- Selection ---------- */
  const toggleOne = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((i) =>
        allSelected ? next.delete(i.id) : next.add(i.id)
      );
      return next;
    });

  const clearSelection = () => setSelected(new Set());

  /* ---------- Delete ---------- */
  const removeItems = async (ids) => {
    setActionError("");
    const results = await Promise.allSettled(
      ids.map(async (id) => {
        await api.delete(`/product/remove/${id}`);
        return id;
      })
    );

    const okIds = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
    const failed = results.filter((r) => r.status === "rejected");

    itemsRef.current
      .filter((i) => okIds.includes(i.id))
      .forEach(revokeItemUrls);

    setItems((prev) => prev.filter((i) => !okIds.includes(i.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      okIds.forEach((id) => next.delete(id));
      return next;
    });

    if (failed.length) {
      setActionError(
        `${failed.length} product(s) could not be deleted: ${getErrMessage(
          failed[0].reason,
          "Request failed"
        )}`
      );
    }
    setConfirmIds(null);
  };

  /* ---------- Upload helpers ---------- */
  const revokeDrafts = () => {
    [lookFile?.url, colorFile?.url, ...slideQueue.map((q) => q.url)].forEach(
      (u) => {
        if (u?.startsWith("blob:")) URL.revokeObjectURL(u);
      }
    );
  };

  const openUpload = () => {
    revokeDrafts();
    setForm(emptyForm());
    setLookFile(null);
    setColorFile(null);
    setSlideQueue([]);
    setUploadError("");
    setUploadOpen(true);
  };

  const setField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const pickSingle = (file, setter, { imagesOnly = true } = {}) => {
    if (!file) return;
    const error = checkFile(file, { imagesOnly });
    const url = error ? null : URL.createObjectURL(file);
    setter({ file, url, error });
  };

  const addSlides = (fileList) => {
    const incoming = Array.from(fileList || []);
    const room = Math.max(MAX_BATCH - slideQueue.length, 0);
    const added = incoming.slice(0, room).map((file) => {
      const error = checkFile(file);
      return {
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        file,
        url: error ? null : URL.createObjectURL(file),
        error,
      };
    });
    if (incoming.length > room) {
      setUploadError(`Only ${MAX_BATCH} slide files per upload.`);
    } else {
      setUploadError("");
    }
    setSlideQueue((prev) => [...prev, ...added]);
  };

  const removeSlide = (key) => {
    setSlideQueue((prev) => {
      const target = prev.find((x) => x.key === key);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((x) => x.key !== key);
    });
  };

  const isNewVariant = useMemo(() => {
    const norm = (s) => (s || "").trim().toLowerCase();
    return !items.some(
      (i) =>
        norm(i.category) === norm(form.category) &&
        norm(i.kind) === norm(form.kind) &&
        norm(i.productName) === norm(form.productName) &&
        norm(i.colorName) === norm(form.colorName)
    );
  }, [items, form.category, form.kind, form.productName, form.colorName]);

  /* ---------- Upload ---------- */
  const handleUpload = async () => {
    if (uploading) return;
    if (!form.productName.trim())
      return setUploadError("Product name is required.");
    if (!form.kind) return setUploadError("Choose a kind.");
    if (!form.category.trim())
      return setUploadError("Category is required.");
    if (!form.colorName.trim())
      return setUploadError("Color name is required.");

    const sizes = parseSizes(form.sizesText);
    if (!sizes.length)
      return setUploadError("Enter at least one size (e.g. s, m, l).");
    if (!lookFile || lookFile.error)
      return setUploadError("Add a valid look image.");
    if (!validSlides.length)
      return setUploadError("Add at least one slide image/video.");
    if (isNewVariant && (!colorFile || colorFile.error)) {
      return setUploadError(
        "A color image is required for a new product color."
      );
    }

    const bytes =
      (lookFile.file?.size || 0) +
      (colorFile?.file?.size || 0) +
      validSlides.reduce((s, q) => s + q.file.size, 0);

    if (stats.bytes + bytes > QUOTA)
      return setUploadError("Not enough storage left.");

    const fd = new FormData();
    fd.append("productName", form.productName.trim());
    fd.append("brand", form.brand.trim() || "Polo Ralph Lauren");
    fd.append("kind", form.kind);
    fd.append("category", form.category.trim());
    fd.append("colorName", form.colorName.trim());
    fd.append("price", String(Number(form.price) || 0));
    fd.append("description", form.description.trim());
    fd.append("trending", String(!!form.isTrending));
    fd.append("sizesAvailable", JSON.stringify(sizes));
    fd.append("lookImage", lookFile.file);
    if (colorFile?.file && !colorFile.error) {
      fd.append("colorImage", colorFile.file);
    }
    validSlides.forEach((q) => fd.append("slideImage", q.file));

    try {
      setUploading(true);
      setUploadError("");
 
      await api.post("/product/upload", fd);
  
      revokeDrafts();
      await loadItems();
      setUploadOpen(false);
    } catch (err) {
      setUploadError(getErrMessage(err, "Upload failed."));
    } finally {
      setUploading(false);
    }
  };

  const value = {
    items,
    filtered,
    stats,
    kindOptions,
    categoryOptions,
    loading,
    loadError,
    reload: () => loadItems(),
    actionError,
    setActionError,
    query,
    setQuery,
    kindFilter,
    setKindFilter,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,
    view,
    setView,
    selected,
    allSelected,
    toggleOne,
    toggleAll,
    clearSelection,
    hoveredId,
    setHoveredId,
    previewId,
    setPreviewId,
    previewItem,
    confirmIds,
    setConfirmIds,
    removeItems,
    uploadOpen,
    setUploadOpen,
    uploading,
    openUpload,
    form,
    setField,
    lookFile,
    setLookFile,
    colorFile,
    setColorFile,
    isNewVariant,
    slideQueue,
    uploadError,
    setUploadError,
    dragOver,
    setDragOver,
    pickSingle,
    addSlides,
    removeSlide,
    validSlides,
    handleUpload,
  };

  return (
    <ProductMediaContext.Provider value={value}>
      {children}
    </ProductMediaContext.Provider>
  );
}

export function useProductMedia() {
  const ctx = useContext(ProductMediaContext);
  if (!ctx) {
    throw new Error(
      "useProductMedia must be used inside ProductMediaProvider"
    );
  }
  return ctx;
}