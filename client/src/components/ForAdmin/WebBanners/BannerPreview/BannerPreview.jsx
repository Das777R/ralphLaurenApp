import { useEffect, useState } from "react";
import {
  GRADIENTS,
  isVideoUrl,
} from "../../../../context/admin/webbanner/BannerContext";
import "./BannerPreview.css";

// Inline layout so the media shows even if the stylesheet has no .banner-media rule
const mediaStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

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
    ? undefined
    : GRADIENTS[(b.gradient ?? 0) % GRADIENTS.length];

  return (
    <div className="preview-stage">
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
          ...(background ? { background } : {}),
        }}
      >
        {hasMedia &&
          (isVideo ? (
            <video
              key={b.imageUrl}
              className="banner-media"
              style={mediaStyle}
              src={b.imageUrl}
              muted
              loop
              autoPlay
              playsInline
              onError={() => setFailed(true)}
            />
          ) : (
            <img
              className="banner-media"
              style={mediaStyle}
              src={b.imageUrl}
              alt={b.title || "Banner"}
              onError={() => setFailed(true)}
            />
          ))}
        <div className="banner-overlay" style={{ position: "relative", zIndex: 1 }}>
          {b.brand && <div className="banner-brand">{b.brand}</div>}
          <div className="banner-title">{b.title || "Banner title"}</div>
          {b.subtitle && <div className="banner-sub">{b.subtitle}</div>}
          {b.cta && <span className="banner-cta">{b.cta}</span>}
        </div>
      </div>
    </div>
  );
}