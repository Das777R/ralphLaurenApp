import { useEffect, useState } from "react";
import {
  GRADIENTS,
  isVideoUrl,
} from "../../../../context/admin/webbanner/BannerContext";
import "./BannerPreview.css";


const fillStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  display: "block",
};


const mediaStyle = {
  ...fillStyle,
  objectFit: "contain",
  objectPosition: "center",
  zIndex: 1,
};


const backdropStyle = {
  ...fillStyle,
  objectFit: "cover",
  filter: "blur(24px) brightness(0.7)",
  transform: "scale(1.15)", // hides the soft edges the blur creates
  zIndex: 0,
  pointerEvents: "none",
};

const MEDIA_BG = "#0f1115";

export default function BannerPreview({ b, rounded = false }) {
  const [failed, setFailed] = useState(false);

  // Reset the error state whenever the media changes
  useEffect(() => {
    setFailed(false);
  }, [b.imageUrl]);

  const isMobile = b.device === "mobile";
  const hasMedia = Boolean(b.imageUrl) && !failed;
  const isVideo = hasMedia && (b.mediaType === "video" || isVideoUrl(b.imageUrl));
  const background = hasMedia
    ? MEDIA_BG
    : GRADIENTS[(b.gradient ?? 0) % GRADIENTS.length];

  return (
    <div className="preview-stage bg-body">
      <div
        className={[
          "banner-preview",
          rounded ? "rounded-all" : "",
          isMobile ? "is-mobile" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          position: "relative",
          overflow: "hidden",
          background,
        }}
      >
        {hasMedia &&
          (isVideo ? (
            <video
              key={b.imageUrl}
              className="banner-media object-fit-cover"
              style={mediaStyle}
              src={b.imageUrl}
              muted
              loop
              autoPlay
              playsInline
              onError={() => setFailed(true)}
            />
          ) : (
            <>
              <img
                key={`bg-${b.imageUrl}`}
                src={b.imageUrl}
                alt=""
                aria-hidden="true"
                style={backdropStyle}
              />
              <img
                key={b.imageUrl}
                className="banner-media"
                style={mediaStyle}
                src={b.imageUrl}
                alt={b.title || "Banner"}
                onError={() => setFailed(true)}
              />
            </>
          ))}

        <div
          className="banner-overlay"
          style={{ position: "relative", zIndex: 2 }}
        >
          {b.brand && <div className="banner-brand">{b.brand}</div>}
          <div className="banner-title">{b.title || "Banner title"}</div>
          {b.subtitle && <div className="banner-sub">{b.subtitle}</div>}
          {b.cta && <span className="banner-cta">{b.cta}</span>}
        </div>
      </div>
    </div>
  );
}