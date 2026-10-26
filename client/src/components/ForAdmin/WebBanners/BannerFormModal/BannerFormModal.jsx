import { Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import {
  useBanners,
  PLACEMENTS,
  getSectionsForPlacement,
  needsThumb,
} from "../../../../context/admin/webbanner/BannerContext";
import BannerPreview from "../BannerPreview/BannerPreview";
import ImageDrop from "../ImageDrop/ImageDrop";
import "./BannerFormModal.css";

function BannerFormModal() {
  const {
    showForm,
    editing,
    form,
    setForm,
    errors,
    setErrors,
    closeForm,
    setField,
    handleSave,
    discardDraftImage,
    saving,
  } = useBanners();

  const sectionOptions = getSectionsForPlacement(form.placement);
  const showThumb = needsThumb(form.placement, form.section);

  return (
    <Modal show={showForm} onHide={closeForm} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-5">
          {editing ? "Edit banner" : "Add banner"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-2 small text-muted">Live preview</div>
        <div className="mb-4">
          <BannerPreview b={form} rounded />
        </div>

        {errors.form && (
          <div className="alert alert-danger small py-2">{errors.form}</div>
        )}

        <Row className="g-3">
          <Col xs={12}>
            <Form.Label className="small fw-semibold d-block mb-2">
              Media target
            </Form.Label>
            <div className="device-switch d-flex align-items-center gap-3">
              <span
                className={`small ${
                  form.device === "desktop" ? "fw-semibold" : "text-muted"
                }`}
              >
                <FiMonitor size={14} className="me-1" />
                Desktop
              </span>
              <Form.Check
                type="switch"
                id="device-switch"
                role="switch"
                checked={form.device === "mobile"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    device: e.target.checked ? "mobile" : "desktop",
                  }))
                }
                className="m-0"
              />
              <span
                className={`small ${
                  form.device === "mobile" ? "fw-semibold" : "text-muted"
                }`}
              >
                <FiSmartphone size={14} className="me-1" />
                Mobile
              </span>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <Form.Label className="small fw-semibold">Title</Form.Label>
            <Form.Control
              value={form.title}
              onChange={setField("title")}
              isInvalid={!!errors.title}
              placeholder="Festive Sale: Up to 60% Off"
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Col>

          <Col xs={12} md={6}>
            <Form.Label className="small fw-semibold">
              Subtitle / description
            </Form.Label>
            <Form.Control
              value={form.subtitle}
              onChange={setField("subtitle")}
              placeholder="Ethnic wear, denim and more"
            />
          </Col>

          <Col xs={12} md={4}>
            <Form.Label className="small fw-semibold">Button label</Form.Label>
            <Form.Control
              value={form.cta}
              onChange={setField("cta")}
              placeholder="Shop now"
            />
          </Col>

          <Col xs={12} md={4}>
            <Form.Label className="small fw-semibold">Brand</Form.Label>
            <Form.Control
              value={form.brand || ""}
              onChange={setField("brand")}
              placeholder="e.g. Ralph Lauren"
            />
          </Col>

          <Col xs={12} md={4}>
            <Form.Label className="small fw-semibold">Link</Form.Label>
            <Form.Control
              value={form.link}
              onChange={setField("link")}
              isInvalid={!!errors.link}
              placeholder="/sale"
            />
            <Form.Control.Feedback type="invalid">
              {errors.link}
            </Form.Control.Feedback>
          </Col>

          <Col xs={12} md={6}>
            <Form.Label className="small fw-semibold">Placement</Form.Label>
            <Form.Select
              value={form.placement}
              onChange={setField("placement")}
            >
              {Object.entries(PLACEMENTS).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={6}>
            <Form.Label className="small fw-semibold">Section</Form.Label>
            <Form.Select
              value={form.section}
              onChange={setField("section")}
              isInvalid={!!errors.section}
            >
              {Object.entries(sectionOptions).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.section}
            </Form.Control.Feedback>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Label className="small fw-semibold">Start date</Form.Label>
            <Form.Control
              type="date"
              value={form.start}
              onChange={setField("start")}
              isInvalid={!!errors.start}
            />
            <Form.Control.Feedback type="invalid">
              {errors.start}
            </Form.Control.Feedback>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Label className="small fw-semibold">
              End date (optional)
            </Form.Label>
            <Form.Control
              type="date"
              value={form.end}
              min={form.start}
              onChange={setField("end")}
              isInvalid={!!errors.end}
            />
            <Form.Control.Feedback type="invalid">
              {errors.end}
            </Form.Control.Feedback>
          </Col>

          <Col xs={12}>
            <Form.Label className="small fw-semibold">
              Banner image / video
            </Form.Label>
            <ImageDrop
              value={form.imageUrl}
              name={form.imageName}
              hint={PLACEMENTS[form.placement]?.size || "1920 x 600"}
              onChange={(url, name, file) => {
                discardDraftImage(form.imageUrl);
                setForm((f) => ({
                  ...f,
                  imageUrl: url,
                  imageName: name,
                  file,
                  mediaType: file?.type?.startsWith("video/") ? "video" : "image",
                }));
              }}
              onRemove={() => {
                discardDraftImage(form.imageUrl);
                setForm((f) => ({
                  ...f,
                  imageUrl: null,
                  imageName: "",
                  file: undefined,
                  mediaType: "image",
                }));
              }}
            />
            {errors.image && (
              <div className="small text-danger mt-1">{errors.image}</div>
            )}
          </Col>

          {/* Tab thumbnail — landing/rlc-trend, and carousel/trend on nav pages */}
          {showThumb && (
            <Col xs={12}>
              <Form.Label className="small fw-semibold">
                Tab thumbnail (optional)
              </Form.Label>
              <ImageDrop
                value={form.thumbUrl}
                name={form.thumbName}
                hint="200 x 200 (shown in the round brand tab)"
                onChange={(url, name, file) => {
                  if (file && !file.type?.startsWith("image/")) {
                    // thumbnails must be images, not videos
                    discardDraftImage(url);
                    setErrors((e) => ({
                      ...e,
                      thumb: "Thumbnail must be an image.",
                    }));
                    return;
                  }
                  discardDraftImage(form.thumbUrl);
                  setErrors((e) => ({ ...e, thumb: undefined }));
                  setForm((f) => ({
                    ...f,
                    thumbUrl: url,
                    thumbName: name,
                    thumbFile: file,
                  }));
                }}
                onRemove={() => {
                  discardDraftImage(form.thumbUrl);
                  setForm((f) => ({
                    ...f,
                    thumbUrl: null,
                    thumbName: "",
                    thumbFile: undefined,
                  }));
                }}
              />
              {errors.thumb && (
                <div className="small text-danger mt-1">{errors.thumb}</div>
              )}
              <div className="small text-muted mt-1">
                If left empty, the first image of the banner is used.
              </div>
            </Col>
          )}

          {/* Optional background image (image only) */}
          <Col xs={12}>
            <Form.Label className="small fw-semibold">
              Background image (optional)
            </Form.Label>
            <ImageDrop
              value={form.bgUrl}
              name={form.bgName}
              hint={PLACEMENTS[form.placement]?.size || "1920 x 600"}
              onChange={(url, name, file) => {
                if (file && !file.type?.startsWith("image/")) {
                  // background must be an image, not a video
                  discardDraftImage(url);
                  setErrors((e) => ({
                    ...e,
                    background: "Background must be an image.",
                  }));
                  return;
                }
                discardDraftImage(form.bgUrl);
                setErrors((e) => ({ ...e, background: undefined }));
                setForm((f) => ({
                  ...f,
                  bgUrl: url,
                  bgName: name,
                  bgFile: file,
                }));
              }}
              onRemove={() => {
                discardDraftImage(form.bgUrl);
                setErrors((e) => ({ ...e, background: undefined }));
                setForm((f) => ({
                  ...f,
                  bgUrl: null,
                  bgName: "",
                  bgFile: undefined,
                }));
              }}
            />
            {errors.background && (
              <div className="small text-danger mt-1">{errors.background}</div>
            )}
            <div className="small text-muted mt-1">
              Leave empty to skip. Images only.
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={closeForm} disabled={saving}>
          Cancel
        </Button>
        <Button className="btn-ink" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving…
            </>
          ) : editing ? (
            "Save changes"
          ) : (
            "Create banner"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BannerFormModal