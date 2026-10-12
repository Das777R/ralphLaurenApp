import { Outlet } from "react-router-dom";
import { useState, useEffect} from "react";
import AdminSideBar from "../components/ForAdmin/SideBar/AdminSideBar";
import AdminHeader from "../components/ForAdmin/Head/AdminHeader";

function AdminLayout() {
  const [theme, setTheme] = useState(() => localStorage.getItem("admin-theme") || "dark");
  // const [theme, setTheme] = useState('light');


  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="d-flex vh-100" data-bs-theme={theme}>
      <AdminHeader 
        onToggleTheme={toggleTheme} 
        currentTheme={theme} 
      />
      <AdminSideBar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;