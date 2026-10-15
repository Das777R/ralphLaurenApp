import { Row, Col, ProgressBar } from "react-bootstrap";
import { FiHardDrive, FiStar, FiGrid } from "react-icons/fi";
import { useProductMedia } from "../ProductMediaContext";
import { formatBytes } from "../utils";
import { QUOTA } from "../constants";

export default function ProductStats() {
  const { stats } = useProductMedia();
  const usedPct = Math.min(100, (stats.bytes / QUOTA) * 100);

  return (
    <Row className="g-3 mb-4">
      <Col xs={12} sm={6} xl={3}>
        <div className="ui-card stat-card">
          <div className="ui-card-title">
            <FiHardDrive /> Variants
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.total}</div>
            <span className="pill pill-info mt-1">Color variants</span>
          </div>
        </div>
      </Col>
      <Col xs={12} sm={6} xl={3}>
        <div className="ui-card stat-card">
          <div className="ui-card-title">
            <FiStar /> Trending
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.trending}</div>
            <span className="pill pill-warning mt-1">Flagged</span>
          </div>
        </div>
      </Col>
      <Col xs={12} sm={6} xl={3}>
        <div className="ui-card stat-card">
          <div className="ui-card-title">
            <FiGrid /> Kinds
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.kinds}</div>
            <span className="pill pill-success mt-1">Departments</span>
          </div>
        </div>
      </Col>
      <Col xs={12} sm={6} xl={3}>
        <div className="ui-card stat-card">
          <div className="ui-card-title">
            <FiHardDrive /> Storage
          </div>
          <div className="stat-body">
            <div className="stat-value">{formatBytes(stats.bytes)}</div>
            <ProgressBar now={usedPct} style={{ height: 6 }} className="my-2" />
            <span className="small text-muted">of {formatBytes(QUOTA)} used</span>
          </div>
        </div>
      </Col>
    </Row>
  );
}