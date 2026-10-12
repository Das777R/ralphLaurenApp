import { NavLink } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import {  FaImages } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import "./ProductsNav.css";

const linkClass = ({ isActive }) => `nav-link side-link${isActive ? " active" : ""}`;



function ProductsNav() {
  const { adminId } = useParams();

  const productPath =  adminId ? `/admin/products/${adminId}`: '/admin/products';
  const customerPath = adminId ? `/admin/customers/${adminId}` : '/admin/customers';
  const mediaPath = adminId ? `/admin/media/${adminId}` : '/admin/media';

  return (
    <nav className="nav flex-column  justify-content-start gap-1 flex-grow-1">

      <NavLink to={productPath} className={linkClass}>
         <IoBag className="text-success"/>
        <span className="user-select-none">Products</span>
      </NavLink>

      <NavLink to={customerPath} className={linkClass}>
        <FaUserGroup className="text-warning"/><span className="user-select-none">Customers</span>
      </NavLink>

      <NavLink to={mediaPath} className={linkClass}>
        <FaImages className="text-danger" /><span className="user-select-none">Media</span>
      </NavLink>
    </nav>
  );
}

export default ProductsNav;