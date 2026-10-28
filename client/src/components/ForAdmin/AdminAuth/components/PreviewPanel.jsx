import {FiShoppingBag,FiTrendingUp} from "react-icons/fi";

function PreviewPanel() {
  return (
    <aside className="auth-preview">
      <span className="auth-pill">Marketing &amp; Sales</span>
      <h2 className="auth-preview-title">Run your store from one clean dashboard.</h2>
      <p className="auth-preview-sub">
        Products, orders and customers in one place, with the numbers that matter up front.
      </p>

      <div className="auth-mini-grid">
        <div className="auth-mini-card">
          <div className="auth-mini-label">
            <FiShoppingBag size={14} /> TOTAL ORDER
          </div>
          <div className="auth-mini-value">6,432</div>
          <span className="auth-chip auth-chip-up">
            <FiTrendingUp size={12} /> 12%
          </span>
          <span className="auth-mini-note">vs last month</span>
        </div>

        <div className="auth-mini-card">
          <div className="auth-mini-label">
            <FiTrendingUp size={14} /> TOTAL SALES
          </div>
          <div className="auth-mini-value">₹12.5L</div>
          <span className="auth-chip auth-chip-up">
            <FiTrendingUp size={12} /> 1.8%
          </span>
          <span className="auth-mini-note">vs last month</span>
        </div>
      </div>

      <div className="auth-bars" aria-hidden="true">
        <div style={{ height: "100%" }} className="auth-bar auth-bar-dark" />
        <div style={{ height: "48%" }} className="auth-bar auth-bar-mid" />
        <div style={{ height: "30%" }} className="auth-bar auth-bar-light" />
      </div>
    </aside>
  );
}

export default PreviewPanel;