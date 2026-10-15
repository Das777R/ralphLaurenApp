import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/ForAdmin/SideBar/SideBar";
import Header from "../components/ForAdmin/Header/Header";
import "../styles/AdminLayout.css";

const DESKTOP_QUERY = "(min-width: 992px)";

function AdminLayout() {
  // Drawer state only matters on mobile; desktop is always open via CSS
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close the drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close the drawer if the screen grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e) => e.matches && setSidebarOpen(false);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Escape closes the drawer + lock body scroll while it is open
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => e.key === "Escape" && closeSidebar();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className="admin-layout">
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Backdrop is mobile-only (hidden on lg+ in CSS) */}
      {sidebarOpen && (
        <div className="admin-backdrop" onClick={closeSidebar} aria-hidden="true" />
      )}

      <Header toggleSidebar={toggleSidebar} />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;