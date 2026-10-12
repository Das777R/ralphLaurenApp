import './AdminHeader.css';
import { Link, useParams } from 'react-router-dom';
import { FiMenu, FiSearch, FiSun, FiMoon, FiX } from "react-icons/fi";
import { useEffect, useState } from 'react';
import AdminLogo from '../SideBar/AdminLogo';
import api from '../../../api/api';

function AdminHeader({ userRole = "Administrator", onToggleTheme, currentTheme }) {
  const { adminId } = useParams();
  const admin_auth_path = adminId ? `/admin/auth/${adminId}` : `/admin/auth`;

  const [adminData, setAdminData] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!adminId) return;

    const fetchAdminData = async () => {
      try {
        const res = await api.get(`/admin/auth/login/${adminId}`);
        setAdminData(res.data.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [adminId]);

  const userInitials = adminData?.name
    ? adminData.name.trim().split(/\s+/).map((word) => word[0]).join("").toUpperCase()
    : "";

  return (
    <header className="AdminHead-topbar d-flex align-items-center justify-content-between bg-body border-bottom px-2 px-sm-3 px-lg-4 user-select-none position-fixed top-0 start-0 end-0 z-3">
      <div className="d-flex align-items-center gap-2 gap-sm-3 flex-grow-1 AdminHead-left">
        <button
        type="button"
        className="AdminHead-icon-btn d-md-none"
        data-bs-toggle="collapse"
        data-bs-target="#collapseWidthExample"
        aria-expanded="false"
        aria-controls="collapseWidthExample"
        aria-label="Toggle menu"
        >
          <FiMenu size={20} />
        </button>

        <div className="AdminHead-logo">
          <AdminLogo className='admin-logo'/>
        </div>

        <div className="AdminHead-search d-none d-md-flex align-items-center gap-2 border border-secondary rounded-pill px-3 py-1 bg-body flex-grow-1">
          <FiSearch className="text-muted flex-shrink-0" />
          <input
            type="text"
            className="AdminHead-search-input flex-grow-1 bg-transparent border-0"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-1 gap-sm-3 flex-shrink-0">
        <button
          type="button"
          className="AdminHead-icon-btn d-md-none"
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label="Toggle search"
          aria-expanded={searchOpen}
        >
          {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
        </button>

        <button
          type="button"
          className="AdminHead-icon-btn"
          aria-label="Toggle theme"
          onClick={onToggleTheme}
        >
          {currentTheme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <Link to={admin_auth_path} className="text-decoration-none">
          <div className="AdminHead-user d-flex align-items-center gap-2 border-start ps-2 ps-sm-3">
            <div className="AdminHead-avatar d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle fw-bold">
              {userInitials}
            </div>
            <div className="AdminHead-user-info d-none d-lg-block text-start">
              <div className="AdminHead-user-name fw-medium lh-sm text-body">{adminData?.name}</div>
              <div className="AdminHead-user-role text-body">{userRole}</div>
            </div>
          </div>
        </Link>
      </div>

      {searchOpen && (
        <div className="AdminHead-mobile-search d-md-none position-absolute start-0 end-0 bg-body border-bottom p-2">
          <div className="d-flex align-items-center gap-2 border border-secondary rounded-pill px-3 py-1">
            <FiSearch className="text-muted flex-shrink-0" />
            <input
              type="text"
              className="AdminHead-search-input flex-grow-1 bg-transparent border-0"
              placeholder="Search"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default AdminHeader;