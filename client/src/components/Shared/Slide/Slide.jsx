
import { useEffect, useMemo, useState } from "react";
import { Carousel } from "react-bootstrap";
import { FiPause, FiPlay } from "react-icons/fi";
import api from "../../../api/api.js";
import "./Slide.css";

// Your Render backend URL
const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
).replace(/\/api\/?$/, "");

// Supported video formats
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;

// Check whether media is a video
const isVideoUrl = (url = "") => {
  return VIDEO_EXT.test(url.split(/[?#]/)[0]);
};

// Get the actual URL from a Cloudinary URL or media object
const toUrl = (media) => {
  const value =
    typeof media === "string"
      ? media
      : media?.url || media?.secure_url || "";

  if (!value || typeof value !== "string") return "";

  // Cloudinary URLs and other absolute URLs
  if (/^(https?:|blob:|data:)/i.test(value)) {
    return value;
  }

  // Relative URLs served by your backend
  return `${API_ORIGIN}/${value.replace(/^\/+/, "")}`;
};

// Convert API data into a consistent slide structure
const toSlide = (entry, index) => {
  const mediaList = Array.isArray(entry.media)
    ? entry.media
    : entry.media
      ? [entry.media]
      : [];

  const mediaUrls = mediaList.map(toUrl).filter(Boolean);

  const mediaUrl = mediaUrls[0] || "";

  return {
    id: entry._id || `slide-${index}`,
    label: entry.brand || `Slide ${index + 1}`,
    title: entry.title || "",
    text: entry.description || "",
    cta: entry.cta || "Shop now",
    link: entry.link || "/",
    forMobile: Boolean(entry.forMobile),
    mediaUrl,
    isVideo: isVideoUrl(mediaUrl),
    thumb: toUrl(entry.thumb),
  };
};

export default function Slide({ interval = 6000, url }) {
  const [slideData, setSlideData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const [playing, setPlaying] = useState(() => {
    if (typeof window === "undefined") return false;

    return !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  });

  // Fetch slides from backend
  useEffect(() => {
    if (!url) {
      setSlideData([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchSlides = async () => {
      setIsLoading(true);

      try {
        const res = await api.get(url);

        // Support common API response structures
        const data =
          res.data?.data ??
          res.data?.slides ??
          [];

        if (!Array.isArray(data)) {
          throw new Error("Invalid slide API response");
        }

        if (!cancelled) {
          setSlideData(data);
        }

      } catch (error) {
        console.error("Failed to fetch slides:", error);

        if (!cancelled) {
          setSlideData([]);
        }

      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchSlides();

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Convert API data and filter for desktop/mobile
  const slides = useMemo(() => {
    const allSlides = slideData
      .map(toSlide)
      .filter((slide) => slide.mediaUrl);

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767.98px)").matches;

    const matchingSlides = allSlides.filter(
      (slide) => slide.forMobile === isMobile
    );

    return matchingSlides.length ? matchingSlides : allSlides;
  }, [slideData]);

  // Reset carousel index when slides change
  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  const total = slides.length;

  const next = () => {
    if (total > 1) {
      setIndex((current) => (current + 1) % total);
    }
  };

  const hasTabs = slides.some((slide) => slide.thumb);

  // Loading state
  if (isLoading) {
    return (
      <div
        className="d-flex w-100 justify-content-center align-items-center"
        style={{ height: "20rem" }}
      >
        <div
          className="spinner-grow text-dark"
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!total) return null;

  return (
    <section className="ads-section" aria-label="Featured brands">

      {/* Main carousel */}
      <Carousel
        className="ads-carousel"
        activeIndex={index}
        onSelect={(selectedIndex) => setIndex(selectedIndex)}
        controls={false}
        indicators={false}
        interval={null}
        pause={false}
        fade
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>

            {/* Image or video */}
            {slide.isVideo ? (
              <video
                className="ads-media"
                src={slide.mediaUrl}
                muted
                loop
                autoPlay={playing}
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                className="ads-media"
                src={slide.mediaUrl}
                alt={slide.title || slide.label}
                loading="eager"
              />
            )}

            {/* Overlay */}
            <div className="ads-scrim position-absolute" />

            {/* Content */}
            <div className="d-flex w-100 justify-content-center">
              <div className="ads-content text-center position-absolute">

                {slide.title && (
                  <h2 className="ads-title">
                    {slide.title}
                  </h2>
                )}

                {slide.text && (
                  <div className="ads-text my-3">
                    {slide.text}
                  </div>
                )}

                <a
                  className="ads-cta font-monospace fw-bold"
                  href={slide.link}
                >
                  {slide.cta}
                </a>

              </div>
            </div>

          </Carousel.Item>
        ))}
      </Carousel>

      {/* Brand tabs */}
      {hasTabs && (
        <div
          className="ads-tabs d-none d-md-block rounded-pill"
          role="tablist"
          aria-label="Choose a brand"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`ads-tab rounded-pill ${
                i === index ? "active" : ""
              }`}
              onClick={() => setIndex(i)}
            >
              {slide.thumb && (
                <img
                  className="ads-tab-thumb rounded-circle"
                  src={slide.thumb}
                  alt=""
                />
              )}

              <span>{slide.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Counter, progress bar and controls */}
      <div className="ads-bar">

        <div className="ads-count">
          <span>{index + 1}</span>
          <i aria-hidden="true" />
          <span>{total}</span>
        </div>

        <div className="ads-track bg-black">
          {total > 1 && (
            <div
              key={`${index}-${playing}`}
              className="ads-fill"
              style={{
                animationDuration: `${interval}ms`,
                animationPlayState: playing ? "running" : "paused",
              }}
              onAnimationEnd={next}
            />
          )}
        </div>

        <button
          type="button"
          className="ads-toggle"
          onClick={() => setPlaying((previous) => !previous)}
          aria-label={
            playing ? "Pause slideshow" : "Play slideshow"
          }
        >
          {playing ? <FiPause /> : <FiPlay />}
        </button>

      </div>
    </section>
  );
}
