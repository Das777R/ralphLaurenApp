import { Modal, Row, Col, Button } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import { useProductMedia } from "../ProductMediaContext";
import { formatDate } from "../utils";
import PreviewCarousel from "./PreviewCarousel";
import "./PreviewModal.css";

export default function PreviewModal() {
  const { previewItem, setPreviewId, setConfirmIds } = useProductMedia();

  return (
    <Modal
      show={!!previewItem}
      onHide={() => setPreviewId(null)}
      size="xl"
      centered
      className="product-preview-modal"
    >
      {previewItem && (
        <>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-6 product-box-name-text">
              {previewItem.productName}
              {previewItem.colorName ? ` · ${previewItem.colorName}` : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Row className="g-0">
              <Col md={5} className="p-4 border-end">
                <div className="brand-name small text-muted text-uppercase mb-1">
                  {previewItem.brand}
                </div>
                <h4 className="fw-bold mb-2 product-box-name-text">{previewItem.productName}</h4>
                <div className="product-box-price fs-5 mb-2">
                  {previewItem.price ? `₹ ${previewItem.price}` : "—"}
                </div>
                {previewItem.isTrending && (
                  <div className="trending-text text-uppercase fw-semibold mb-3">Trending</div>
                )}
                {previewItem.description && (
                  <p className="small text-muted mb-3">{previewItem.description}</p>
                )}

                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-colors-div rounded-circle">
                    {previewItem.colorImage ? (
                      <img
                        src={previewItem.colorImage}
                        alt={previewItem.colorName}
                        className="w-100 h-100 rounded-circle border border-1 border-dark"
                      />
                    ) : (
                      <div
                        className="w-100 h-100 rounded-circle border border-1 border-dark"
                        style={{ background: previewItem.colorFallback }}
                      />
                    )}
                  </div>
                  <span className="small product-color-label">{previewItem.colorName}</span>
                </div>

                <dl className="small mb-0 preview-meta">
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <dt className="mb-0 text-muted">Kind</dt>
                    <dd className="mb-0 text-capitalize">{previewItem.kind}</dd>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <dt className="mb-0 text-muted">Category</dt>
                    <dd className="mb-0 text-capitalize">{previewItem.category}</dd>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <dt className="mb-0 text-muted">Sizes</dt>
                    <dd className="mb-0">{previewItem.sizes?.join(", ") || "—"}</dd>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <dt className="mb-0 text-muted">Uploaded</dt>
                    <dd className="mb-0">{formatDate(previewItem.uploaded)}</dd>
                  </div>
                </dl>

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setConfirmIds([previewItem.id]);
                    setPreviewId(null);
                  }}
                >
                  <FiTrash2 size={14} className="me-1" /> Delete
                </Button>
              </Col>
              <Col md={7} className="bg-light">
                <PreviewCarousel item={previewItem} />
              </Col>
            </Row>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
}