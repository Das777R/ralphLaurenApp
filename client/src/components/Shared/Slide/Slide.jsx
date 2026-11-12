import { useEffect, useMemo, useState } from "react";
import { Carousel } from "react-bootstrap";
import { FiPause, FiPlay } from "react-icons/fi";
import api from "../../../api/api.js";
import "./Slide.css";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;

const isVideoUrl = (url) => VIDEO_EXT.test(url.split(/[?#]/)[0]);
const toUrl = (media) =>
  typeof media === "string" ? media : media?.secure_url || media?.url || "";

const toSlide = (entry, index) => {
  const first = Array.isArray(entry.media) ? entry.media[0] : entry.media;
  const mediaUrl = toUrl(first);
  // console.log(mediaUrl)
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

const isMobileScreen = () =>
  window.matchMedia("(max-width: 767.98px)").matches;

export default function Slide({ interval = 6000, url }) {
  const [slideData, setSlideData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!url) {
      console.warn("Slide: no `url` prop received");
      setSlideData([]);
      setError("Slide: no API url was provided");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSlides() {
      setIsLoading(true);
      setError("");
      try {
        const res = await api.get(url);
        const data = res.data?.data;
        console.log(data);
        if (!Array.isArray(data)) {
          throw new Error("Invalid slide API response");
        }
        if (!cancelled) setSlideData(data);
      } catch (err) {
        console.error("Failed to fetch slides:", url, err);
        if (!cancelled) {
          setSlideData([]);
          setError(err?.message || "Failed to load slides");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSlides();

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Prefer slides made for this screen size; fall back to all slides
  const slides = useMemo(() => {
    const all = slideData.map(toSlide).filter((s) => s.mediaUrl);
    const matching = all.filter((s) => s.forMobile === isMobileScreen());
    return matching.length ? matching : all;
  }, [slideData]);
  //  console.log(slides);
  const total = slides.length;
  const hasTabs = slides.some((s) => s.thumb);

  useEffect(() => {
    setIndex(0);
  }, [total]);

  const next = () => {
    if (total > 1) setIndex((current) => (current + 1) % total);
  };

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

  // Temporary: show why nothing rendered. Change back to `return null` when fixed.
  if (!total) {
    return error ? (
      <div className="w-100 text-center text-danger py-4" role="alert">
        {error}
      </div>
    ) : null;
  }

  return (
    <section className="hero-section" aria-label="Featured brands">
      <Carousel
        className="hero-carousel"
        activeIndex={index}
        onSelect={setIndex}
        controls={false}
        indicators={false}
        interval={null}
        pause={false}
        fade
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            {slide.isVideo ? (
              <video
                className="hero-media"
                src={slide.mediaUrl}
                muted
                loop
                autoPlay={playing}
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                className="hero-media"
                src={slide.mediaUrl}
                alt={slide.title || slide.label}
                loading="eager"
              />
            )}

            <div className="hero-scrim position-absolute" />

            <div className="d-flex w-100 justify-content-center">
              <div className="hero-content text-center position-absolute">
                {slide.title && <h2 className="hero-title">{slide.title}</h2>}
                {slide.text && <div className="hero-text my-3">{slide.text}</div>}
                <a className="hero-cta font-monospace fw-bold" href={slide.link}>
                  {slide.cta}
                </a>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {hasTabs && (
        <div
          className="hero-tabs d-none d-md-block rounded-pill"
          role="tablist"
          aria-label="Choose a brand"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`hero-tab rounded-pill ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            >
              {slide.thumb && (
                <img
                  className="hero-tab-thumb rounded-circle"
                  src={slide.thumb}
                  alt=""
                />
              )}
              <span>{slide.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="hero-bar">
        <div className="hero-count">
          <span>{index + 1}</span>
          <i aria-hidden="true" />
          <span>{total}</span>
        </div>

        <div className="hero-track bg-black">
          {total > 1 && (
            <div
              key={`${index}-${playing}`}
              className="hero-fill"
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
          className="hero-toggle"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          {playing ? <FiPause /> : <FiPlay />}
        </button>
      </div>
    </section>
  );
}