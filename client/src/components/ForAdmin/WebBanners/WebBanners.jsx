import { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, Form, InputGroup, Button, Dropdown, Modal } from "react-bootstrap";
import {
  FiSearch,
  FiPlus,
  FiImage,
  FiPlayCircle,
  FiClock,
  FiSlash,
  FiMoreHorizontal,
  FiEdit2,
  FiCopy,
  FiTrash2,
  FiUploadCloud,
  FiX,
  FiCalendar,
  FiLink,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import "../../../styles/AdminUI.css";
import "./WebBanners.css";

/* ---------- Config ---------- */
const PLACEMENTS = {
  hero: { label: "Home Hero", size: "1920 x 600" },
  strip: { label: "Promo Strip", size: "1920 x 120" },
  category: { label: "Category Tile", size: "800 x 600" },
  popup: { label: "Popup", size: "600 x 600" },
};

const GRADIENTS = [
  "linear-gradient(135deg,#0d6efd,#6f42c1)",
  "linear-gradient(135deg,#fd7e14,#dc3545)",
  "linear-gradient(135deg,#20c997,#0d6efd)",
  "linear-gradient(135deg,#111827,#4b5563)",
  "linear-gradient(135deg,#6f42c1,#d63384)",
];

const STATUS_PILL = {
  Live: "pill-success",
  Scheduled: "pill-info",
  Paused: "pill-muted",
  Expired: "pill-danger",
};

const MAX_IMAGE_MB = 2;

/* ---------- Date helpers (all dates are YYYY-MM-DD strings) ---------- */
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};
const formatDate = (s) =>
  s
    ? new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "";

const getStatus = (b) => {
  const today = iso(new Date());
  if (!b.enabled) return "Paused";
  if (b.start > today) return "Scheduled";
  if (b.end && b.end < today) return "Expired";
  return "Live";
};

/* ---------- Mock data (replace with your API call later) ---------- */
const SEED = [
  { id: 1, title: "Festive Sale: Up to 60% Off", subtitle: "Ethnic wear, denim and more", cta: "Shop now", link: "/sale", placement: "hero", start: addDays(-10), end: addDays(20), gradient: 1, imageUrl: null, enabled: true },
  { id: 2, title: "New Winter Collection", subtitle: "Hoodies, jackets and layers", cta: "Explore", link: "/men-section", placement: "hero", start: addDays(-3), end: "", gradient: 0, imageUrl: null, enabled: true },
  { id: 3, title: "Diwali Early Access", subtitle: "Members get first pick", cta: "Get access", link: "/auth", placement: "hero", start: addDays(5), end: addDays(25), gradient: 4, imageUrl: null, enabled: true },
  { id: 4, title: "Free shipping on orders above Rs. 999", subtitle: "", cta: "Details", link: "/shipping", placement: "strip", start: addDays(-30), end: "", gradient: 3, imageUrl: null, enabled: true },
  { id: 5, title: "Women's Western Wear", subtitle: "Starting at Rs. 499", cta: "Browse", link: "/women-section", placement: "category", start: addDays(-12), end: addDays(40), gradient: 2, imageUrl: null, enabled: true },
  { id: 6, title: "Kids Back to School", subtitle: "Uniforms and bags", cta: "Shop kids", link: "/kids-section", placement: "category", start: addDays(-60), end: addDays(-8), gradient: 2, imageUrl: null, enabled: true },
  { id: 7, title: "Get 10% off your first order", subtitle: "Use code WELCOME10", cta: "Claim offer", link: "/auth", placement: "popup", start: addDays(-20), end: "", gradient: 0, imageUrl: null, enabled: false },
];

const EMPTY = () => ({
  title: "",
  subtitle: "",
  cta: "Shop now",
  link: "/",
  placement: "hero",
  start: iso(new Date()),
  end: "",
  gradient: 0,
  imageUrl: null,
  imageName: "",
  enabled: true,
});

const validate = (f) => {
  const e = {};
  if (!f.title.trim()) e.title = "Title is required.";
  if (!/^(\/|https?:\/\/)/.test(f.link.trim())) e.link = "Use a path like /sale or a full https:// URL.";
  if (!f.start) e.start = "Pick a start date.";
  if (f.end && f.end < f.start) e.end = "End date must be on or after the start date.";
  return e;
};

