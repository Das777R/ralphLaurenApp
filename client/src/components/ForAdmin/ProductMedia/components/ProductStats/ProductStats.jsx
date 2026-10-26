import { Row, Col } from "react-bootstrap";
import { FiLayers, FiStar, FiGrid, FiPackage } from "react-icons/fi";
import { useProductMedia } from "../../../../../context/admin/ProductMediaContext";

const inr = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

export default function ProductStats() {
  const { stats } = useProductMedia();

  const total = stats?.total ?? 0;
  const products = stats?.products ?? 0;
  const trending = stats?.trending ?? 0;
  const kinds = stats?.kinds ?? 0;
  const units = stats?.units ?? 0;
  const stockValue = stats?.stockValue ?? 0;
  const lowStock = stats?.lowStock ?? 0;

  return (
    <Row className="g-3 mb-4">
      <Col xs={12} sm={6} xl={3}>
        <div className="ui-card stat-card">
          <div className="ui-card-title">
            <FiLayers /> Variants
          </div>
          <div className="stat-body">
            <div className="stat-value">{total}</div>
            <span className="pill pill-info mt-1">
              {products} unique products
            </span>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} xl={3}>
        <div className="ui-card stat-card">
          <div className="ui-card-title">
            <FiStar /> Trending
          </div>
          <div className="stat-body">
            <div className="stat-value">{trending}</div>
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
            <div className="stat-value">{kinds}</div>
            <span className="pill pill-success mt-1">Departments</span>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} xl={3}>
        <div className="ui-card stat-card">
          <div className="ui-card-title">
            <FiPackage /> Stock
          </div>
          <div className="stat-body">
            <div className="stat-value">
              {units.toLocaleString("en-IN")}
            </div>
            <div className="small text-muted my-1">
              Worth {inr(stockValue)}
            </div>
            <span
              className={`pill ${
                lowStock ? "pill-warning" : "pill-success"
              }`}
            >
              {lowStock} low on stock
            </span>
          </div>
        </div>
      </Col>
    </Row>
  );
}