import { useEffect, useState } from "react";
import { FiImage, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { isVideoSrc } from "../../../../../context/admin/utils";
import "./ProductCardMedia.css";

const SLIDE_INTERVAL = 3000;

export default function ProductCardMedia({ item, hovered }) {
  const slides = item.slideImage?.length ? item.slideImage : [];
  const showCarousel = hovered && slides.length > 0;
  const [index, setIndex] = useState(0);

  // Back to the first slide when the mouse leaves
  useEffect(() => {
    if (!hovered) setIndex(0);
  }, [hovered]);

  // Auto-advance while hovered (restarts after each change, including manual clicks)
  useEffect(() => {
    if (!showCarousel || slides.length < 2) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_INTERVAL
    );
    return () => clearTimeout(timer);
  }, [showCarousel, slides.length, index]);

  const go = (e, dir) => {
    e.stopPropagation(); // don't trigger the card's preview click
    e.preventDefault();
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const current = slides[index];

  return (
    <div className="product-box-img-container-carousel">
      {/* Base image */}
      {item.lookImage ? (
        <img
          src={item.lookImage}
          alt={item.productName}
          className={`fade-element ${showCarousel ? "is-hidden" : "is-visible"}`}
        />
      ) : (
        <div
          className={`fade-element media-placeholder ${
            showCarousel ? "is-hidden" : "is-visible"
          }`}
          style={{ background: item.lookFallback }}
        >
          <FiImage size={28} />
        </div>
      )}

      {/* Slide layer (only the active slide is mounted) */}
      {slides.length > 0 && (
        <div
          className={`product-box-carousel fade-element ${
            showCarousel ? "is-visible" : "is-hidden"
          }`}
        >
          {current &&
            (isVideoSrc(current) ? (
              showCarousel && (
                <video
                  key={index}
                  src={current}
                  className="product-box-slide"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )
            ) : (
              <img
                key={index}
                src={current}
                alt={`${item.productName} slide ${index + 1}`}
                className="product-box-slide"
              />
            ))}

          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="product-box-nav product-box-nav-prev"
                onClick={(e) => go(e, -1)}
                aria-label="Previous slide"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="product-box-nav product-box-nav-next"
                onClick={(e) => go(e, 1)}
                aria-label="Next slide"
              >
                <FiChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}