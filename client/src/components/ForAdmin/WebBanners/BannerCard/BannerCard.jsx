import { Form, Dropdown } from "react-bootstrap";
import {
  FiMoreHorizontal,
  FiEdit2,
  FiCopy,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiLink,
  FiCalendar,
  FiMonitor,
  FiSmartphone,
} from "react-icons/fi";
import {
  useBanners,
  PLACEMENTS,
  SECTIONS,
  LIFECYCLE_PILL,
  getStatus,
  formatDate,
} from "../../../../context/admin/webbanner/BannerContext";
import BannerPreview from "../BannerPreview/BannerPreview";
import "./BannerCard.css";

export default function BannerCard({ banner: b }) {
  const {
    positions,
    openEdit,
    duplicate,
    move,
    setDeleting,
    toggleEnabled,
  } = useBanners();
 
  const lifecycle = getStatus(b);
  const dimmed = lifecycle === "Paused" || lifecycle === "Expired";
  const sectionMeta = SECTIONS[b.section];

  return (
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
            <Dropdown.Toggle
              as="button"
              type="button"
              className="icon-btn flex-shrink-0"
              aria-label="Banner actions"
            >
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
              <Dropdown.Item
                className="d-flex align-items-center gap-2 text-danger"
                onClick={() => setDeleting(b)}
              >
                <FiTrash2 size={14} /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <span className="pill pill-muted">
            {PLACEMENTS[b.placement]?.label || b.placement} #{positions[b.id]}
          </span>
          {sectionMeta && (
            <span className={`pill ${sectionMeta.pill}`}>{sectionMeta.label}</span>
          )}
          <span className={`pill ${LIFECYCLE_PILL[lifecycle]}`}>{lifecycle}</span>
          {b.device === "mobile" ? (
            <span className="pill pill-info d-flex align-items-center gap-1">
              <FiSmartphone size={11} /> Mobile
            </span>
          ) : (
            <span className="pill pill-muted d-flex align-items-center gap-1">
              <FiMonitor size={11} /> Desktop
            </span>
          )}
        </div>

        {b.brand && <div className="small text-muted">Brand: {b.brand}</div>}

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
  );
}