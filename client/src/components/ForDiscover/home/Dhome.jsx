import './Dhome.css';
import { useState, useEffect } from 'react';
import api from '../../../api/api';

function Dhome() {
  const [DhomeData, setDhomeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    const fetchForMenSlide = async () => {
      try {
        const res = await api.get('/mediaforpage/discover/trend');
        setDhomeData(res.data.data);
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
    <div className="discover-carousel-cont p-lg-1 py-1 px-1 d-flex">
      <div className="discover-carousel-intro-cont">
        <div className="discover-carousel-intro position-relative overflow-hidden d-flex flex-column justify-content-center text-white">
          <p className="d-block text-uppercase text-center">Discover</p>
          <h1 className="text-capitalize">
             Women Brands
          </h1>
          <p>With each Ralph Lauren Home collection, a dream is brought to life. The distinct lifestyles created by Ralph Lauren Home – along with the Lauren, Polo Ralph Lauren, Double RL and Ralph’s Coffee brands – reflect the timelessness of Ralph Lauren Home style</p>
        </div>
      </div>

      <div className="discover-carousel-wrap bg-transparent mt-5">
        <div className="discover-carousel-track d-flex">
          {DhomeData?.map((item, index) => {
            const isHovered = activeCardId === item?._id;
            
            return (
              <div 
                className="discover-carousel-card position-relative" 
                key={item?._id || index}
                onMouseEnter={() => setActiveCardId(item?._id)}
                onMouseLeave={() => setActiveCardId(null)}
              >
                <img src={item?.media[0]} alt={item?.title || "Discover item"} className="discover-carousel-card-img" />
                
                <div className={`discover-carousel-card-info position-absolute ${isHovered ? 'show-p' : ''}`}>
                  <h2 className={`discover-carousel-card-title text-capitalize text-white ${isHovered ? 'd-none' : ''}`}>{item?.title}</h2>
                  <h2 className="discover-carousel-card-title text-capitalize text-white">{item?.title}</h2>
                  <p className={`text-white`} style={{fontSize:"12px"}}>{item?.description}</p>
                </div>

               <div className={`discover-carousel-card-info position-absolute ${!isHovered ? 'show-p' : 'd-none'}`}>
                  <h2 className={`discover-carousel-card-title text-capitalize text-white`}>{item?.title}</h2>
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

export default Dhome;