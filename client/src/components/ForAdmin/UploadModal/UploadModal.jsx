import { useRef } from "react";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { FiUploadCloud, FiImage, FiAlertCircle, FiX } from "react-icons/fi";
import { useProductMedia } from "../ProductMediaContext";
import { IMAGE_TYPES, VIDEO_TYPES, MAX_IMAGE, MAX_VIDEO, MB, KINDS } from "../constants";
import { isVideoFile } from "../utils";
import "./UploadModal.css";

export default function UploadModal() {
  const {
    uploadOpen,
    setUploadOpen,
    form,
    setField,
    lookFile,
    setLookFile,
    colorFile,
    setColorFile,
    slideQueue,
    uploadError,
    dragOver,
    setDragOver,
    pickSingle,
    addSlides,
    removeSlide,
    handleUpload,
  } = useProductMedia();

  const lookInput = useRef(null);
  const colorInput = useRef(null);
  const slideInput = useRef(null);

  return (
    <Modal show={uploadOpen} onHide={() => setUploadOpen(false)} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-5">Add product variant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col md={8}>
            <Form.Label className="small fw-semibold">Product name *</Form.Label>
            <Form.Control
              value={form.productName}
              onChange={(e) => setField("productName", e.target.value)}
              placeholder="e.g. Slim Fit Polo"
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small fw-semibold">Brand</Form.Label>
            <Form.Control
              value={form.brand}
              onChange={(e) => setField("brand", e.target.value)}
              placeholder="Studio"
            />
          </Col>

          <Col md={4}>
            <Form.Label className="small fw-semibold">Price (₹)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="2499"
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small fw-semibold">Kind *</Form.Label>
            <Form.Select value={form.kind} onChange={(e) => setField("kind", e.target.value)}>
              <option value="">Select</option>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label className="small fw-semibold">Category *</Form.Label>
            <Form.Control
              type="text"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="e.g. slim, fit, classic"
            />
          </Col>

          <Col xs={12}>
            <Form.Label className="small fw-semibold">Description</Form.Label>
            <Form.Control
              type="text"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Short product description"
            />
          </Col>

          <Col md={6}>
            <Form.Label className="small fw-semibold">Color name *</Form.Label>
            <Form.Control
              value={form.colorName}
              onChange={(e) => setField("colorName", e.target.value)}
              placeholder="e.g. Navy"
            />
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <Form.Check
              type="switch"
              id="is-trending"
              label="Trending"
              checked={form.isTrending}
              onChange={(e) => setField("isTrending", e.target.checked)}
            />
          </Col>

          <Col xs={12}>
            <Form.Label className="small fw-semibold">Sizes *</Form.Label>
            <Form.Control
              type="text"
              value={form.sizesText}
              onChange={(e) => setField("sizesText", e.target.value)}
              placeholder="e.g. s, m, l, xl, xxl"
            />
            <div className="small text-muted mt-1">Comma-separated (saved as S, M, L…).</div>
          </Col>

          <Col md={6}>
            <Form.Label className="small fw-semibold">Look image *</Form.Label>
            <div
              className={`media-drop ${lookFile?.url ? "has-file" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => lookInput.current?.click()}
            >
              {lookFile?.url ? (
                <img src={lookFile.url} alt="" className="look-preview" />
              ) : (
                <>
                  <FiImage size={24} className="text-primary mb-1" />
                  <div className="small fw-semibold">Click to choose look image</div>
                </>
              )}
            </div>
            <input
              ref={lookInput}
              type="file"
              hidden
              accept={IMAGE_TYPES.join(",")}
              onChange={(e) => {
                pickSingle(e.target.files?.[0], setLookFile, { imagesOnly: true });
                e.target.value = "";
              }}
            />
            {lookFile?.error && <div className="small text-danger mt-1">{lookFile.error}</div>}
          </Col>

          <Col md={6}>
            <Form.Label className="small fw-semibold">Color image (swatch)</Form.Label>
            <div
              className={`media-drop ${colorFile?.url ? "has-file" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => colorInput.current?.click()}
            >
              {colorFile?.url ? (
                <img src={colorFile.url} alt="" className="look-preview" />
              ) : (
                <>
                  <FiImage size={24} className="text-primary mb-1" />
                  <div className="small fw-semibold">Color swatch image</div>
                </>
              )}
            </div>
            <input
              ref={colorInput}
              type="file"
              hidden
              accept={IMAGE_TYPES.join(",")}
              onChange={(e) => {
                pickSingle(e.target.files?.[0], setColorFile, { imagesOnly: true });
                e.target.value = "";
              }}
            />
            {colorFile?.error && <div className="small text-danger mt-1">{colorFile.error}</div>}
          </Col>

          <Col xs={12}>
            <Form.Label className="small fw-semibold">Slide images *</Form.Label>
            <div
              className={`media-drop slide-drop ${dragOver ? "over" : ""} ${
                slideQueue.length ? "has-files" : ""
              }`}
              role="button"
              tabIndex={0}
              onClick={() => slideInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addSlides(e.dataTransfer.files);
              }}
            >
              {slideQueue.length === 0 ? (
                <>
                  <FiUploadCloud size={28} className="text-primary mb-2" />
                  <div className="fw-semibold small">Drag slides here or click to browse</div>
                  <div className="small text-muted">
                    Images up to {MAX_IMAGE / MB} MB, videos up to {MAX_VIDEO / MB} MB
                  </div>
                </>
              ) : (
                <div className="slide-preview-grid" onClick={(e) => e.stopPropagation()}>
                  {slideQueue.map((q) => (
                    <div key={q.key} className={`slide-preview-item ${q.error ? "is-error" : ""}`}>
                      {q.error ? (
                        <div className="slide-preview-fallback">
                          <FiAlertCircle size={16} />
                        </div>
                      ) : q.url && isVideoFile(q.file) ? (
                        <video src={q.url} muted playsInline className="slide-preview-media" />
                      ) : q.url ? (
                        <img src={q.url} alt={q.file.name} className="slide-preview-media" />
                      ) : null}
                      <button
                        type="button"
                        className="slide-preview-remove"
                        onClick={() => removeSlide(q.key)}
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="slide-preview-add"
                    onClick={() => slideInput.current?.click()}
                  >
                    <FiUploadCloud size={18} />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>
            <input
              ref={slideInput}
              type="file"
              hidden
              multiple
              accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(",")}
              onChange={(e) => {
                addSlides(e.target.files);
                e.target.value = "";
              }}
            />
          </Col>
        </Row>
        {uploadError && <div className="small text-danger mt-3">{uploadError}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setUploadOpen(false)}>
          Cancel
        </Button>
        <Button className="btn-ink" onClick={handleUpload}>
          Save product
        </Button>
      </Modal.Footer>
    </Modal>
  );
}