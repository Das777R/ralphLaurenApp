import { useEffect, useState } from 'react';
import api from '../../../api/api';
import './HomeTrend.css';

function TrendBanner({ item, variant }) {
  return (
    <div className={`home-trend-banner home-trend-banner--${variant}`}>
      <video
        src={item.media?.[0]}
        autoPlay
        muted
        loop
        playsInline
        className="home-trend-video"
      />

      <div className="home-trend-overlay">
        <h1 className="home-trend-title">{item.title}</h1>
        <p className="home-trend-caption">{item.description}</p>
        <p className="home-trend-cta text-decoration-underline text-capitalize">
          Shop now
        </p>
      </div>
    </div>
  );
}

export default function HomeTrend() {
  const [desktopItems, setDesktopItems] = useState([]);
  const [mobileItems, setMobileItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await api.get('/mediaforpage/home/trend');
        const items = res.data?.data;

        setDesktopItems(items.filter((item) => !item.forMobile));
        setMobileItems(items.filter((item) => item.forMobile));
      } catch (err) {
        console.error('Failed to load home trend media:', err);
      }finally{
        setIsLoading(false);
      }
    };

    fetchTrend();
  }, []);


    if(isLoading){
    return (
    <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"15rem"}}>
      <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
      </div>
    </div>
    )
  }

  return (
    <section className="home-trend">
      {desktopItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="desktop" />
      ))}

      {mobileItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="mobile" />
      ))}
    </section>
  );
}