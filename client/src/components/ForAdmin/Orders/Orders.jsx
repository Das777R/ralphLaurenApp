import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
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
  FiUpload,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiMoreHorizontal,
  FiChevronRight,
  FiTruck,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../../api/api.js"; // adjust path to your axios instance
import "../../../styles/AdminUI.css";

/* ---------- Constants ---------- */
const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENTS = ["Paid", "Unpaid", "Refunded"];

const STATUS_PILL = {
  Pending: "pill-warning",
  Processing: "pill-info",
  Shipped: "pill-muted",
  Delivered: "pill-success",
  Cancelled: "pill-danger",
};

const PAYMENT_PILL = {
  Paid: "pill-success",
  Unpaid: "pill-warning",
  Refunded: "pill-muted",
};

const TILE_COLORS = [
  "#0d6efd",
  "#198754",
  "#6f42c1",
  "#fd7e14",
  "#dc3545",
  "#0dcaf0",
];

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
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const colorFromId = (id) => {
  const s = String(id || "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash + s.charCodeAt(i) * 17) % 97;
  return TILE_COLORS[hash % TILE_COLORS.length];
};

/**
 * Map one Mongo order document → UI row shape.
 * Backend fields (from orderSchema):
 *   products, addressName, firstName, lastName, email, country,
 *   address1, address2, city, postcode, mobileNumber, deliveryDate
 * Optional if you add them later: status, payment
 */
const normalizeOrder = (raw) => {
  const products = Array.isArray(raw.products) ? raw.products : [];

  const items = products.map((p, idx) => {
    const name =
      p.productName || p.name || p.title || p.kind || `Item ${idx + 1}`;
    const price = Number(p.price ?? p.unitPrice ?? 0) || 0;
    const qty = Number(p.qty ?? p.quantity ?? p.count ?? 1) || 1;
    return { name, price, qty, colorName: p.colorName || p.color || "" };
  });

  const totalFromItems = items.reduce((s, it) => s + it.price * it.qty, 0);
  const total = Number(raw.total ?? raw.amount ?? totalFromItems) || totalFromItems;

  const first = (raw.firstName || "").trim();
  const last = (raw.lastName || "").trim();
  const customer =
    [first, last].filter(Boolean).join(" ") ||
    raw.addressName ||
    raw.email ||
    "Customer";

  const status = STATUSES.includes(raw.status) ? raw.status : "Pending";
  let payment = PAYMENTS.includes(raw.payment) ? raw.payment : "Paid";
  if (status === "Cancelled" && payment === "Paid") payment = "Refunded";

  return {
    id: String(raw._id),
    displayId: `#${String(raw._id).slice(-6).toUpperCase()}`,
    customer,
    email: raw.email || "",
    phone: raw.mobileNumber || "",
    city: raw.city || "",
    country: raw.country || "",
    address1: raw.address1 || "",
    address2: raw.address2 || "",
    postcode: raw.postcode || "",
    addressName: raw.addressName || "",
    date: raw.createdAt || raw.deliveryDate || raw.updatedAt || null,
    deliveryDate: raw.deliveryDate || null,
    items,
    total,
    payment,
    status,
    color: colorFromId(raw._id),
    _raw: raw,
  };
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("All");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  /* ---------- Load ---------- */
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/admin/orders");
      const list = res.data?.data || [];
      console.log(list)
      setOrders(list.map(normalizeOrder));
    } catch (err) {
      setLoadError(
        err?.response?.data?.message || err.message || "Could not load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const count = (s) => orders.filter((o) => o.status === s).length;
    return {
      total: orders.length,
      pending: count("Pending") + count("Processing"),
      delivered: count("Delivered"),
      revenue: orders
        .filter((o) => o.payment === "Paid")
        .reduce((s, o) => s + o.total, 0),
    };
  }, [orders]);

  const tabCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUSES.forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  /* ---------- Filter ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchTab = tab === "All" || o.status === tab;
      const matchQ =
        !q ||
        o.displayId.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q);
      const matchP = payment === "All" || o.payment === payment;
      return matchTab && matchQ && matchP;
    });
  }, [orders, tab, query, payment]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  /* ---------- Actions ---------- */
  const setStatus = async (id, status) => {
    setActionError("");
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const nextPayment =
          status === "Cancelled" && o.payment === "Paid" ? "Refunded" : o.payment;
        return { ...o, status, payment: nextPayment };
      })
    );

    // Persist if backend supports it (optional route below)
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
    } catch {
      // Backend may not have this route yet — local state still updates
      // Uncomment to surface error:
      // setActionError("Status updated locally only (server endpoint missing).");
    }
  };

  const toggleExpand = (id) =>
    setExpandedId((cur) => (cur === id ? null : id));

  const STAT_CARDS = [
    {
      label: "Total Orders",
      value: stats.total,
      icon: <FiShoppingBag />,
      pill: "pill-info",
      note: "All time",
    },
    {
      label: "In Progress",
      value: stats.pending,
      icon: <FiClock />,
      pill: "pill-warning",
      note: "Pending + processing",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: <FiCheckCircle />,
      pill: "pill-success",
      note: "Completed",
    },
    {
      label: "Revenue",
      value: inr(stats.revenue),
      icon: <FiDollarSign />,
      pill: "pill-success",
      note: "Paid orders",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Orders</h1>
          <p>Track, update and fulfil customer orders.</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2"
            onClick={loadOrders}
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
        </div>
      </div>

      {loadError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center mb-3">
          <span>{loadError}</span>
          <Button variant="outline-danger" size="sm" onClick={loadOrders}>
            Retry
          </Button>
        </div>
      )}

      {actionError && (
        <div className="alert alert-warning small mb-3">{actionError}</div>
      )}

      {/* KPI cards */}
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

      {/* Table card */}
      <div className="ui-card">
        {/* Status tabs */}
        <div className="d-flex flex-nowrap gap-2 overflow-auto p-3 border-bottom">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setTab(s);
                setPage(1);
              }}
              className={`btn btn-sm flex-shrink-0 ${
                tab === s ? "btn-ink" : "btn-outline-secondary"
              }`}
            >
              {s} <span className="opacity-75">({tabCounts[s] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="d-flex flex-wrap align-items-center gap-2 p-3 border-bottom">
          <InputGroup className="toolbar-search">
            <InputGroup.Text className="bg-transparent border-end-0 text-muted">
              <FiSearch size={16} />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search order ID or customer"
              className="border-start-0 ps-0"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </InputGroup>

          <Form.Select
            className="toolbar-select ms-sm-auto"
            value={payment}
            onChange={(e) => {
              setPayment(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Payments</option>
            {PAYMENTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Table */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center text-muted py-5">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading orders…
            </div>
          ) : (
            <Table className="ui-table" style={{ minWidth: 680 }}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th className="d-none d-md-table-cell">Date</th>
                  <th className="d-none d-lg-table-cell">Items</th>
                  <th>Total</th>
                  <th className="d-none d-sm-table-cell">Payment</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-5">
                      No orders match your filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((o) => {
                    const open = expandedId === o.id;
                    return (
                      <Fragment key={o.id}>
                        <tr>
                          <td>
                            <button
                              type="button"
                              onClick={() => toggleExpand(o.id)}
                              className="btn btn-link p-0 border-0 text-body fw-semibold d-flex align-items-center gap-2 text-decoration-none"
                              aria-expanded={open}
                              aria-label={`Toggle details for order ${o.displayId}`}
                            >
                              <FiChevronRight
                                size={14}
                                style={{
                                  transform: open
                                    ? "rotate(90deg)"
                                    : "rotate(0deg)",
                                  transition: "transform 0.2s ease",
                                }}
                              />
                              {o.displayId}
                            </button>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="thumb"
                                style={{
                                  background: o.color,
                                  borderRadius: "50%",
                                }}
                              >
                                {o.customer.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-semibold">{o.customer}</div>
                                <div className="small text-muted d-none d-sm-block">
                                  {o.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="d-none d-md-table-cell">
                            {formatDate(o.date)}
                          </td>
                          <td className="d-none d-lg-table-cell">
                            {o.items.reduce((n, it) => n + it.qty, 0)} items
                          </td>
                          <td className="fw-semibold">{inr(o.total)}</td>
                          <td className="d-none d-sm-table-cell">
                            <span className={`pill ${PAYMENT_PILL[o.payment]}`}>
                              {o.payment}
                            </span>
                          </td>
                          <td>
                            <span className={`pill ${STATUS_PILL[o.status]}`}>
                              {o.status}
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
                                  onClick={() => toggleExpand(o.id)}
                                >
                                  {open ? "Hide details" : "View details"}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  className="d-flex align-items-center gap-2"
                                  disabled={
                                    o.status === "Cancelled" ||
                                    o.status === "Delivered"
                                  }
                                  onClick={() => setStatus(o.id, "Shipped")}
                                >
                                  <FiTruck size={14} /> Mark as shipped
                                </Dropdown.Item>
                                <Dropdown.Item
                                  className="d-flex align-items-center gap-2"
                                  disabled={
                                    o.status === "Cancelled" ||
                                    o.status === "Delivered"
                                  }
                                  onClick={() => setStatus(o.id, "Delivered")}
                                >
                                  <FiCheckCircle size={14} /> Mark as delivered
                                </Dropdown.Item>
                                <Dropdown.Item
                                  className="d-flex align-items-center gap-2 text-danger"
                                  disabled={
                                    o.status === "Cancelled" ||
                                    o.status === "Delivered"
                                  }
                                  onClick={() => setStatus(o.id, "Cancelled")}
                                >
                                  <FiXCircle size={14} /> Cancel order
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>

                        {open && (
                          <tr>
                            <td colSpan={8} className="p-0">
                              <div className="p-3 p-md-4 bg-body-tertiary border-bottom">
                                <Row className="g-4">
                                  <Col xs={12} md={6}>
                                    <div className="ui-card-title mb-2">
                                      Items
                                    </div>
                                    {o.items.length === 0 ? (
                                      <div className="small text-muted">
                                        No line items
                                      </div>
                                    ) : (
                                      o.items.map((it, idx) => (
                                        <div
                                          key={`${it.name}-${idx}`}
                                          className="d-flex justify-content-between small py-1 border-bottom"
                                        >
                                          <span>
                                            {it.name}
                                            {it.colorName
                                              ? ` (${it.colorName})`
                                              : ""}{" "}
                                            <span className="text-muted">
                                              × {it.qty}
                                            </span>
                                          </span>
                                          <span className="fw-semibold">
                                            {inr(it.price * it.qty)}
                                          </span>
                                        </div>
                                      ))
                                    )}
                                    <div className="d-flex justify-content-between pt-2 fw-bold">
                                      <span>Total</span>
                                      <span>{inr(o.total)}</span>
                                    </div>
                                  </Col>

                                  <Col xs={12} sm={6} md={3}>
                                    <div className="ui-card-title mb-2">
                                      Shipping
                                    </div>
                                    <div className="small">{o.customer}</div>
                                    {o.addressName && (
                                      <div className="small text-muted">
                                        {o.addressName}
                                      </div>
                                    )}
                                    <div className="small text-muted">
                                      {[o.address1, o.address2]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </div>
                                    <div className="small text-muted">
                                      {[o.city, o.postcode, o.country]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </div>
                                    <div className="small text-muted">
                                      {o.email}
                                    </div>
                                    {o.phone && (
                                      <div className="small text-muted">
                                        {o.phone}
                                      </div>
                                    )}
                                    {o.deliveryDate && (
                                      <div className="small text-muted mt-1">
                                        Delivery: {formatDate(o.deliveryDate)}
                                      </div>
                                    )}
                                  </Col>

                                  <Col xs={12} sm={6} md={3}>
                                    <div className="ui-card-title mb-2">
                                      Update status
                                    </div>
                                    <Form.Select
                                      size="sm"
                                      value={o.status}
                                      onChange={(e) =>
                                        setStatus(o.id, e.target.value)
                                      }
                                    >
                                      {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                          {s}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <div className="mt-2">
                                      <span
                                        className={`pill ${
                                          PAYMENT_PILL[o.payment]
                                        }`}
                                      >
                                        {o.payment}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Footer */}
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

export default Orders;