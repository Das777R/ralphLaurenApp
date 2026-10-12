import { useEffect, useState } from 'react';
import api from '../../../api/api';
import './WomenTrend.css';

const isVideo = (url) => /\.(mp4|webm|mov|ogg)$/i.test(url);

function TrendBanner({ item, variant }) {
  return (
    <div className={`women-trend-banner women-trend-banner--${variant}`}>
      {isVideo(item.media[0]) ? (
        <video
          key={item.media[0]}
          src={item.media[0]}
          autoPlay
          muted
          loop
          playsInline
          className="w-100 h-100 women-trend-video object-fit-cover"
        />
      ) : (
        <img
          src={item.media[0]}
          alt={item.description}
          className="women-trend-image"
        />
      )}

      <div className="women-trend-overlay-wrap">
        <div className="women-trend-overlay py-5 w-100">
          <span className="women-trend-brand">{item.brand}</span>
          <h2 className="women-trend-title">{item.title}</h2>
          <p className="women-trend-caption">{item.description}</p>
          <span className="women-trend-cta">EXPLORE NOW</span>
        </div>
      </div>
    </div>
  );
}

function WomenTrend() {
  const [desktopItems, setDesktopItems] = useState([]);
  const [mobileItems, setMobileItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await api.get('/mediaforpage/women/trend');
        const items = res.data?.data;
        setDesktopItems(items.filter((item) => item.forMobile === false));
        setMobileItems(items.filter((item) => item.forMobile === true));
      } catch (err) {
        console.error('Failed to load women trend media:', err);
      }finally{
        setIsLoading(false)
      }
    };

    fetchTrend();
  }, []);

    if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
}

  return (
    <>
    <section className="women-trend w-100" aria-label="Women trending looks">
      {desktopItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="desktop" />
      ))}
    </section>
    <section className="women-trend w-100" aria-label="Women trending looks">
      {mobileItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="mobile" />
      ))}
    </section>
   </>
  );
}

export default WomenTrend;