import { Carousel } from "react-bootstrap";
import { FiImage } from "react-icons/fi";
import { isVideoSrc, mediaList } from "../utils";
import "./PreviewCarousel.css";

export default function PreviewCarousel({ item }) {
  const list = mediaList(item);

  if (!list.length) {
    return (
      <div
        className="preview-carousel-frame media-placeholder"
        style={{ background: item.lookFallback }}
      >
        <FiImage size={36} />
        <span className="small mt-2">No media yet</span>
      </div>
    );
  }

  return (
    <div className="preview-carousel-frame">
      <Carousel
        interval={null}
        indicators={list.length > 1}
        controls={list.length > 1}
        variant="dark"
        className="h-100 preview-bs-carousel"
      >
        {list.map((m, idx) => (
          <Carousel.Item key={idx} className="h-100">
            {isVideoSrc(m.src) ? (
              <video
                src={m.src}
                className="d-block w-100 h-100 object-fit-cover"
                controls
                playsInline
                muted
                loop
              />
            ) : (
              <img
                src={m.src}
                className="d-block w-100 h-100 object-fit-cover"
                alt={`${item.productName} ${idx + 1}`}
              />
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}