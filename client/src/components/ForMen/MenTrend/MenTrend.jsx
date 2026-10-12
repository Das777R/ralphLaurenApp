import { useEffect, useState } from 'react';
import api from '../../../api/api';
import './MenTrend.css';

const GOODWOOD_LOGO_URL =
  'https://www.ralphlauren.global/on/demandware.static/-/Library-Sites-RalphLauren_EU_Library/default/dw44ca633f/img/Brand_Logo_Library/_V2/SPORTS/GOODWOOD/2026_ralph_lauren_goodwood_patch_logo_white.svg';

function TrendBanner({ item, variant }) {
  return (
    <div className={`men-trend-banner men-trend-banner--${variant}`}>
      <img
        src={item.media[0]}
        alt={item.description}
        className="men-trend-image"
      />

      <div className="men-trend-overlay">
        <img
          src={GOODWOOD_LOGO_URL}
          alt="Ralph Lauren Goodwood logo"
          className="men-trend-logo"
        />
        <p className="men-trend-caption">{item.description}</p>
      </div>
    </div>
  );
}

function MenTrend() {
  const [desktopItems, setDesktopItems] = useState([]);
  const [mobileItems, setMobileItems] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await api.get('/mediaforpage/men/trend');
        const items = res.data?.data;

        setDesktopItems(items.filter((item) => item.forMobile === false));
        setMobileItems(items.filter((item) => item.forMobile === true));

      } catch (err) {
        console.error('Failed to load men trend media:', err);
      }finally{setIsLoading(false)}
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
    <section className="men-trend" aria-label="Men trending looks">
      {desktopItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="desktop" />
      ))}

      {mobileItems.map((item) => (
        <TrendBanner key={item._id} item={item} variant="mobile" />
      ))}
    </section>
  );
}

export default MenTrend;