import { NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiFolder,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import "./SideBar.css";

const getInitial = (name) => (name?.trim()?.[0] || "A").toUpperCase();

function SideBar({ isOpen, onClose, onLogout, admin, pendingOrdersCount = 0 }) {
  const { pathname } = useLocation();
  const adminId = admin?.id;

  const [mediaOpen, setMediaOpen] = useState(pathname.startsWith("/admin/media"));

  // Keep the Media sub-menu open when navigating inside it
  useEffect(() => {
    if (pathname.startsWith("/admin/media")) setMediaOpen(true);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-3 py-2 px-3 ${
      isActive ? "active bg-primary text-white" : "sidebar-link"
    }`;

  const subLinkClass = ({ isActive }) =>
    `nav-link py-1 px-2 small ${isActive ? "text-white fw-bold" : "sidebar-sublink"}`;

  const displayName = admin?.name || "Admin Account";

  const dashPath = adminId ? `/admin/dashboard/${adminId}` : "/admin/dashboard";
  const productsPath = adminId ? `/admin/products/${adminId}` : "/admin/products";
  const ordersPath = adminId ? `/admin/orders/${adminId}` : "/admin/orders";
  const customersPath = adminId ? `/admin/customers/${adminId}` : "/admin/customers";
  const analyticsPath = adminId ? `/admin/analytics/${adminId}` : "/admin/analytics";
  const webContentPath = adminId
    ? `/admin/media/web-content/${adminId}`
    : "/admin/media/web-content";
  const productMediaPath = adminId
    ? `/admin/media/products/${adminId}`
    : "/admin/media/products";

  return (
    <aside
      className={`sidebar-wrapper ${isOpen ? "open" : ""}`}
      aria-label="Admin navigation"
    >
      {/* Brand + mobile close button */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-2">
        <Link to={dashPath} className="text-white text-decoration-none">
          <span className="fs-4 fw-bold">
            <span className="text-primary">E</span>Store Admin
          </span>
        </Link>
        <button
          type="button"
          className="btn btn-link text-white p-0 border-0 d-lg-none"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <FiX size={22} />
        </button>
      </div>

      <hr className="text-secondary my-2" />

      {/* Scrollable nav */}
      <nav className="sidebar-nav">
        <ul className="nav nav-pills flex-column">
          <li className="nav-item mb-1">
            {/* No `end`: the URL carries the admin id, so an exact match would never be active */}
            <NavLink to={dashPath} className={linkClass}>
              <FiGrid size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink to={productsPath} className={linkClass}>
              <FiBox size={18} />
              <span>Products</span>
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink to={ordersPath} className={linkClass}>
              <FiShoppingBag size={18} />
              <span className="flex-grow-1">Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="badge bg-danger rounded-pill">{pendingOrdersCount}</span>
              )}
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink to={customersPath} className={linkClass}>
              <FiUsers size={18} />
              <span>Customers</span>
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink to={analyticsPath} className={linkClass}>
              <FiBarChart2 size={18} />
              <span>Analytics</span>
            </NavLink>
          </li>

          {/* Media Manager */}
          <li className="nav-item mb-1">
            <button
              type="button"
              onClick={() => setMediaOpen((v) => !v)}
              className="nav-link sidebar-link w-100 d-flex align-items-center gap-3 py-2 px-3 border-0 bg-transparent text-start"
              aria-expanded={mediaOpen}
              aria-controls="media-submenu"
            >
              <FiFolder size={18} />
              <span className="flex-grow-1">Media Manager</span>
              <FiChevronDown
                size={14}
                style={{
                  transform: mediaOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {mediaOpen && (
              <ul id="media-submenu" className="nav flex-column ps-4 mt-1">
                <li className="nav-item mb-1">
                  <NavLink to={webContentPath} className={subLinkClass}>
                    Web Page Banners
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={productMediaPath} className={subLinkClass}>
                    Product Images/Videos
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <hr className="text-secondary my-3" />

      {/* Footer / user */}
      <Dropdown drop="up">
        <Dropdown.Toggle
          as="button"
          type="button"
          className="sidebar-user w-100 d-flex align-items-center text-white border-0 bg-transparent p-2 rounded"
        >
          <span className="sidebar-avatar me-2">{getInitial(admin?.name)}</span>
          <strong className="small flex-grow-1 text-start">{displayName}</strong>
        </Dropdown.Toggle>

        <Dropdown.Menu variant="dark" className="shadow w-100">
          <Dropdown.Item as="button" type="button" className="d-flex align-items-center gap-2" disabled>
            <FiSettings size={14} /> Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            as="button"
            type="button"
            className="d-flex align-items-center gap-2 text-danger"
            onClick={onLogout}
          >
            <FiLogOut size={14} /> Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </aside>
  );
}

export default SideBar;