import { Fragment, useMemo, useState } from "react";
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
  FiUpload,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiMoreHorizontal,
  FiChevronRight,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import "../../../styles/AdminUI.css";

/* ---------- Mock data (replace with your API call later) ---------- */
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

const CUSTOMERS = [
  { name: "Aarav Sharma", city: "Bhubaneswar" },
  { name: "Priya Nair", city: "Kochi" },
  { name: "Rohan Mehta", city: "Mumbai" },
  { name: "Sneha Patel", city: "Ahmedabad" },
  { name: "Vikram Singh", city: "Jaipur" },
  { name: "Ananya Das", city: "Kolkata" },
  { name: "Karan Verma", city: "Delhi" },
  { name: "Meera Iyer", city: "Chennai" },
];
const CATALOG = [
  { name: "Slim Fit Polo", price: 39 },
  { name: "Classic Hoodie", price: 59 },
  { name: "Denim Jacket", price: 89 },
  { name: "Chino Pants", price: 49 },
  { name: "Leather Belt", price: 25 },
];
const TILE_COLORS = ["#0d6efd", "#198754", "#6f42c1", "#fd7e14", "#dc3545", "#0dcaf0"];

const SEED = Array.from({ length: 28 }, (_, i) => {
  const customer = CUSTOMERS[i % CUSTOMERS.length];
  const status = STATUSES[(i * 2 + (i % 3)) % STATUSES.length];

  const items = Array.from({ length: (i % 3) + 1 }, (_, k) => {
    const product = CATALOG[(i + k * 2) % CATALOG.length];
    return { ...product, qty: ((i + k) % 3) + 1 };
  });
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  let payment = "Paid";
  if (status === "Pending") payment = i % 2 ? "Unpaid" : "Paid";
  if (status === "Cancelled") payment = i % 2 ? "Refunded" : "Unpaid";

  return {
    id: `#${1001 + i}`,
    customer: customer.name,
    email: `${customer.name.split(" ")[0].toLowerCase()}@example.com`,
    city: customer.city,
    date: new Date(2026, 9, 15 - i),
    items,
    total,
    payment,
    status,
    color: TILE_COLORS[i % TILE_COLORS.length],
  };
});

