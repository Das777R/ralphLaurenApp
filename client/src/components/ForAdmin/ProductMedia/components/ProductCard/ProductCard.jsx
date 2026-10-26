import { Form, Dropdown } from "react-bootstrap";
import { FiMoreHorizontal, FiEye, FiTrash2 } from "react-icons/fi";
import { useProductMedia } from "../../../../../context/admin/ProductMediaContext";
import ProductCardMedia from "../ProductCardMedia/ProductCardMedia";
import { formatImgSrc } from "../../../../../context/Look/LookHelpers";
import "./ProductCard.css";

export default function ProductCard({ item }) {
  console.log("item",item);
  const {
    selected,
    toggleOne,
    hoveredId,
    setHoveredId,
    setPreviewId,
    setConfirmIds,
  } = useProductMedia();

  const isSel = selected.has(item.id);
  const hovered = hoveredId === item.id;
  
  return (
    <div
      className={`ui-card media-card product-box-card ${isSel ? "selected" : ""}`}
      onMouseEnter={() => setHoveredId(item.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className="media-frame-wrap position-relative">
        <button
          type="button"
          className="media-frame border-0 p-0 w-100"
          onClick={() => setPreviewId(item.id)}
          aria-label={`Preview ${item.productName}`}
        >
          <ProductCardMedia item={item} hovered={hovered} />
        </button>

        <Form.Check
          className="media-check"
          checked={isSel}
          onChange={() => toggleOne(item.id)}
          aria-label={`Select ${item.productName}`}
        />

        {item.isTrending && <span className="pill pill-success bg-danger media-badge">Trending</span>}

        <div className={`color-quicklook-div ${hovered ? "d-flex" : "d-none"}`}>
          <div className="d-flex gap-2 align-items-center">
            <div className="product-colors-div rounded-circle">
              {item.colorImage ? (
                <img src={item.colorImage} alt={item.colorName} className="color-dot" />
              ) : (
                <div className="color-dot" style={{ background: item.colorFallback }} />
              )}
            </div>
            <span className="small product-color-label">{item.colorName}</span>
          </div>
          <span className="quickLook text-uppercase">Preview</span>
        </div>
      </div>

      <div className="product-info-container pe-2 ps-3 py-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div style={{ minWidth: 0 }}>
            <div className="product-box-name-text fw-semibold text-truncate">{item.productName}</div>
            <div className="brand-name small text-uppercase">{item.brand}</div>
            <div className="product-box-price small fw-semibold mt-1">
              {item.price ? `₹ ${item.price}` : "—"}
            </div>
            <div className="small text-muted mt-1 text-capitalize">
              {item.kind} · {item.category}
            </div>
            <div className="d-flex flex-wrap gap-1 mt-2">
              {item.sizes?.map((s) => (
                <span key={s} className="size-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle as="button" type="button" className="icon-btn flex-shrink-0" aria-label="Product actions">
              <FiMoreHorizontal size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow-sm" popperConfig={{ strategy: "fixed" }}>
              <Dropdown.Item
                className="d-flex align-items-center gap-2"
                onClick={() => setPreviewId(item.id)}
              >
                <FiEye size={14} /> Preview
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                className="d-flex align-items-center gap-2 text-danger"
                onClick={() => setConfirmIds([item.id])}
              >
                <FiTrash2 size={14} /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}