import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Table,
  Dropdown,
  Pagination,
  Spinner,
} from "react-bootstrap";
import {
  FiSearch,
  FiPlus,
  FiUpload,
  FiBox,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiMoreHorizontal,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../../api/api.js"; // adjust path
import "../../../styles/AdminUI.css";

/* ---------- Helpers ---------- */
const TILE_COLORS = [
  "#0d6efd",
  "#198754",
  "#6f42c1",
  "#fd7e14",
  "#dc3545",
  "#0dcaf0",
];

const STATUS_PILL = {
  Active: "pill-success",
  "Low Stock": "pill-warning",
  "Out of Stock": "pill-danger",
};

const PAGE_SIZE = 8;

const getStatus = (stock) => {
  const n = Number(stock);
  if (!Number.isFinite(n) || n <= 0) return "Out of Stock";
  if (n <= 10) return "Low Stock";
  return "Active";
};

const inr = (n) =>
  `₹ ${Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const colorFromId = (id) => {
  const s = String(id || "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash + s.charCodeAt(i) * 17) % 97;
  return TILE_COLORS[hash % TILE_COLORS.length];
};

const toAbsolute = (path) => {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  return path.startsWith("/") ? path : `/${path}`;
};

/** Mongo product → table row */
const normalizeProduct = (p) => {
  const stock = Number(p.stock);
  return {
    id: String(p._id),
    sku: String(p._id).slice(-6).toUpperCase(),
    name: p.productName || "Untitled",
    brand: p.brand || "",
    category: p.category || "—",
    kind: p.kind || "",
    colorName: p.colorName || "",
    price: Number(p.price) || 0,
    stock: Number.isFinite(stock) ? stock : 0,
    sizes: Array.isArray(p.sizesAvailable) ? p.sizesAvailable : [],
    lookImage: toAbsolute(p.lookImage),
    colorImage: toAbsolute(p.colorImage),
    trending: !!p.trending,
    createdAt: p.createdAt ? new Date(p.createdAt) : null,
    color: colorFromId(p._id),
    _raw: p,
  };
};

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());

  /* ---------- Load ---------- */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/product");
      const list = res.data?.data || [];
      setProducts(list.map(normalizeProduct));
    } catch (err) {
      setLoadError(
        err?.response?.data?.message ||
          err.message ||
          "Could not load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* ---------- Category options from data ---------- */
  const categoryOptions = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [products]);


  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const out = products.filter((p) => getStatus(p.stock) === "Out of Stock")
      .length;
    const low = products.filter((p) => getStatus(p.stock) === "Low Stock")
      .length;
    return {
      total: products.length,
      active: products.length - out - low,
      low,
      out,
    };
  }, [products]);

  /* ---------- Filter + sort ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.colorName.toLowerCase().includes(q) ||
        p.kind.toLowerCase().includes(q);
      const matchC = category === "All" || p.category === category;
      const matchS = status === "All" || getStatus(p.stock) === status;
      return matchQ && matchC && matchS;
    });

    const sorters = {
      newest: (a, b) =>
        (b.createdAt || 0) - (a.createdAt || 0) ||
        String(b.id).localeCompare(String(a.id)),
      priceLow: (a, b) => a.price - b.price,
      priceHigh: (a, b) => b.price - a.price,
      stockLow: (a, b) => a.stock - b.stock,
    };
    return [...list].sort(sorters[sort] || sorters.newest);
  }, [products, query, category, status, sort]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const resetPage = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  /* ---------- Selection ---------- */
  const allOnPageSelected =
    rows.length > 0 && rows.every((r) => selected.has(r.id));

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllOnPage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      rows.forEach((r) =>
        allOnPageSelected ? next.delete(r.id) : next.add(r.id)
      );
      return next;
    });

  /* ---------- Delete ---------- */
  const deleteOne = async (id) => {
    setActionError("");
    try {
      await api.delete(`/product/remove/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      setActionError(
        err?.response?.data?.message || err.message || "Delete failed."
      );
    }
  };

  const deleteSelected = async () => {
    setActionError("");
    const ids = [...selected];
    const results = await Promise.allSettled(
      ids.map((id) => api.delete(`/product/remove/${id}`))
    );
    const ok = results
      .map((r, i) => (r.status === "fulfilled" ? ids[i] : null))
      .filter(Boolean);
    const failed = results.length - ok.length;

    setProducts((prev) => prev.filter((p) => !ok.includes(p.id)));
    setSelected(new Set());
    if (failed) {
      setActionError(`${failed} product(s) could not be deleted.`);
    }
  };

  const STAT_CARDS = [
    {
      label: "Total Products",
      value: stats.total,
      icon: <FiBox />,
      pill: "pill-info",
      note: "All variants",
    },
    {
      label: "Active",
      value: stats.active,
      icon: <FiCheckCircle />,
      pill: "pill-success",
      note: "In stock",
    },
    {
      label: "Low Stock",
      value: stats.low,
      icon: <FiAlertTriangle />,
      pill: "pill-warning",
      note: "10 or fewer",
    },
    {
      label: "Out of Stock",
      value: stats.out,
      icon: <FiXCircle />,
      pill: "pill-danger",
      note: "Restock needed",
    },
  ];

  return (
    <div>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Products</h1>
          <p>Manage your catalog, prices and stock levels.</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2"
            onClick={loadProducts}
            disabled={loading}
          >
            <FiRefreshCw size={16} />
            <span className="d-none d-sm-inline">Refresh</span>
          </Button>
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2"
          >
            <FiUpload size={16} />
            <span className="d-none d-sm-inline">Export</span>
          </Button>
          <Button className="btn-ink d-flex align-items-center gap-2">
            <FiPlus size={16} />
            Add Product
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center mb-3">
          <span>{loadError}</span>
          <Button variant="outline-danger" size="sm" onClick={loadProducts}>
            Retry
          </Button>
        </div>
      )}
      {actionError && (
        <div className="alert alert-warning small mb-3">{actionError}</div>
      )}

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

      <div className="ui-card">
        <div className="d-flex flex-wrap align-items-center gap-2 p-3 border-bottom">
          <InputGroup className="toolbar-search">
            <InputGroup.Text className="bg-transparent border-end-0 text-muted">
              <FiSearch size={16} />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search name, brand, color, SKU…"
              className="border-start-0 ps-0"
              value={query}
              onChange={resetPage(setQuery)}
            />
          </InputGroup>

          <Form.Select
            className="toolbar-select"
            value={category}
            onChange={resetPage(setCategory)}
          >
            <option value="All">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            className="toolbar-select"
            value={status}
            onChange={resetPage(setStatus)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </Form.Select>

          <Form.Select
            className="toolbar-select ms-sm-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="stockLow">Stock: Low to High</option>
          </Form.Select>
        </div>

        {selected.size > 0 && (
          <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-primary bg-opacity-10 border-bottom">
            <span className="small fw-semibold">{selected.size} selected</span>
            <Button variant="outline-danger" size="sm" onClick={deleteSelected}>
              <FiTrash2 size={14} className="me-1" /> Delete selected
            </Button>
          </div>
        )}

        <div className="table-responsive">
          {loading ? (
            <div className="text-center text-muted py-5">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading products…
            </div>
          ) : (
            <Table hover className="ui-table" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <Form.Check
                      checked={allOnPageSelected}
                      onChange={toggleAllOnPage}
                      aria-label="Select all on this page"
                    />
                  </th>
                  <th>Product</th>
                  <th className="d-none d-md-table-cell">Category</th>
                  <th>Price</th>
                  <th className="d-none d-sm-table-cell">Stock</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      No products match your filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => {
                    const st = getStatus(p.stock);
                    return (
                      <tr key={p.id}>
                        <td>
                          <Form.Check
                            checked={selected.has(p.id)}
                            onChange={() => toggleRow(p.id)}
                            aria-label={`Select ${p.name}`}
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {p.lookImage ? (
                              <img
                                src={p.lookImage}
                                alt=""
                                className="thumb"
                                style={{
                                  objectFit: "cover",
                                  width: 40,
                                  height: 40,
                                  borderRadius: 8,
                                }}
                              />
                            ) : (
                              <div
                                className="thumb"
                                style={{ background: p.color }}
                              >
                                {p.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">{p.name}</div>
                              <div className="small text-muted">
                                {p.colorName
                                  ? `${p.colorName} · `
                                  : ""}
                                {p.kind || p.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          {p.category}
                        </td>
                        <td className="fw-semibold">{inr(p.price)}</td>
                        <td className="d-none d-sm-table-cell">
                          {p.stock} units
                        </td>
                        <td>
                          <span className={`pill ${STATUS_PILL[st]}`}>
                            {st}
                          </span>
                        </td>
                        <td className="text-end">
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              as="button"
                              type="button"
                              className="icon-btn"
                              aria-label="Row actions"
                            >
                              <FiMoreHorizontal size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              className="shadow-sm"
                              popperConfig={{ strategy: "fixed" }}
                            >
                              <Dropdown.Item className="d-flex align-items-center gap-2">
                                <FiEye size={14} /> View
                              </Dropdown.Item>
                              <Dropdown.Item className="d-flex align-items-center gap-2">
                                <FiEdit2 size={14} /> Edit
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2 text-danger"
                                onClick={() => deleteOne(p.id)}
                              >
                                <FiTrash2 size={14} /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          )}
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 border-top">
          <span className="small text-muted">
            {filtered.length === 0
              ? "0 results"
              : `Showing ${start + 1}–${Math.min(
                  start + PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length}`}
          </span>

          <Pagination className="mb-0" size="sm">
            <Pagination.Prev
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Pagination.Item
                key={n}
                active={n === safePage}
                onClick={() => setPage(n)}
              >
                {n}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={safePage === totalPages}
              onClick={() => setPage(safePage + 1)}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Products;