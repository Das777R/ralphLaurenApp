import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { emptyForm, SEED, QUOTA, MAX_BATCH } from "./constants";
import { checkFile, parseSizes, revokeItemUrls } from "./utils";

const ProductMediaContext = createContext(null);

export function ProductMediaProvider({ children }) {
  const [items, setItems] = useState(SEED);
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
  const [form, setForm] = useState(emptyForm());
  const [lookFile, setLookFile] = useState(null);
  const [colorFile, setColorFile] = useState(null);
  const [slideQueue, setSlideQueue] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const nextId = useRef(SEED.length + 1);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(
    () => () => {
      itemsRef.current.forEach(revokeItemUrls);
    },
    []
  );

  const stats = useMemo(
    () => ({
      total: items.length,
      trending: items.filter((i) => i.isTrending).length,
      kinds: new Set(items.map((i) => i.kind)).size,
      bytes: items.reduce((s, i) => s + (i.bytes || 0), 0),
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cat = categoryFilter.trim().toLowerCase();
    const list = items.filter((i) => {
      const matchQ =
        !q ||
        i.productName.toLowerCase().includes(q) ||
        i.colorName?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q) ||
        i.kind?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q);
      const matchK = kindFilter === "All" || i.kind === kindFilter;
      const matchC = !cat || i.category?.toLowerCase().includes(cat);
      return matchQ && matchK && matchC;
    });
    const sorters = {
      newest: (a, b) => b.uploaded - a.uploaded || b.id - a.id,
      name: (a, b) => a.productName.localeCompare(b.productName),
      priceHigh: (a, b) => (b.price || 0) - (a.price || 0),
    };
    return [...list].sort(sorters[sort]);
  }, [items, query, kindFilter, categoryFilter, sort]);

  const allSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));
  const previewItem = filtered.find((i) => i.id === previewId) || null;
  const validSlides = slideQueue.filter((q) => !q.error);

  const toggleOne = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((i) => (allSelected ? next.delete(i.id) : next.add(i.id)));
      return next;
    });

  const clearSelection = () => setSelected(new Set());

  const removeItems = (ids) => {
    const gone = new Set(ids);
    itemsRef.current.filter((i) => gone.has(i.id)).forEach(revokeItemUrls);
    setItems((prev) => prev.filter((i) => !gone.has(i.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setConfirmIds(null);
  };

  const openUpload = () => {
    setForm(emptyForm());
    setLookFile(null);
    setColorFile(null);
    setSlideQueue([]);
    setUploadError("");
    setUploadOpen(true);
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

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
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url: error ? null : URL.createObjectURL(file),
        error,
      };
    });
    if (incoming.length > room) setUploadError(`Only ${MAX_BATCH} slide files per upload.`);
    else setUploadError("");
    setSlideQueue((prev) => [...prev, ...added]);
  };

  const removeSlide = (key) => {
    setSlideQueue((prev) => {
      const target = prev.find((x) => x.key === key);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((x) => x.key !== key);
    });
  };

  const handleUpload = () => {
    if (!form.productName.trim()) return setUploadError("Product name is required.");
    if (!form.kind) return setUploadError("Choose a kind.");
    if (!form.category.trim()) return setUploadError("Category is required.");
    if (!form.colorName.trim()) return setUploadError("Color name is required.");
    const sizes = parseSizes(form.sizesText);
    if (!sizes.length) return setUploadError("Enter at least one size (e.g. s, m, l).");
    if (!lookFile || lookFile.error) return setUploadError("Add a valid look image.");
    if (!validSlides.length) return setUploadError("Add at least one slide image/video.");

    const bytes =
      (lookFile.file?.size || 0) +
      (colorFile?.file?.size || 0) +
      validSlides.reduce((s, q) => s + q.file.size, 0);
    if (stats.bytes + bytes > QUOTA) return setUploadError("Not enough storage left.");

    // TODO: FormData → API; replace blob URLs with server paths
    const created = {
      id: nextId.current++,
      productName: form.productName.trim(),
      brand: form.brand.trim() || "Studio",
      price: Number(form.price) || 0,
      description: form.description.trim(),
      isTrending: !!form.isTrending,
      kind: form.kind,
      category: form.category.trim(),
      colorName: form.colorName.trim(),
      colorImage: colorFile?.url || null,
      colorFallback: "linear-gradient(135deg,#9ca3af,#4b5563)",
      sizes,
      lookImage: lookFile.url,
      slideImage: validSlides.map((q) => q.url),
      lookFallback: "linear-gradient(135deg,#64748b,#1e293b)",
      uploaded: new Date(),
      bytes,
    };

    setItems((prev) => [created, ...prev]);
    setUploadOpen(false);
  };

  const value = {
    items,
    filtered,
    stats,
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
    openUpload,
    form,
    setField,
    lookFile,
    setLookFile,
    colorFile,
    setColorFile,
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
    <ProductMediaContext.Provider value={value}>{children}</ProductMediaContext.Provider>
  );
}

export function useProductMedia() {
  const ctx = useContext(ProductMediaContext);
  if (!ctx) throw new Error("useProductMedia must be used inside ProductMediaProvider");
  return ctx;
}