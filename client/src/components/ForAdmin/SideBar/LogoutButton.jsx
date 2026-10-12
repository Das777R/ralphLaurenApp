import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/logout");
      if (res?.data?.success) {
        navigate("/");
      }
    }catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <a
      href="#"
      className="nav-link side-link parent mt-auto user-select-none"
      onClick={handleLogout}
    >
      <CiLogout />
      <span>Log out</span>
    </a>
  );
}

export default LogoutButton;