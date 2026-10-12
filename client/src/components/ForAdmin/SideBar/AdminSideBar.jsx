import LogoutButton from "./LogoutButton";
import ProductsNav from "./ProductsNav";
import "./AdminSideBar.css";

function AdminSideBar() {


  return (
    <aside
      className="sidebar bg-body border-end collapse collapse-horizontal d-md-block"
      id="collapseWidthExample"
    >
      <div className="sidebar-inner d-flex flex-column">
        <ProductsNav />
        <LogoutButton />
      </div>
    </aside>
  );
}

export default AdminSideBar;