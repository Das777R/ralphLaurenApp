import { Row, Col } from "react-bootstrap";
import { FiImage, FiPlayCircle, FiClock, FiSlash } from "react-icons/fi";
import { useBanners } from "../../../../context/admin/webbanner/BannerContext";

export default function StatsCards() {
  const { stats } = useBanners();

  const cards = [
    { label: "Total Banners", value: stats.total, icon: <FiImage />, pill: "pill-info", note: "All placements" },
    { label: "Live Now", value: stats.live, icon: <FiPlayCircle />, pill: "pill-success", note: "Visible on site" },
    { label: "Scheduled", value: stats.scheduled, icon: <FiClock />, pill: "pill-info", note: "Starting soon" },
    { label: "Inactive", value: stats.inactive, icon: <FiSlash />, pill: "pill-muted", note: "Paused or expired" },
  ];

  return (
    <Row className="g-3 mb-4">
      {cards.map((s) => (
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
  );
}