import { Button, Spinner } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import {
  BannerProvider,
  useBanners,
} from "../../../context/admin/webbanner/BannerContext";
import StatsCards from "./StatsCards/StatsCards";
import BannerToolbar from "./BannerToolbar/BannerToolbar";
import BannerGrid from "./BannerGrid/BannerGrid";
import BannerFormModal from "./BannerFormModal/BannerFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal/DeleteConfirmModal";
import "../../../styles/AdminUI.css";
import "./WebBanners.css";

function WebBannersPage() {
  const { openCreate, loading, loadError, reload } = useBanners();

  return (
    <div>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Web Page Banners</h1>
          <p>Control the banners shown across your storefront.</p>
        </div>
        <Button
          className="btn-ink d-flex align-items-center gap-2"
          onClick={openCreate}
        >
          <FiPlus size={16} />
          Add Banner
        </Button>
      </div>

      {loadError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{loadError}</span>
          <Button variant="outline-danger" size="sm" onClick={reload}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading banners…
        </div>
      ) : (
        <>
          <StatsCards />
          <BannerToolbar />
          <BannerGrid />
        </>
      )}

      <BannerFormModal />
      <DeleteConfirmModal />
    </div>
  );
}

export default function WebBanners() {
  return (
    <BannerProvider>
      <WebBannersPage />
    </BannerProvider>
  );
}