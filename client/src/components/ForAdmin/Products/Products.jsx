import { useMemo, useState } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Table,
  Dropdown,
  Pagination,
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
} from "react-icons/fi";
import "../../../styles/AdminUI.css";

/* ---------- Mock data (replace with your API call later) ---------- */
const CATEGORIES = ["T-Shirts", "Hoodies", "Jackets", "Pants", "Accessories"];
const NAMES = [
  "Slim Fit Polo",
  "Classic Hoodie",
  "Denim Jacket",
  "Chino Pants",
  "Leather Belt",
  "Graphic Tee",
  "Bomber Jacket",
  "Cargo Pants",
];
const TILE_COLORS = ["#0d6efd", "#198754", "#6f42c1", "#fd7e14", "#dc3545", "#0dcaf0"];

const getStatus = (stock) =>
  stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "Active";

const STATUS_PILL = {
  Active: "pill-success",
  "Low Stock": "pill-warning",
  "Out of Stock": "pill-danger",
};

const SEED = Array.from({ length: 24 }, (_, i) => {
  const stock = i % 7 === 0 ? 0 : i % 5 === 0 ? 6 : (i * 37) % 150 + 11;
  return {
    id: i + 1,
    sku: `ES-${String(1001 + i)}`,
    name: `${NAMES[i % NAMES.length]}${i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : ""}`,
    category: CATEGORIES[i % CATEGORIES.length],
    price: 19 + ((i * 13) % 90),
    stock,
    color: TILE_COLORS[i % TILE_COLORS.length],
  };
});

const PAGE_SIZE = 8;

function Products() {
  const [products, setProducts] = useState(SEED);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const out = products.filter((p) => p.stock === 0).length;
    const low = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
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
    let list = products.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchC = category === "All" || p.category === category;
      const matchS = status === "All" || getStatus(p.stock) === status;
      return matchQ && matchC && matchS;
    });

    const sorters = {
      newest: (a, b) => b.id - a.id,
      priceLow: (a, b) => a.price - b.price,
      priceHigh: (a, b) => b.price - a.price,
      stockLow: (a, b) => a.stock - b.stock,
    };
    return [...list].sort(sorters[sort]);
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
  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllOnPage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      rows.forEach((r) => (allOnPageSelected ? next.delete(r.id) : next.add(r.id)));
      return next;
    });

  /* ---------- Delete ---------- */
  const deleteOne = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const deleteSelected = () => {
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  };

  const STAT_CARDS = [
    { label: "Total Products", value: stats.total, icon: <FiBox />, pill: "pill-info", note: "All items" },
    { label: "Active", value: stats.active, icon: <FiCheckCircle />, pill: "pill-success", note: "In stock" },
    { label: "Low Stock", value: stats.low, icon: <FiAlertTriangle />, pill: "pill-warning", note: "10 or fewer" },
    { label: "Out of Stock", value: stats.out, icon: <FiXCircle />, pill: "pill-danger", note: "Restock needed" },
  ];

  return (
    <div>
      {/* ---------- Page header ---------- */}
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Products</h1>
          <p>Manage your catalog, prices and stock levels.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
            <FiUpload size={16} />
            <span className="d-none d-sm-inline">Export</span>
          </Button>
          <Button className="btn-ink d-flex align-items-center gap-2">
            <FiPlus size={16} />
            Add Product
          </Button>
        </div>
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

      {/* ---------- Table card ---------- */}
      <div className="ui-card">
        {/* Toolbar */}
        <div className="d-flex flex-wrap align-items-center gap-2 p-3 border-bottom">
          <InputGroup className="toolbar-search">
            <InputGroup.Text className="bg-transparent border-end-0 text-muted">
              <FiSearch size={16} />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search name or SKU"
              className="border-start-0 ps-0"
              value={query}
              onChange={resetPage(setQuery)}
            />
          </InputGroup>

          <Form.Select className="toolbar-select" value={category} onChange={resetPage(setCategory)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Form.Select>

          <Form.Select className="toolbar-select" value={status} onChange={resetPage(setStatus)}>
            <option value="All">All Status</option>
            <option>Active</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </Form.Select>

          <Form.Select className="toolbar-select ms-sm-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="stockLow">Stock: Low to High</option>
          </Form.Select>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-primary bg-opacity-10 border-bottom">
            <span className="small fw-semibold">{selected.size} selected</span>
            <Button variant="outline-danger" size="sm" onClick={deleteSelected}>
              <FiTrash2 size={14} className="me-1" /> Delete selected
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="table-responsive">
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
                          <div className="thumb" style={{ background: p.color }}>
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-semibold">{p.name}</div>
                            <div className="small text-muted">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="d-none d-md-table-cell">{p.category}</td>
                      <td className="fw-semibold">${p.price.toFixed(2)}</td>
                      <td className="d-none d-sm-table-cell">{p.stock} units</td>
                      <td>
                        <span className={`pill ${STATUS_PILL[st]}`}>{st}</span>
                      </td>
                      <td className="text-end">
                        <Dropdown align="end">
                          <Dropdown.Toggle as="button" type="button" className="icon-btn" aria-label="Row actions">
                            <FiMoreHorizontal size={16} />
                          </Dropdown.Toggle>
                          {/* fixed strategy stops the menu being clipped by the scrolling table */}
                          <Dropdown.Menu className="shadow-sm" popperConfig={{ strategy: "fixed" }}>
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
        </div>

        {/* Footer / pagination */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 border-top">
          <span className="small text-muted">
            {filtered.length === 0
              ? "0 results"
              : `Showing ${start + 1}-${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>

          <Pagination className="mb-0" size="sm">
            <Pagination.Prev disabled={safePage === 1} onClick={() => setPage(safePage - 1)} />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Pagination.Item key={n} active={n === safePage} onClick={() => setPage(n)}>
                {n}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} />
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Products;