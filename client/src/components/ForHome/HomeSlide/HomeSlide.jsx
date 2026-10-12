import { useEffect, useState } from "react";
import api from "../../../api/api";
import './HomeSlide.css'


function  HomeSlide() {
  const [forMobile, setForMobile] = useState([]);
  const [forDesk, setForDesk] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForKidsSlide = async () => {
      try {
        const res = await api.get('/mediaforpage/home/carousel');
        const mobileMed = res.data.data.filter((item) => item.forMobile);
        const deskMed = res.data.data.filter((item) => !item.forMobile);
        setForMobile(mobileMed);
        setForDesk(deskMed);
      } catch (err) {
        console.log(err);
      }finally{
       setIsLoading(false)
      }
    };

    fetchForKidsSlide();
  }, []);


    if(isLoading){
    return (
    <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"15rem"}}>
      <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
      </div>
    </div>
    )
  }

  const isVideo = (url) => /\.(mp4|webm|mov|ogg)$/i.test(url);

  const renderSlide = (item, index) => (
    <div
      className={`carousel-item carousel-slide-item-kids position-relative w-100 top-0 bg-dark ${index === 0 ? 'active' : ''}`}
      key={index}
    >
      {isVideo(item.media[0]) ? (
        <div className={`position-absolute h-100 text-center w-100`}>
          <video
            src={item.media[0]}
            autoPlay
            muted
            loop
            playsInline
            className="carousel-slide-video-kids w-100 h-100 object-fit-cover"
          ></video>
          <div className="position-absolute text-white home-slide-info user-select-none">
            <h1 className="text-uppercase">{item.title}</h1>
            <h3 className="text-capitalize">{item.description}</h3>
            <p className="text-uppercase text-decoration-underline shop-now-slide-kids">explore now</p>
          </div>
        </div>
      ) : (
        <div className="position-absolute h-100 text-center w-100">
          <div className="position-absolute text-white home-slide-info user-select-none">
            <h1 className="text-uppercase">{item.title}</h1>
            <h3 className="text-capitalize">{item.description}</h3>
            <p className="text-uppercase text-decoration-underline shop-now-slide-kids">shop now</p>
          </div>
          <img
            src={item.media[0]}
            alt="Slide"
            className="carousel-slide-image-kids w-100 h-100 object-fit-cover"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-100">
      <div
        id="kidsCarouselMobile"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div className={`carousel-inner carousel-slide-inner-home-mobile w-100`}>
          {forMobile.map((item, index) => renderSlide(item, index))}
        </div>
        <button
          className="carousel-control-prev d-block d-lg-none"
          type="button"
          data-bs-target="#kidsCarouselMobile"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next d-block d-lg-none"
          type="button"
          data-bs-target="#kidsCarouselMobile"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div
        id="kidsCarouselDesktop"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div className="carousel-inner carousel-slide-inner-home-desk w-100">
          {forDesk.map((item, index) => renderSlide(item, index))}
        </div>
        <button
          className="carousel-control-prev d-none d-md-block"
          type="button"
          data-bs-target="#kidsCarouselDesktop"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next d-none d-md-block"
          type="button"
          data-bs-target="#kidsCarouselDesktop"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default HomeSlide;



