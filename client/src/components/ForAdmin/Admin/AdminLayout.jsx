import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="d-flex min-vh-100">
      <AdminHeader />
      <AdminSideBar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;