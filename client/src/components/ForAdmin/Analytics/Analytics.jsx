import { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  FiDownload,
  FiDollarSign,
  FiShoppingBag,
  FiPercent,
  FiCreditCard,
  FiArrowUpRight,
  FiArrowDownRight,
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "../../../styles/AdminUI.css";
import "./Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

/* ---------- Global chart look ---------- */
const FONT = '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
ChartJS.defaults.font.family = FONT;
ChartJS.defaults.font.size = 12;

// Render at 2x-3x pixel density so lines and text stay razor sharp
const HD_DPR =
  typeof window !== "undefined" ? Math.min(Math.max(window.devicePixelRatio || 1, 2), 3) : 2;

/* ---------- Helpers ---------- */
const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const wave = (i, seed) => Math.sin(i * 1.3 + seed) * 0.12 + Math.cos(i * 2.1 + seed * 2) * 0.06;

/* ---------- Theme hook: re-colours charts when data-bs-theme changes ---------- */
function useChartTheme() {
  const read = () => document.documentElement.getAttribute("data-bs-theme") === "dark";
  const [dark, setDark] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return useMemo(
    () => ({
      dark,
      text: dark ? "#adb5bd" : "#6c757d",
      grid: dark ? "rgba(255,255,255,0.07)" : "rgba(16,24,40,0.06)",
      tooltipBg: dark ? "#f8f9fa" : "#111827",
      tooltipText: dark ? "#111827" : "#ffffff",
      target: dark ? "#6c757d" : "#adb5bd",
    }),
    [dark]
  );
}

/* ---------- Custom Chart.js plugins ---------- */
// Dashed vertical line that follows the hovered point
const crosshair = {
  id: "crosshair",
  afterDatasetsDraw(chart) {
    const active = chart.tooltip?.getActiveElements?.();
    if (!active || !active.length) return;
    const { ctx, chartArea } = chart;
    const x = active[0].element.x;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(128,128,128,0.55)";
    ctx.stroke();
    ctx.restore();
  },
};

// Total + label rendered in the middle of the doughnut
const centerText = {
  id: "centerText",
  afterDraw(chart, _args, opts) {
    if (!opts?.value) return;
    const { ctx, chartArea } = chart;
    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = opts.color;
    ctx.font = `700 24px ${FONT}`;
    ctx.fillText(opts.value, x, y - 8);
    ctx.fillStyle = opts.subColor;
    ctx.font = `500 12px ${FONT}`;
    ctx.fillText(opts.label, x, y + 16);
    ctx.restore();
  },
};

// Vertical fade used under line charts
const areaGradient = (rgb) => (context) => {
  const { chart } = context;
  const { ctx, chartArea } = chart;
  if (!chartArea) return "transparent";
  const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, `rgba(${rgb},0.32)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  return g;
};

const baseOptions = (t) => ({
  responsive: true,
  maintainAspectRatio: false,
  devicePixelRatio: HD_DPR,
  animation: { duration: 700, easing: "easeOutQuart" },
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: t.tooltipBg,
      titleColor: t.tooltipText,
      bodyColor: t.tooltipText,
      padding: 12,
      cornerRadius: 10,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: { weight: "600", size: 12 },
      bodyFont: { size: 12 },
    },
  },
});

/* ---------- Mock data ---------- */
const REF = new Date(2026, 9, 15);

const RANGES = {
  "7D": {
    n: 7, step: "day", base: 1900, growth: 0.1,
    delta: { rev: 8.4, orders: 5.2, conv: 0.6, aov: 3.1 },
  },
  "30D": {
    n: 30, step: "day", base: 1750, growth: 0.14,
    delta: { rev: 12.6, orders: 9.8, conv: 0.9, aov: -1.4 },
  },
  "90D": {
    n: 13, step: "week", base: 12400, growth: 0.18,
    delta: { rev: 18.2, orders: 14.1, conv: 1.2, aov: 2.2 },
  },
  "12M": {
    n: 12, step: "month", base: 52000, growth: 0.32,
    delta: { rev: 31.5, orders: 24.7, conv: 1.8, aov: -0.8 },
  },
};

function buildLabels({ n, step }) {
  return Array.from({ length: n }, (_, i) => {
    const back = n - 1 - i;
    const d = new Date(REF);
    if (step === "month") {
      d.setMonth(d.getMonth() - back);
      return d.toLocaleDateString("en-US", { month: "short" });
    }
    d.setDate(d.getDate() - back * (step === "week" ? 7 : 1));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
}

function buildSeries({ n, base, growth }) {
  const revenue = [];
  const target = [];
  const span = Math.max(n - 1, 1);
  for (let i = 0; i < n; i++) {
    const trend = base * (1 + growth * (i / span));
    revenue.push(Math.round(trend * (1 + wave(i, 2))));
    target.push(Math.round(trend * 1.04));
  }
  return { revenue, target };
}

const CHANNELS = [
  { name: "Website", pct: 46, color: "#0d6efd" },
  { name: "Marketplace", pct: 27, color: "#6f42c1" },
  { name: "Mobile App", pct: 19, color: "#20c997" },
  { name: "Store", pct: 8, color: "#fd7e14" },
];

const CATEGORIES = [
  { name: "T-Shirts", pct: 34, color: "#0d6efd" },
  { name: "Hoodies", pct: 26, color: "#6f42c1" },
  { name: "Jackets", pct: 21, color: "#20c997" },
  { name: "Pants", pct: 12, color: "#fd7e14" },
  { name: "Accessories", pct: 7, color: "#dc3545" },
];

const TOP_PRODUCTS = [
  { name: "Slim Fit Polo", pct: 18, price: 39, color: "#0d6efd" },
  { name: "Classic Hoodie", pct: 15, price: 59, color: "#6f42c1" },
  { name: "Denim Jacket", pct: 13, price: 89, color: "#20c997" },
  { name: "Chino Pants", pct: 10, price: 49, color: "#fd7e14" },
  { name: "Leather Belt", pct: 6, price: 25, color: "#dc3545" },
];

const LOCATIONS = [
  { name: "Mumbai", pct: 24 },
  { name: "Delhi", pct: 19 },
  { name: "Bengaluru", pct: 16 },
  { name: "Hyderabad", pct: 11 },
  { name: "Bhubaneswar", pct: 8 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["12a", "4a", "8a", "12p", "4p", "8p"];
const SLOT_W = [2, 1, 4, 7, 8, 10];
const DAY_W = [1, 1, 1.05, 1.1, 1.3, 1.5, 1.4];
const HEAT = DAYS.map((_, d) =>
  SLOTS.map((_, s) => Math.round(SLOT_W[s] * DAY_W[d] * 10 + ((d * 7 + s * 3) % 5)))
);
const HEAT_MAX = Math.max(...HEAT.flat());

/* ---------- Small UI pieces ---------- */
function Delta({ value, suffix = "%" }) {
  const up = value >= 0;
  return (
    <span className={`pill ${up ? "pill-success" : "pill-danger"}`}>
      {up ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
      {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  );
}

function Panel({ icon, title, right, children, className = "" }) {
  return (
    <div className={`ui-card p-3 p-md-4 h-100 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <div className="ui-card-title">
          {icon}
          {title}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

const SPARK_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  devicePixelRatio: HD_DPR,
  events: [],
  animation: { duration: 600 },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  layout: { padding: { top: 4, bottom: 2 } },
};

function Sparkline({ data, rgb }) {
  const chartData = useMemo(
    () => ({
      labels: data.map((_, i) => i),
      datasets: [
        {
          data,
          borderColor: `rgb(${rgb})`,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          fill: true,
          backgroundColor: areaGradient(rgb),
        },
      ],
    }),
    [data, rgb]
  );
  return (
    <div className="spark-box">
      <Line data={chartData} options={SPARK_OPTIONS} />
    </div>
  );
}

/* ---------- Page ---------- */
function Analytics() {
  const theme = useChartTheme();
  const [range, setRange] = useState("30D");

  const d = useMemo(() => {
    const cfg = RANGES[range];
    const labels = buildLabels(cfg);
    const { revenue, target } = buildSeries(cfg);
    const totalRevenue = sum(revenue);
    const aov = 62 + Math.round(cfg.growth * 20);
    const orders = Math.round(totalRevenue / aov);
    const conv = 2.8 + cfg.growth * 4;
    return { cfg, labels, revenue, target, totalRevenue, aov, orders, conv };
  }, [range]);

  const kpis = useMemo(
    () => [
      {
        label: "Revenue", icon: <FiDollarSign />, rgb: "13,110,253",
        value: usd(d.totalRevenue), delta: d.cfg.delta.rev, spark: d.revenue,
      },
      {
        label: "Orders", icon: <FiShoppingBag />, rgb: "25,135,84",
        value: d.orders.toLocaleString("en-US"), delta: d.cfg.delta.orders,
        spark: d.revenue.map((v) => Math.round(v / d.aov)),
      },
      {
        label: "Conversion Rate", icon: <FiPercent />, rgb: "111,66,193",
        value: d.conv.toFixed(1) + "%", delta: d.cfg.delta.conv, suffix: " pts",
        spark: d.revenue.map((_, i) => 3 + wave(i, 5) * 6),
      },
      {
        label: "Avg Order Value", icon: <FiCreditCard />, rgb: "253,126,20",
        value: "$" + d.aov, delta: d.cfg.delta.aov,
        spark: d.revenue.map((_, i) => d.aov * (1 + wave(i, 9) * 0.4)),
      },
    ],
    [d]
  );

  /* ----- Revenue vs target ----- */
  const lineData = useMemo(
    () => ({
      labels: d.labels,
      datasets: [
        {
          label: "Revenue",
          data: d.revenue,
          borderColor: "#0d6efd",
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          backgroundColor: areaGradient("13,110,253"),
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#0d6efd",
          pointHoverBorderWidth: 2.5,
        },
        {
          label: "Target",
          data: d.target,
          borderColor: theme.target,
          borderWidth: 1.5,
          borderDash: [6, 6],
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    }),
    [d, theme]
  );

  const lineOptions = useMemo(() => {
    const base = baseOptions(theme);
    return {
      ...base,
      plugins: {
        ...base.plugins,
        tooltip: {
          ...base.plugins.tooltip,
          callbacks: { label: (c) => `  ${c.dataset.label}: ${usd(c.parsed.y)}` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: theme.text, maxTicksLimit: 8, maxRotation: 0 },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: theme.grid },
          ticks: { color: theme.text, maxTicksLimit: 6, callback: (v) => "$" + compact.format(v) },
        },
      },
    };
  }, [theme]);

  /* ----- Channel doughnut ----- */
  const doughnutData = useMemo(
    () => ({
      labels: CHANNELS.map((c) => c.name),
      datasets: [
        {
          data: CHANNELS.map((c) => Math.round((d.totalRevenue * c.pct) / 100)),
          backgroundColor: CHANNELS.map((c) => c.color),
          borderWidth: 0,
          spacing: 4,
          borderRadius: 10,
          hoverOffset: 6,
        },
      ],
    }),
    [d.totalRevenue]
  );

  const doughnutOptions = useMemo(() => {
    const base = baseOptions(theme);
    return {
      ...base,
      cutout: "76%",
      interaction: { mode: "nearest", intersect: true },
      plugins: {
        ...base.plugins,
        tooltip: {
          ...base.plugins.tooltip,
          callbacks: { label: (c) => `  ${c.label}: ${usd(c.parsed)}` },
        },
        centerText: {
          value: usd(d.totalRevenue),
          label: "Total revenue",
          color: theme.dark ? "#f8f9fa" : "#111827",
          subColor: theme.text,
        },
      },
    };
  }, [theme, d.totalRevenue]);

  /* ----- Category bars ----- */
  const barData = useMemo(
    () => ({
      labels: CATEGORIES.map((c) => c.name),
      datasets: [
        {
          data: CATEGORIES.map((c) => Math.round((d.totalRevenue * c.pct) / 100)),
          backgroundColor: CATEGORIES.map((c) => c.color),
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 16,
        },
      ],
    }),
    [d.totalRevenue]
  );

  const barOptions = useMemo(() => {
    const base = baseOptions(theme);
    return {
      ...base,
      indexAxis: "y",
      plugins: {
        ...base.plugins,
        tooltip: {
          ...base.plugins.tooltip,
          callbacks: { label: (c) => `  ${usd(c.parsed.x)}` },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: theme.grid },
          ticks: { color: theme.text, maxTicksLimit: 5, callback: (v) => "$" + compact.format(v) },
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: theme.text },
        },
      },
    };
  }, [theme]);

  /* ----- CSV export of the current range ----- */
  const exportCsv = () => {
    const csv = [
      "Period,Revenue,Target",
      ...d.labels.map((l, i) => `${l},${d.revenue[i]},${d.target[i]}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const achievement = Math.round((sum(d.revenue) / sum(d.target)) * 100);

  return (
    <div>
      {/* ---------- Page header ---------- */}
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Analytics</h1>
          <p>Understand how your store is performing.</p>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <div className="seg" role="tablist" aria-label="Date range">
            {Object.keys(RANGES).map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={range === r}
                className={range === r ? "active" : ""}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="outline-secondary" className="d-flex align-items-center gap-2" onClick={exportCsv}>
            <FiDownload size={16} />
            <span className="d-none d-sm-inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* ---------- KPI cards with sparklines ---------- */}
      <Row className="g-3 mb-4">
        {kpis.map((k) => (
          <Col key={k.label} xs={12} sm={6} xl={3}>
            <div className="ui-card stat-card">
              <div className="ui-card-title">
                {k.icon}
                {k.label}
              </div>
              <div className="stat-body">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="stat-value">{k.value}</div>
                  <Delta value={k.delta} suffix={k.suffix || "%"} />
                </div>
                <div className="small text-muted">vs previous period</div>
                <Sparkline data={k.spark} rgb={k.rgb} />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ---------- Revenue + channels ---------- */}
      <Row className="g-3 mb-4">
        <Col xs={12} lg={8}>
          <Panel
            icon={<FiTrendingUp />}
            title="Revenue vs Target"
            right={
              <span className={`pill ${achievement >= 100 ? "pill-success" : "pill-warning"}`}>
                {achievement}% of target
              </span>
            }
          >
            <div className="d-flex gap-4 small mb-3">
              <span className="d-flex align-items-center gap-2">
                <span className="legend-dot" style={{ background: "#0d6efd" }} /> Revenue
              </span>
              <span className="d-flex align-items-center gap-2 text-muted">
                <span className="legend-dot" style={{ background: theme.target }} /> Target
              </span>
            </div>
            <div className="chart-box" style={{ height: 320 }}>
              <Line data={lineData} options={lineOptions} plugins={[crosshair]} />
            </div>
          </Panel>
        </Col>

        <Col xs={12} lg={4}>
          <Panel icon={<FiPieChart />} title="Sales by Channel">
            <div className="chart-box mx-auto" style={{ height: 230, maxWidth: 260 }}>
              <Doughnut data={doughnutData} options={doughnutOptions} plugins={[centerText]} />
            </div>
            <div className="mt-3 d-flex flex-column gap-2">
              {CHANNELS.map((c) => (
                <div key={c.name} className="d-flex align-items-center justify-content-between small">
                  <span className="d-flex align-items-center gap-2">
                    <span className="legend-dot" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="d-flex align-items-center gap-3">
                    <span className="text-muted">{usd((d.totalRevenue * c.pct) / 100)}</span>
                    <span className="fw-semibold" style={{ minWidth: 34, textAlign: "right" }}>
                      {c.pct}%
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </Col>
      </Row>

      {/* ---------- Categories + top products ---------- */}
      <Row className="g-3 mb-4">
        <Col xs={12} lg={5}>
          <Panel icon={<FiBarChart2 />} title="Revenue by Category">
            <div className="chart-box" style={{ height: 300 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </Panel>
        </Col>

        <Col xs={12} lg={7}>
          <Panel icon={<FiShoppingBag />} title="Top Products" right={<span className="small text-muted">by revenue</span>}>
            <div className="d-flex flex-column gap-3">
              {TOP_PRODUCTS.map((p, i) => {
                const revenue = (d.totalRevenue * p.pct) / 100;
                return (
                  <div key={p.name} className="d-flex align-items-center gap-3">
                    <div className="thumb" style={{ background: p.color }}>
                      {i + 1}
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="d-flex justify-content-between gap-2">
                        <span className="fw-semibold text-truncate">{p.name}</span>
                        <span className="fw-semibold">{usd(revenue)}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>{Math.round(revenue / p.price).toLocaleString("en-US")} units</span>
                        <span>{p.pct}% of sales</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(p.pct / TOP_PRODUCTS[0].pct) * 100}%`, background: p.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </Col>
      </Row>

      {/* ---------- Heatmap + locations ---------- */}
      <Row className="g-3">
        <Col xs={12} lg={7}>
          <Panel
            icon={<FiClock />}
            title="Orders by Day and Time"
            right={
              <span className="d-flex align-items-center gap-2 small text-muted">
                Less
                <span className="heat-scale" />
                More
              </span>
            }
          >
            <div className="heat-grid">
              <span />
              {SLOTS.map((s) => (
                <span key={s} className="heat-label text-center">
                  {s}
                </span>
              ))}

              {DAYS.map((day, di) => (
                <HeatRow key={day} day={day} values={HEAT[di]} />
              ))}
            </div>
          </Panel>
        </Col>

        <Col xs={12} lg={5}>
          <Panel icon={<FiMapPin />} title="Top Locations">
            <div className="d-flex flex-column gap-3">
              {LOCATIONS.map((l) => (
                <div key={l.name}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">{l.name}</span>
                    <span className="text-muted">
                      {usd((d.totalRevenue * l.pct) / 100)} <span className="ms-2 fw-semibold text-body">{l.pct}%</span>
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(l.pct / LOCATIONS[0].pct) * 100}%`, background: "#0d6efd" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Col>
      </Row>
    </div>
  );
}

function HeatRow({ day, values }) {
  return (
    <>
      <span className="heat-label">{day}</span>
      {values.map((v, i) => {
        const intensity = v / HEAT_MAX;
        return (
          <div
            key={i}
            className="heat-cell"
            title={`${day} ${SLOTS[i]}: ${v} orders`}
            style={{
              background: `rgba(13,110,253,${0.08 + 0.92 * intensity})`,
              color: intensity > 0.5 ? "#fff" : "var(--bs-secondary-color)",
            }}
          >
            <span className="d-none d-sm-inline">{v}</span>
          </div>
        );
      })}
    </>
  );
}

export default Analytics;