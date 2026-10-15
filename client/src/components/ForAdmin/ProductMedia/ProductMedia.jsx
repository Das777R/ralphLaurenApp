import { Button } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";
import "../../../styles/AdminUI.css";
import "./ProductMedia.css";
import { ProductMediaProvider, useProductMedia } from "./ProductMediaContext";
import ProductStats from "./components/ProductStats";
import ProductToolbar from "./components/ProductToolbar";
import ProductGrid from "./components/ProductGrid";
import ProductList from "./components/ProductList";
import PreviewModal from "./components/PreviewModal";
import UploadModal from "./components/UploadModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

function ProductMediaPage() {
  const { openUpload, view } = useProductMedia();

  return (
    <div>
      <div className="page-head d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1>Product catalog</h1>
          <p>Create variants with look image, slides, color, sizes, kind &amp; category.</p>
        </div>
        <Button className="btn-ink d-flex align-items-center gap-2" onClick={openUpload}>
          <FiUploadCloud size={16} />
          Add product
        </Button>
      </div>

      <ProductStats />
      <ProductToolbar />
      {view === "grid" ? <ProductGrid /> : <ProductList />}

      <PreviewModal />
      <UploadModal />
      <DeleteConfirmModal />
    </div>
  );
}

export default function ProductMedia() {
  return (
    <ProductMediaProvider>
      <ProductMediaPage />
    </ProductMediaProvider>
  );
}