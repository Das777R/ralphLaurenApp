import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { FiImage, FiVideo, FiUploadCloud, FiX } from "react-icons/fi";
import { MAX_IMAGE_MB } from "../../../../context/admin/webbanner/BannerContext";


const MAX_VIDEO_MB = 50;

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;

export default function ImageDrop({ value, name, hint, onChange, onRemove }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  const isVideoName = VIDEO_EXT.test(name || "");

  const handleFile = (file) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return setError("Please choose an image (JPG, PNG, WebP) or a video (MP4, WebM).");
    }
    if (isImage && file.size > MAX_IMAGE_MB * 1024 * 1024) {
      return setError(`Image must be under ${MAX_IMAGE_MB} MB.`);
    }
    if (isVideo && file.size > MAX_VIDEO_MB * 1024 * 1024) {
      return setError(`Video must be under ${MAX_VIDEO_MB} MB.`);
    }

    setError("");
    onChange(URL.createObjectURL(file), file.name, file);
  };

  return (
    <div>
      {value ? (
        <div className="d-flex align-items-center justify-content-between gap-2 p-2 border rounded-1">
          <span className="small text-truncate d-flex align-items-center gap-2">
            {isVideoName ? <FiVideo size={16} /> : <FiImage size={16} />}
            {name || (isVideoName ? "Uploaded video" : "Uploaded image")}
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onRemove}
            className="d-flex align-items-center gap-1"
          >
            <FiX size={14} /> Remove
          </Button>
        </div>
      ) : (
        <div
          className={`dropzone ${over ? "over" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <FiUploadCloud size={26} className="text-primary mb-2" />
          <div className="fw-semibold small">Drag an image or video here or click to browse</div>
          <div className="small text-muted">
            Recommended {hint} px. Images (JPG/PNG/WebP) up to {MAX_IMAGE_MB} MB, videos
            (MP4/WebM) up to {MAX_VIDEO_MB} MB
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && <div className="small text-danger mt-2">{error}</div>}
    </div>
  );
}