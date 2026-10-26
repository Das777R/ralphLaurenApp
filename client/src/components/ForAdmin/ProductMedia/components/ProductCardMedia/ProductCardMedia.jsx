import { FiImage } from "react-icons/fi";
import { isVideoSrc } from "../../../../../context/admin/utils";
import "./ProductCardMedia.css";


export default function ProductCardMedia({ item, hovered }) {
  const slides = item.slideImage?.length ? item.slideImage : [];
 console.log(slides);
  const showCarousel = hovered && slides.length > 0;
  const carouselId = `card-carousel-${item.id}`;

  return (
    <div className="product-box-img-container-carousel position-relative overflow-hidden">
      {item.lookImage ? (
        <img
          src={item.lookImage}
          alt={item.productName}
          className={`w-100 object-fit-cover fade-element ${
            showCarousel ? "is-hidden" : "is-visible"
          }`}
        />
      ) : (
        <div
          className={`w-100 fade-element media-placeholder ${
            showCarousel ? "is-hidden" : "is-visible"
          }`}
          style={{ background: item.lookFallback }}
        >
          <FiImage size={28} />
        </div>
      )}

      <div
        id={carouselId}
        className={`carousel carousel-dark slide product-box-carousel fade-element ${
          showCarousel ? "is-visible" : "is-hidden"
        }`}
        data-bs-ride="carousel"
      >
        <div className="carousel-inner product-box-carousel-inner">
          {slides.map((srcLink, slideIndex) => (
            <div
              className={`carousel-item product-box-carousel-item ${
                slideIndex === 0 ? "active" : ""
              }`}
              key={slideIndex}
            >
              {isVideoSrc(srcLink) ? (
                <video
                  src={srcLink}
                  className="d-block w-100 object-fit-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={srcLink} className="d-block w-100 object-fit-cover" alt="Product" />
              )}
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <>
            <button
              className="carousel-control-prev product-box-carousel-control-prev"
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" />
            </button>
            <button
              className="carousel-control-next product-box-carousel-control-next"
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}