const PAGE_SIZE = 8;
const formatDate = (d) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function Orders() {
  const [orders, setOrders] = useState(SEED);
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("All");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const count = (s) => orders.filter((o) => o.status === s).length;
    return {
      total: orders.length,
      pending: count("Pending") + count("Processing"),
      delivered: count("Delivered"),
      revenue: orders.filter((o) => o.payment === "Paid").reduce((s, o) => s + o.total, 0),
    };
  }, [orders]);

  const tabCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUSES.forEach((s) => (counts[s] = orders.filter((o) => o.status === s).length));
    return counts;
  }, [orders]);

  /* ---------- Filter ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchTab = tab === "All" || o.status === tab;
      const matchQ =
        !q ||
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
  const setStatus = (id, status) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        // cancelling a paid order marks it refunded
        const nextPayment = status === "Cancelled" && o.payment === "Paid" ? "Refunded" : o.payment;
        return { ...o, status, payment: nextPayment };
      })
    );

  const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

  const STAT_CARDS = [
    { label: "Total Orders", value: stats.total, icon: <FiShoppingBag />, pill: "pill-info", note: "All time" },
    { label: "In Progress", value: stats.pending, icon: <FiClock />, pill: "pill-warning", note: "Pending + processing" },
    { label: "Delivered", value: stats.delivered, icon: <FiCheckCircle />, pill: "pill-success", note: "Completed" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: <FiDollarSign />, pill: "pill-success", note: "Paid orders" },
  ];

  return (
    <div>
      {/* ---------- Page header ---------- */}
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Orders</h1>
          <p>Track, update and fulfil customer orders.</p>
        </div>
        <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
          <FiUpload size={16} />
          <span className="d-none d-sm-inline">Export</span>
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

      {/* ---------- Table card ---------- */}
      <div className="ui-card">
        {/* Status tabs (scroll sideways on small screens) */}
        <div className="d-flex flex-nowrap gap-2 overflow-auto p-3 border-bottom">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setTab(s);
                setPage(1);
              }}
              className={`btn btn-sm flex-shrink-0 ${tab === s ? "btn-ink" : "btn-outline-secondary"}`}
            >
              {s} <span className="opacity-75">({tabCounts[s]})</span>
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
              <option key={p}>{p}</option>
            ))}
          </Form.Select>
        </div>

        {/* Table */}
        <div className="table-responsive">
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
                            aria-label={`Toggle details for order ${o.id}`}
                          >
                            <FiChevronRight
                              size={14}
                              style={{
                                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                              }}
                            />
                            {o.id}
                          </button>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="thumb" style={{ background: o.color, borderRadius: "50%" }}>
                              {o.customer.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-semibold">{o.customer}</div>
                              <div className="small text-muted d-none d-sm-block">{o.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">{formatDate(o.date)}</td>
                        <td className="d-none d-lg-table-cell">
                          {o.items.reduce((n, it) => n + it.qty, 0)} items
                        </td>
                        <td className="fw-semibold">${o.total.toFixed(2)}</td>
                        <td className="d-none d-sm-table-cell">
                          <span className={`pill ${PAYMENT_PILL[o.payment]}`}>{o.payment}</span>
                        </td>
                        <td>
                          <span className={`pill ${STATUS_PILL[o.status]}`}>{o.status}</span>
                        </td>
                        <td className="text-end">
                          <Dropdown align="end">
                            <Dropdown.Toggle as="button" type="button" className="icon-btn" aria-label="Row actions">
                              <FiMoreHorizontal size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow-sm" popperConfig={{ strategy: "fixed" }}>
                              <Dropdown.Item onClick={() => toggleExpand(o.id)}>
                                {open ? "Hide details" : "View details"}
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2"
                                disabled={o.status === "Cancelled" || o.status === "Delivered"}
                                onClick={() => setStatus(o.id, "Shipped")}
                              >
                                <FiTruck size={14} /> Mark as shipped
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2"
                                disabled={o.status === "Cancelled" || o.status === "Delivered"}
                                onClick={() => setStatus(o.id, "Delivered")}
                              >
                                <FiCheckCircle size={14} /> Mark as delivered
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center gap-2 text-danger"
                                disabled={o.status === "Cancelled" || o.status === "Delivered"}
                                onClick={() => setStatus(o.id, "Cancelled")}
                              >
                                <FiXCircle size={14} /> Cancel order
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>

                      {/* Expandable details row */}
                      {open && (
                        <tr>
                          <td colSpan={8} className="p-0">
                            <div className="p-3 p-md-4 bg-body-tertiary border-bottom">
                              <Row className="g-4">
                                <Col xs={12} md={6}>
                                  <div className="ui-card-title mb-2">Items</div>
                                  {o.items.map((it) => (
                                    <div
                                      key={it.name}
                                      className="d-flex justify-content-between small py-1 border-bottom"
                                    >
                                      <span>
                                        {it.name} <span className="text-muted">x {it.qty}</span>
                                      </span>
                                      <span className="fw-semibold">${(it.price * it.qty).toFixed(2)}</span>
                                    </div>
                                  ))}
                                  <div className="d-flex justify-content-between pt-2 fw-bold">
                                    <span>Total</span>
                                    <span>${o.total.toFixed(2)}</span>
                                  </div>
                                </Col>

                                <Col xs={12} sm={6} md={3}>
                                  <div className="ui-card-title mb-2">Shipping</div>
                                  <div className="small">{o.customer}</div>
                                  <div className="small text-muted">{o.city}, India</div>
                                  <div className="small text-muted">{o.email}</div>
                                </Col>

                                <Col xs={12} sm={6} md={3}>
                                  <div className="ui-card-title mb-2">Update status</div>
                                  <Form.Select
                                    size="sm"
                                    value={o.status}
                                    onChange={(e) => setStatus(o.id, e.target.value)}
                                  >
                                    {STATUSES.map((s) => (
                                      <option key={s}>{s}</option>
                                    ))}
                                  </Form.Select>
                                  <div className="mt-2">
                                    <span className={`pill ${PAYMENT_PILL[o.payment]}`}>{o.payment}</span>
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

export default Orders;