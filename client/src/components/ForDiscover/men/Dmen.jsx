import './Dmen.css';
import { useState, useEffect } from 'react';
import api from '../../../api/api';

function Dmen() {
  const [DmenData, setDmenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    const fetchForMenSlide = async () => {
      try {
        const res = await api.get('/mediaforpage/discover/category');
        setDmenData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForMenSlide();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "20rem" }}>
        <div className="spinner-grow text-dark" style={{ width: "4rem", height: "4rem" }} role="status" />
      </div>
    );
  }

  return (
    <div className="men-discover-cont p-lg-1 py-1 px-1 d-flex">
      <div className="men-discover-intro-cont">
        <div className="men-discover-intro position-relative overflow-hidden d-flex flex-column justify-content-center text-white">
           <p className="d-block text-uppercase text-center">Discover</p>
          <h1 className="text-capitalize">
             Home Brands
          </h1>
          <p>From the iconic men’s Ralph Lauren Polo shirt to the artful craftsmanship of Purple Label, rugged luxury of Double RL and peak RLX performance, the World of Ralph Lauren men is rooted in timeless design</p>
        </div>
      </div>

      <div className="men-discover-wrap bg-transparent mt-5">
        <div className="men-discover-track d-flex">
          {DmenData?.map((item, index) => {
            const isHovered = activeCardId === item?._id;
            return (
              <div 
                className="men-discover-card position-relative" 
                key={item?._id || index}
                onMouseEnter={() => setActiveCardId(item?._id)}
                onMouseLeave={() => setActiveCardId(null)}
              >
                <img src={item?.media[0]} alt={item?.title || "Discover item"} className="men-discover-card-img" />
                
                <div className={`men-discover-card-info position-absolute ${isHovered ? 'show-p' : ''}`}>
                  <h2 className={`men-discover-card-title text-capitalize text-white ${isHovered ? 'd-none' : ''}`}>{item?.title}</h2>
                  <h2 className="men-discover-card-title text-capitalize text-white">{item?.title}</h2>
                  <p className="text-white" style={{ fontSize: "12px" }}>{item?.description}</p>
                </div>

                <div className={`men-discover-card-info position-absolute ${!isHovered ? 'show-p' : 'd-none'}`}>
                  <h2 className="men-discover-card-title text-capitalize text-white">{item?.title}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-1 border-white w-100" />
    </div>
  );
}

export default Dmen;