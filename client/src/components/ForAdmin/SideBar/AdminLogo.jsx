import './AdminLogo.css';
import { Link } from 'react-router-dom';

function AdminLogo() {
  return (
    <Link className="admin-ralph-head-logo d-flex align-items-center text-decoration-none user-select-none flex-shrink-0">
      <img
        src="/icons/polo-ralph-lauren-seeklogo.png"
        className="admin-ralph-head-logo-img"
        alt="Polo Ralph Lauren"
      />
    </Link>
  );
}

export default AdminLogo;