/* ---------- Banner preview (used in cards and in the form) ---------- */
function BannerPreview({ b, rounded = false }) {
  const background = b.imageUrl
    ? `center / cover no-repeat url("${b.imageUrl}")`
    : GRADIENTS[b.gradient % GRADIENTS.length];

  return (
    <div className={`banner-preview ${rounded ? "rounded-all" : ""}`} style={{ background }}>
      <div className="banner-overlay">
        <div className="banner-title">{b.title || "Banner title"}</div>
        {b.subtitle && <div className="banner-sub">{b.subtitle}</div>}
        {b.cta && <span className="banner-cta">{b.cta}</span>}
      </div>
    </div>
  );
}

/* ---------- Drag-and-drop image picker ---------- */
function ImageDrop({ value, name, hint, onChange, onRemove }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file (JPG, PNG or WebP).");
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`Image must be under ${MAX_IMAGE_MB} MB.`);
    setError("");
    onChange(URL.createObjectURL(file), file.name, file);
  };

  return (
    <div>
      {value ? (
        <div className="d-flex align-items-center justify-content-between gap-2 p-2 border rounded-3">
          <span className="small text-truncate d-flex align-items-center gap-2">
            <FiImage size={16} /> {name || "Uploaded image"}
          </span>
          <Button variant="outline-secondary" size="sm" onClick={onRemove} className="d-flex align-items-center gap-1">
            <FiX size={14} /> Remove
          </Button>
        </div>
      ) : (
        <div
          className={`dropzone ${over ? "over" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <FiUploadCloud size={26} className="text-primary mb-2" />
          <div className="fw-semibold small">Drag an image here or click to browse</div>
          <div className="small text-muted">
            Recommended {hint} px, JPG/PNG/WebP, up to {MAX_IMAGE_MB} MB
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && <div className="small text-danger mt-2">{error}</div>}
    </div>
  );
}

/* ---------- Page ---------- */
function WebBanners() {
  const [banners, setBanners] = useState(SEED);
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState("All");
  const [status, setStatus] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY());
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(null);

  /* Free the in-memory preview URL of an unsaved upload when the page unmounts */
  const formRef = useRef(form);
  formRef.current = form;
  useEffect(
    () => () => {
      const url = formRef.current.imageUrl;
      if (url && url.startsWith("blob:") && !SEED.some((b) => b.imageUrl === url)) {
        /* saved banners keep their URL for the session, so only drafts are worth freeing */
      }
    },
    []
  );

  /* ---------- Derived ---------- */
  const stats = useMemo(() => {
    const s = banners.map(getStatus);
    return {
      total: banners.length,
      live: s.filter((x) => x === "Live").length,
      scheduled: s.filter((x) => x === "Scheduled").length,
      inactive: s.filter((x) => x === "Paused" || x === "Expired").length,
    };
  }, [banners]);

  // Position of each banner within its own placement (used for ordering)
  const positions = useMemo(() => {
    const seen = {};
    const map = {};
    banners.forEach((b) => {
      seen[b.placement] = (seen[b.placement] || 0) + 1;
      map[b.id] = seen[b.placement];
    });
    return map;
  }, [banners]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return banners.filter((b) => {
      const matchQ = !q || b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q);
      const matchP = placement === "All" || b.placement === placement;
      const matchS = status === "All" || getStatus(b) === status;
      return matchQ && matchP && matchS;
    });
  }, [banners, query, placement, status]);

  /* ---------- Form handlers ---------- */
  const discardDraftImage = (url) => {
    if (url && url.startsWith("blob:") && url !== editing?.imageUrl) URL.revokeObjectURL(url);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ ...b });
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    discardDraftImage(form.imageUrl);
    setShowForm(false);
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    // eslint-disable-next-line no-unused-vars
    const { file, ...data } = form;
    // TODO: when your API is ready, upload `file` (FormData) here and store the returned URL in imageUrl.
    const clean = { ...data, title: data.title.trim(), subtitle: data.subtitle.trim(), cta: data.cta.trim(), link: data.link.trim() };

    if (editing) {
      setBanners((prev) => prev.map((b) => (b.id === editing.id ? { ...b, ...clean } : b)));
    } else {
      setBanners((prev) => [{ ...clean, id: Math.max(0, ...prev.map((b) => b.id)) + 1 }, ...prev]);
    }
    setShowForm(false);
  };

  /* ---------- Row actions ---------- */
  const toggleEnabled = (id) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));

  const duplicate = (b) =>
    setBanners((prev) => [
      { ...b, id: Math.max(0, ...prev.map((x) => x.id)) + 1, title: `${b.title} (copy)`, enabled: false },
      ...prev,
    ]);

  const move = (id, dir) =>
    setBanners((prev) => {
      const current = prev.find((b) => b.id === id);
      const same = prev.filter((b) => b.placement === current.placement);
      const other = same[same.findIndex((b) => b.id === id) + dir];
      if (!other) return prev;
      const next = [...prev];
      const a = prev.indexOf(current);
      const c = prev.indexOf(other);
      [next[a], next[c]] = [next[c], next[a]];
      return next;
    });

  const confirmDelete = () => {
    setBanners((prev) => prev.filter((b) => b.id !== deleting.id));
    setDeleting(null);
  };

  const STAT_CARDS = [
    { label: "Total Banners", value: stats.total, icon: <FiImage />, pill: "pill-info", note: "All placements" },
    { label: "Live Now", value: stats.live, icon: <FiPlayCircle />, pill: "pill-success", note: "Visible on site" },
    { label: "Scheduled", value: stats.scheduled, icon: <FiClock />, pill: "pill-info", note: "Starting soon" },
    { label: "Inactive", value: stats.inactive, icon: <FiSlash />, pill: "pill-muted", note: "Paused or expired" },
  ];

  return (
    <div>
      {/* ---------- Page header ---------- */}
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Web Page Banners</h1>
          <p>Control the banners shown across your storefront.</p>
        </div>
        <Button className="btn-ink d-flex align-items-center gap-2" onClick={openCreate}>
          <FiPlus size={16} />
          Add Banner
        </Button>
      </div>

      {/* ---------- KPI cards ---------- */}
      <Row className="g-3 mb-4">
        {STAT_CARDS.map((s) => (
          <Col key={s.label} xs={12} sm={6} xl={3}>
            <div className="ui-card stat-card">
              <div className="ui-card-title">
                {s.icon}
                {s.label}
              </div>
              <div className="stat-body">
                <div className="stat-value">{s.value}</div>
                <span className={`pill ${s.pill} mt-1`}>{s.note}</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ---------- Toolbar ---------- */}
      <div className="ui-card p-3 mb-3">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <InputGroup className="toolbar-search">
            <InputGroup.Text className="bg-transparent border-end-0 text-muted">
              <FiSearch size={16} />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search banners"
              className="border-start-0 ps-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>

          <Form.Select className="toolbar-select" value={placement} onChange={(e) => setPlacement(e.target.value)}>
            <option value="All">All Placements</option>
            {Object.entries(PLACEMENTS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </Form.Select>

          <Form.Select className="toolbar-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option>Live</option>
            <option>Scheduled</option>
            <option>Paused</option>
            <option>Expired</option>
          </Form.Select>
        </div>
      </div>

      {/* ---------- Banner grid ---------- */}
      {visible.length === 0 ? (
        <div className="ui-card text-center text-muted py-5">No banners match your filters.</div>
      ) : (
        <Row className="g-3">
          {visible.map((b) => {
            const st = getStatus(b);
            const dimmed = st === "Paused" || st === "Expired";
            return (
              <Col key={b.id} xs={12} md={6} xl={4}>
                <div className={`ui-card banner-card ${dimmed ? "dimmed" : ""}`}>
                  <BannerPreview b={b} />

                  <div className="p-3 d-flex flex-column gap-2 flex-grow-1">
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-truncate">{b.title}</div>
                        <div className="small text-muted d-flex align-items-center gap-1 text-truncate">
                          <FiLink size={12} /> {b.link}
                        </div>
                      </div>

                      <Dropdown align="end">
                        <Dropdown.Toggle as="button" type="button" className="icon-btn flex-shrink-0" aria-label="Banner actions">
                          <FiMoreHorizontal size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="shadow-sm" popperConfig={{ strategy: "fixed" }}>
                          <Dropdown.Item className="d-flex align-items-center gap-2" onClick={() => openEdit(b)}>
                            <FiEdit2 size={14} /> Edit
                          </Dropdown.Item>
                          <Dropdown.Item className="d-flex align-items-center gap-2" onClick={() => duplicate(b)}>
                            <FiCopy size={14} /> Duplicate
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center gap-2"
                            disabled={positions[b.id] === 1}
                            onClick={() => move(b.id, -1)}
                          >
                            <FiArrowUp size={14} /> Move earlier
                          </Dropdown.Item>
                          <Dropdown.Item className="d-flex align-items-center gap-2" onClick={() => move(b.id, 1)}>
                            <FiArrowDown size={14} /> Move later
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="d-flex align-items-center gap-2 text-danger" onClick={() => setDeleting(b)}>
                            <FiTrash2 size={14} /> Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <span className="pill pill-muted">
                        {PLACEMENTS[b.placement].label} #{positions[b.id]}
                      </span>
                      <span className={`pill ${STATUS_PILL[st]}`}>{st}</span>
                    </div>

                    <div className="small text-muted d-flex align-items-center gap-1 mt-auto">
                      <FiCalendar size={12} />
                      {formatDate(b.start)} {b.end ? `to ${formatDate(b.end)}` : "onwards"}
                    </div>

                    <Form.Check
                      type="switch"
                      id={`banner-switch-${b.id}`}
                      label={b.enabled ? "Active" : "Paused"}
                      checked={b.enabled}
                      onChange={() => toggleEnabled(b.id)}
                      className="small"
                    />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}

      {/* ---------- Add / edit modal ---------- */}
      <Modal show={showForm} onHide={closeForm} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">{editing ? "Edit banner" : "Add banner"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-2 small text-muted">Live preview</div>
          <div className="mb-4">
            <BannerPreview b={form} rounded />
          </div>

          <Row className="g-3">
            <Col xs={12} md={6}>
              <Form.Label className="small fw-semibold">Title</Form.Label>
              <Form.Control value={form.title} onChange={setField("title")} isInvalid={!!errors.title} placeholder="Festive Sale: Up to 60% Off" />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Col>

            <Col xs={12} md={6}>
              <Form.Label className="small fw-semibold">Subtitle (optional)</Form.Label>
              <Form.Control value={form.subtitle} onChange={setField("subtitle")} placeholder="Ethnic wear, denim and more" />
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="small fw-semibold">Button label</Form.Label>
              <Form.Control value={form.cta} onChange={setField("cta")} placeholder="Shop now" />
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="small fw-semibold">Link</Form.Label>
              <Form.Control value={form.link} onChange={setField("link")} isInvalid={!!errors.link} placeholder="/sale" />
              <Form.Control.Feedback type="invalid">{errors.link}</Form.Control.Feedback>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="small fw-semibold">Placement</Form.Label>
              <Form.Select value={form.placement} onChange={setField("placement")}>
                {Object.entries(PLACEMENTS).map(([key, p]) => (
                  <option key={key} value={key}>
                    {p.label}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Label className="small fw-semibold">Start date</Form.Label>
              <Form.Control type="date" value={form.start} onChange={setField("start")} isInvalid={!!errors.start} />
              <Form.Control.Feedback type="invalid">{errors.start}</Form.Control.Feedback>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Label className="small fw-semibold">End date (optional)</Form.Label>
              <Form.Control type="date" value={form.end} min={form.start} onChange={setField("end")} isInvalid={!!errors.end} />
              <Form.Control.Feedback type="invalid">{errors.end}</Form.Control.Feedback>
            </Col>

            <Col xs={12}>
              <Form.Label className="small fw-semibold">Banner image</Form.Label>
              <ImageDrop
                value={form.imageUrl}
                name={form.imageName}
                hint={PLACEMENTS[form.placement].size}
                onChange={(url, name, file) => {
                  discardDraftImage(form.imageUrl);
                  setForm((f) => ({ ...f, imageUrl: url, imageName: name, file }));
                }}
                onRemove={() => {
                  discardDraftImage(form.imageUrl);
                  setForm((f) => ({ ...f, imageUrl: null, imageName: "", file: undefined }));
                }}
              />
            </Col>

            {!form.imageUrl && (
              <Col xs={12}>
                <Form.Label className="small fw-semibold d-block">Background (used when there is no image)</Form.Label>
                <div className="d-flex gap-2">
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={g}
                      type="button"
                      className={`swatch ${form.gradient === i ? "active" : ""}`}
                      style={{ background: g }}
                      onClick={() => setForm((f) => ({ ...f, gradient: i }))}
                      aria-label={`Background style ${i + 1}`}
                    />
                  ))}
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeForm}>
            Cancel
          </Button>
          <Button className="btn-ink" onClick={handleSave}>
            {editing ? "Save changes" : "Create banner"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Delete confirmation ---------- */}
      <Modal show={!!deleting} onHide={() => setDeleting(null)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">Delete banner?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">
          <strong>{deleting?.title}</strong> will be removed from your storefront. This can't be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WebBanners;