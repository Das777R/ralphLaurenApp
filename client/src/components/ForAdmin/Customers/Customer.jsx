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
  Offcanvas,
  Spinner,
} from "react-bootstrap";
import {
  FiSearch,
  FiUpload,
  FiUserPlus,
  FiUsers,
  FiUserCheck,
  FiStar,
  FiDollarSign,
  FiMoreHorizontal,
  FiEye,
  FiSlash,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../../api/api.js"; // adjust path
import "../../../styles/AdminUI.css";

/* ---------- Constants ---------- */
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
  Inactive: "pill-muted",
  Blocked: "pill-danger",
};

const TIER_PILL = {
  VIP: "pill-warning",
  Regular: "pill-muted",
  New: "pill-success",
};

const PAGE_SIZE = 8;

const formatDate = (d) => {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

const getTier = (c) =>
  c.spent >= 700 ? "VIP" : c.orders <= 1 ? "New" : "Regular";

/**
 * UserAccount → UI customer
 * Schema: name, email, bag[], role, createdAt
 * Optional later: phone, city, status
 */
const normalizeCustomer = (u) => {
  const bag = Array.isArray(u.bag) ? u.bag : [];
  const orders = bag.reduce((n, item) => n + (Number(item.qty) || 1), 0);
  const spent = bag.reduce(
    (s, item) => s + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  const status = ["Active", "Inactive", "Blocked"].includes(u.status)
    ? u.status
    : "Active";

  return {
    id: String(u._id),
    name: u.name || u.email?.split("@")[0] || "Customer",
    email: u.email || "",
    phone: u.phone || u.mobileNumber || "—",
    city: u.city || "—",
    orders,
    spent,
    joined: u.createdAt ? new Date(u.createdAt) : null,
    status,
    role: u.role || "user",
    color: colorFromId(u._id),
    bag,
    _raw: u,
  };
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(null);

  const activeCustomer = customers.find((c) => c.id === activeId) || null;

  /* ---------- Load ---------- */
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      // Requires admin access token (verifyToken + isAdmin on backend)
      const res = await api.get("/admin/customers");
      const list = res.data?.data || [];
      // Only show end-users in the customers list
      const users = list.filter((u) => u.role !== "admin");
      setCustomers(users.map(normalizeCustomer));
    } catch (err) {
      setLoadError(
        err?.response?.data?.message ||
          err.message ||
          "Could not load customers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return {
      total: customers.length,
      newCount: customers.filter(
        (c) => c.joined && c.joined >= thirtyDaysAgo
      ).length,
      vip: customers.filter((c) => getTier(c) === "VIP").length,
      revenue: customers.reduce((sum, c) => sum + c.spent, 0),
    };
  }, [customers]);

  /* ---------- Filter + sort ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = customers.filter((c) => {
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.city || "").toLowerCase().includes(q);
      const matchT = tier === "All" || getTier(c) === tier;
      const matchS = status === "All" || c.status === status;
      return matchQ && matchT && matchS;
    });

    const sorters = {
      newest: (a, b) => (b.joined || 0) - (a.joined || 0),
      spentHigh: (a, b) => b.spent - a.spent,
      ordersHigh: (a, b) => b.orders - a.orders,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort(sorters[sort] || sorters.newest);
  }, [customers, query, tier, status, sort]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const resetPage = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  /* ---------- Actions (local until backend supports them) ---------- */
  const toggleBlock = (id) =>
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "Blocked" ? "Active" : "Blocked",
            }
          : c
      )
    );

  const deleteOne = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const STAT_CARDS = [
    {
      label: "Total Customers",
      value: stats.total,
      icon: <FiUsers />,
      pill: "pill-info",
      note: "All accounts",
    },
    {
      label: "New This Month",
      value: stats.newCount,
      icon: <FiUserCheck />,
      pill: "pill-success",
      note: "Last 30 days",
    },
    {
      label: "VIP Customers",
      value: stats.vip,
      icon: <FiStar />,
      pill: "pill-warning",
      note: "₹700+ in bag value",
    },
    {
      label: "Bag Revenue",
      value: inr(stats.revenue),
      icon: <FiDollarSign />,
      pill: "pill-success",
      note: "From cart totals",
    },
  ];

  return (
    <div>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Customers</h1>
          <p>View, segment and manage your customer base.</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2"
            onClick={loadCustomers}
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
            <FiUserPlus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center mb-3">
          <span>{loadError}</span>
          <Button variant="outline-danger" size="sm" onClick={loadCustomers}>
            Retry
          </Button>
        </div>
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
              placeholder="Search name, email or city"
              className="border-start-0 ps-0"
              value={query}
              onChange={resetPage(setQuery)}
            />
          </InputGroup>

          <Form.Select
            className="toolbar-select"
            value={tier}
            onChange={resetPage(setTier)}
          >
            <option value="All">All Segments</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="New">New</option>
          </Form.Select>

          <Form.Select
            className="toolbar-select"
            value={status}
            onChange={resetPage(setStatus)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </Form.Select>

          <Form.Select
            className="toolbar-select ms-sm-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="spentHigh">Top spenders</option>
            <option value="ordersHigh">Most orders</option>
            <option value="name">Name (A-Z)</option>
          </Form.Select>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="text-center text-muted py-5">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading customers…
            </div>
          ) : (
            <Table hover className="ui-table" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th className="d-none d-lg-table-cell">Location</th>
                  <th className="d-none d-sm-table-cell">Bag items</th>
                  <th>Bag value</th>
                  <th className="d-none d-md-table-cell">Joined</th>
                  <th className="d-none d-sm-table-cell">Segment</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-5">
                      No customers match your filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="thumb"
                            style={{
                              background: c.color,
                              borderRadius: "50%",
                            }}
                          >
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="fw-semibold">{c.name}</div>
                            <div
                              className="small text-muted text-truncate"
                              style={{ maxWidth: 200 }}
                            >
                              {c.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="d-none d-lg-table-cell">{c.city}</td>
                      <td className="d-none d-sm-table-cell">{c.orders}</td>
                      <td className="fw-semibold">{inr(c.spent)}</td>
                      <td className="d-none d-md-table-cell">
                        {formatDate(c.joined)}
                      </td>
                      <td className="d-none d-sm-table-cell">
                        <span className={`pill ${TIER_PILL[getTier(c)]}`}>
                          {getTier(c)}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${STATUS_PILL[c.status]}`}>
                          {c.status}
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
                            <Dropdown.Item
                              className="d-flex align-items-center gap-2"
                              onClick={() => setActiveId(c.id)}
                            >
                              <FiEye size={14} /> View profile
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex align-items-center gap-2"
                              onClick={() => toggleBlock(c.id)}
                            >
                              <FiSlash size={14} />{" "}
                              {c.status === "Blocked" ? "Unblock" : "Block"}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="d-flex align-items-center gap-2 text-danger"
                              onClick={() => deleteOne(c.id)}
                            >
                              <FiTrash2 size={14} /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
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

      <Offcanvas
        show={!!activeCustomer}
        onHide={() => setActiveId(null)}
        placement="end"
      >
        {activeCustomer && (
          <>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="fw-bold">
                Customer profile
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="text-center mb-4">
                <div
                  className="thumb mx-auto mb-3"
                  style={{
                    background: activeCustomer.color,
                    borderRadius: "50%",
                    width: 72,
                    height: 72,
                    fontSize: "1.6rem",
                  }}
                >
                  {activeCustomer.name.charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-bold mb-1">{activeCustomer.name}</h5>
                <div className="d-flex justify-content-center gap-2">
                  <span
                    className={`pill ${TIER_PILL[getTier(activeCustomer)]}`}
                  >
                    {getTier(activeCustomer)}
                  </span>
                  <span
                    className={`pill ${STATUS_PILL[activeCustomer.status]}`}
                  >
                    {activeCustomer.status}
                  </span>
                </div>
              </div>

              <Row className="g-2 mb-4 text-center">
                <Col xs={4}>
                  <div className="stat-body px-2">
                    <div className="fw-bold">{activeCustomer.orders}</div>
                    <div className="small text-muted">Bag qty</div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="stat-body px-2">
                    <div className="fw-bold">{inr(activeCustomer.spent)}</div>
                    <div className="small text-muted">Bag value</div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="stat-body px-2">
                    <div className="fw-bold">
                      {activeCustomer.orders
                        ? inr(
                            Math.round(
                              activeCustomer.spent / activeCustomer.orders
                            )
                          )
                        : "—"}
                    </div>
                    <div className="small text-muted">Avg item</div>
                  </div>
                </Col>
              </Row>

              <div className="ui-card-title mb-2">Contact</div>
              <div className="d-flex flex-column gap-2 mb-4 small">
                <div className="d-flex align-items-center gap-2">
                  <FiMail size={14} /> {activeCustomer.email}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FiPhone size={14} /> {activeCustomer.phone}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FiMapPin size={14} /> {activeCustomer.city}
                </div>
              </div>

              <div className="ui-card-title mb-2">Account</div>
              <div className="small mb-4">
                Customer since {formatDate(activeCustomer.joined)}
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => toggleBlock(activeCustomer.id)}
                >
                  <FiSlash size={14} className="me-2" />
                  {activeCustomer.status === "Blocked"
                    ? "Unblock customer"
                    : "Block customer"}
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => deleteOne(activeCustomer.id)}
                >
                  <FiTrash2 size={14} className="me-2" />
                  Delete customer
                </Button>
              </div>
            </Offcanvas.Body>
          </>
        )}
      </Offcanvas>
    </div>
  );
}

export default Customers;