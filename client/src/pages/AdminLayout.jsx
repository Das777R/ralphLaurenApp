
import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import SideBar from "../components/ForAdmin/SideBar/SideBar";
import Header from "../components/ForAdmin/Header/Header";
import AdminAuth from "../components/ForAdmin/AdminAuth/AdminAuth";
import api, {
  refreshSession,
  setAccessToken,
  ADMIN_EXPIRED_EVENT,
} from "../api/api";
import "../styles/AdminLayout.css";

const DESKTOP_QUERY = "(min-width: 992px)";
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

function AdminLayout() {
  const [status, setStatus] = useState("checking");
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Clear the admin session and redirect to authentication
  const clearSession = useCallback(() => {
    setAccessToken("", "admin");
    setAdmin(null);
    setStatus("guest");
    setSidebarOpen(false);

    navigate("/admin/auth", { replace: true });
  }, [navigate]);

  // Restore the admin session using the HttpOnly refresh-token cookie
  useEffect(() => {
    let alive = true;

    refreshSession("admin")
      .then((data) => {
        if (!alive) return;

        if (data?.accessToken && data.role === "admin") {
          setAccessToken(data.accessToken, "admin");

          setAdmin({
            id: String(data.userId),
            role: data.role,
            name: data.name,
          });

          setStatus("authed");
        } else {
          clearSession();
        }
      })
      .catch(() => {
        if (alive) {
          clearSession();
        }
      });

    return () => {
      alive = false;
    };
  }, [clearSession]);

  // Handle expired or revoked admin sessions
  useEffect(() => {
    window.addEventListener(ADMIN_EXPIRED_EVENT, clearSession);

    return () => {
      window.removeEventListener(ADMIN_EXPIRED_EVENT, clearSession);
    };
  }, [clearSession]);

  // Handle successful admin authentication
  const handleAuthenticated = useCallback(
    ({ user, accessToken }) => {
      if (user?.role !== "admin" || !accessToken || !user.id) {
        return false;
      }

      setAccessToken(accessToken, "admin");

      setAdmin({
        id: String(user.id),
        role: user.role,
        name: user.name,
      });

      setStatus("authed");

      navigate(`/admin/dashboard/${user.id}`, {
        replace: true,
      });

      return true;
    },
    [navigate]
  );

  // Log out the admin
  const handleLogout = useCallback(async () => {
    try {
      await api.post("/admin/logout");
    } catch (error) {
      console.error("Admin logout request failed:", error);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  // Keep the URL admin ID consistent with the authenticated admin
  useEffect(() => {
    if (status !== "authed" || !admin?.id) return;

    const segments = location.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (OBJECT_ID_RE.test(lastSegment)) {
      if (lastSegment !== admin.id) {
        segments[segments.length - 1] = admin.id;

        navigate(`/${segments.join("/")}${location.search}`, {
          replace: true,
        });
      }
    } else if (
      location.pathname.replace(/\/$/, "") === "/admin/dashboard"
    ) {
      navigate(`/admin/dashboard/${admin.id}`, {
        replace: true,
      });
    }
  }, [
    status,
    admin,
    location.pathname,
    location.search,
    navigate,
  ]);

  // Close the sidebar whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close the sidebar when switching to desktop width
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const handleChange = (event) => {
      if (event.matches) {
        setSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Handle Escape and prevent background scrolling while the sidebar is open
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen, closeSidebar]);

  // Display a loading spinner while checking the session
  if (status === "checking") {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  // Display the admin login page for unauthenticated users
  if (status === "guest") {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  // Render the protected admin pages
  return (
    <div className="admin-layout">
      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
        admin={admin}
      />

      {sidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <Header
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        admin={admin}
      />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
