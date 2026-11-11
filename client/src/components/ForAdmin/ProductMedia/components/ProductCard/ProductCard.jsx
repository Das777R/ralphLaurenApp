import { Form, Dropdown } from "react-bootstrap";
import { FiMoreHorizontal, FiEye, FiTrash2 } from "react-icons/fi";
import { useProductMedia } from "../../../../../context/admin/ProductMediaContext";
import ProductCardMedia from "../ProductCardMedia/ProductCardMedia";
import "./ProductCard.css";

export default function ProductCard({ item }) {
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

  // Support multiple colors if present, otherwise fall back to the single color
  const colors = item.colors?.length
    ? item.colors
    : item.colorImage
    ? [item.colorImage]
    : [];

  const renderSwatch = (clrImg, i) => (
    <div
      className="product-colors-div rounded-circle d-flex justify-content-center align-items-center"
      key={clrImg || i}
    >
      <img
        src={clrImg}
        alt={item.colorName || "Color variant"}
        className="w-100 h-100 rounded-circle"
      />
    </div>
  );

  return (
    <div
      className={`ui-card media-card product-box-card position-relative ${
        isSel ? "selected" : ""
      }`}
    >
      {/* Image & Overlay Container */}
      <div
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="media-frame-wrap position-relative">
          <div
            role="button"
            tabIndex={0}
            className="media-frame border-0 p-0 w-100"
            onClick={() => setPreviewId(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPreviewId(item.id);
              }
            }}
            aria-label={`Preview ${item.productName}`}
          >
            <ProductCardMedia item={item} hovered={hovered} />
          </div>

          <Form.Check
            className="media-check"
            checked={isSel}
            onChange={() => toggleOne(item.id)}
            aria-label={`Select ${item.productName}`}
          />

          {/* Quick Look & Color Swatches Overlay (anchored to the image's bottom edge) */}
          <div
            className={`w-100 justify-content-between px-3 py-2 position-absolute color-quicklook-div ${
              hovered ? "d-lg-flex is-visible" : "is-hidden"
            }`}
          >
            <div className="d-flex gap-2 align-items-center">
              {colors.slice(0, 4).map(renderSwatch)}
              {colors.length > 4 && <div>+{colors.length - 4}</div>}
            </div>

            <div
              className="quickLook text-uppercase d-flex align-items-center justify-content-center"
              onClick={() => setPreviewId(item.id)}
            >
              Preview
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="product-info-container pe-2 ps-3 py-3">
        <div className="product-box-name-container d-flex justify-content-between">
          <h4
            className="product-box-name-text-admin w-100 text-truncate"
            style={{ minWidth: 0 }}
          >
            {item.productName}
          </h4>

          <Dropdown align="end">
            <Dropdown.Toggle
              as="button"
              type="button"
              className="icon-btn flex-shrink-0"
              aria-label="Product actions"
            >
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

        <div className="brand-name text-uppercase">{item.brand}</div>
        <div className="product-box-price-admin">
          {item.price ? `₹ ${item.price}` : "—"}
        </div>
        <div className="product-box-trending-text text-uppercase fw-semibold">
          {item.isTrending ? "Trending" : null}
        </div>

        <div className="small text-body-secondary mt-1 text-capitalize">
          {item.kind} · {item.category}
        </div>

        <div className="d-flex flex-wrap gap-1 mt-2">
          {item.sizes?.map((s) => (
            <span key={s} className="size-chip">
              {s}
            </span>
          ))}
        </div>

        {/* Mobile swatches (overlay is hidden below lg) */}
        <div className="gap-2 d-flex d-lg-none mt-2">
          {colors.map(renderSwatch)}
        </div>

        <div className="product-box-same-color-text mt-3 text-capitalize d-flex gap-1">
          <span className="d-block">{colors.length}</span>
          <span className="d-block">colors available</span>
        </div>
      </div>
    </div>
  );
}