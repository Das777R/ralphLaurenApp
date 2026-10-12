import { useEffect, useState } from 'react';
import api from '../../../api/api';
import './KidsTrend.css';

const GOODWOOD_LOGO_URL =
  'https://www.ralphlauren.global/on/demandware.static/-/Library-Sites-RalphLauren_EU_Library/default/dw44ca633f/img/Brand_Logo_Library/_V2/SPORTS/GOODWOOD/2026_ralph_lauren_goodwood_patch_logo_white.svg';

function TrendBanner({ item, variant }) {
  return (
    <div className={`kids-trend-banner kids-trend-banner--${variant}`}>
      <img
        src={item.media[0]}
        alt={item.description}
        className="kids-trend-image"
      />

      <div className="kids-trend-overlay">
        <img
          src={GOODWOOD_LOGO_URL}
          alt="Ralph Lauren Goodwood logo"
          className="kids-trend-logo"
        />
        <p className="kids-trend-caption">{item.description}</p>
      </div>
    </div>
  );
}

function KidsTrend() {
  const [desktopItems, setDesktopItems] = useState([]);
  const [mobileItems, setMobileItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await api.get('/mediaforpage/kids&baby/trend');
        const items = res.data?.data;

        setDesktopItems(items.filter((item) => item.forMobile === false));
        setMobileItems(items.filter((item) => item.forMobile === true));

      } catch (err) {
        console.error('Failed to load kids trend media:', err);
      }finally{
        setIsLoading(false);
      }
    };

    fetchTrend();
  }, []);


   if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"30rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
  }

  return (
    <section className="kids-trend" aria-label="Kids trending looks">
      {desktopItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="desktop" />
      ))}

      {mobileItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="mobile" />
      ))}
    </section>
  );
}

export default KidsTrend;