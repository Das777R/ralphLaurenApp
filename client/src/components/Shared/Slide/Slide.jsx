import { useEffect, useMemo, useState } from "react";
import { Carousel } from "react-bootstrap";
import { FiPause, FiPlay } from "react-icons/fi";
import api from "../../../api/api.js"; // adjust path if needed
import "./Slide.css";

/* ---------- Helpers: API entry -> slide ---------- */
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(
  /\/api\/?$/,
  ""
);

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;
const isVideoUrl = (url) => !!url && VIDEO_EXT.test(url.split(/[?#]/)[0]);

const toUrl = (m) => {
  const p = typeof m === "string" ? m : m?.url || m?.secure_url || "";
  if (!p) return "";
  if (/^(https?:|blob:|data:)/i.test(p)) return p;
  return `${API_ORIGIN}${p.startsWith("/") ? p : `/${p}`}`;
};

const toSlide = (entry, i) => {
  const list = Array.isArray(entry.media)
    ? entry.media
    : entry.media
    ? [entry.media]
    : [];
  const urls = list.map(toUrl).filter(Boolean);
  const main = urls[0] || "";

  return {
    id: entry._id || `slide-${i}`,
   label: entry.brand || `Slide ${i + 1}`,
    title: entry.title || "",
    text: entry.description || "",
    cta: entry.cta || "Shop now",
    link: entry.link || "/",
    forMobile: Boolean(entry.forMobile),
    mediaUrl: main,
    isVideo: isVideoUrl(main),
    thumb: entry.thumb,
  };
};

export default function Slide({ interval = 6000, url }) {
  const [SlideData, setSlideData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const fetchForSlide = async () => {
      try {
        const res = await api.get(url);
        setSlideData(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForSlide();
  }, []);

  const slides = useMemo(() => {
    const all = (SlideData || []).map(toSlide).filter((s) => s.mediaUrl);
    const isMobile = window.matchMedia("(max-width: 767.98px)").matches;
    const matching = all.filter((s) => s.forMobile === isMobile);
    return matching.length ? matching : all;
  }, [SlideData]);

  console.log(slides);
  const hasTabs = slides.some((s) => Boolean(s.thumb));

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
        />
      </div>
    );
  }

  if (!slides.length) return null;

  const total = slides.length;
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="ads-section" aria-label="Featured brands">
      <Carousel
        className="ads-carousel"
        activeIndex={index}
        onSelect={setIndex}
        controls={false}
        indicators={false}
        interval={null}
        fade
      >
        {slides.map((s) => (
          <Carousel.Item key={s.id}>
            {s.isVideo ? (
              <video
                className="ads-media"
                src={s.mediaUrl}
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img className="ads-media" src={s.mediaUrl} alt={s.title || s.label} />
            )}
            <div className="ads-scrim position-absolute"/>
           <div className="d-flex w-100 justify-content-center">
            <div className="ads-content text-center position-absolute">
              {s.title && <h2 className="ads-title">{s.title}</h2>}
              {s.text && <div className="ads-text my-3">{s.text}</div>}
              <a className="ads-cta font-monospace fw-bold" href={s.link}>
                {s.cta}
              </a>
            </div>
           </div>


          </Carousel.Item>
        ))}
      </Carousel>

      {/* Brand tabs */}
      {hasTabs && (
      <div className="ads-tabs d-none d-md-block rounded-pill" role="tablist" aria-label="Choose a brand">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`ads-tab rounded-pill ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          >
            {s.thumb && <img className="ads-tab-thumb rounded-circle" src={s.thumb} alt="" />}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      )}


      {/* Counter, progress bar, play / pause */}
      <div className="ads-bar">
        <div className="ads-count">
          <span>{index + 1}</span>
          <i aria-hidden="true" />
          <span>{total}</span>
        </div>

        <div className="ads-track bg-black">
          <div
            key={index}
            className="ads-fill"
            style={{
              animationDuration: `${interval}ms`,
              animationPlayState: playing ? "running" : "paused",
            }}
            onAnimationEnd={next}
          />
        </div>

        <button
          type="button"
          className="ads-toggle"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          {playing ? <FiPause /> : <FiPlay />}
        </button>
      </div>
    </section>
  );
}