import './SlideCarousel.css';
import { useState, useEffect } from 'react';
import api from '../../../api/api.js';

function SlideCarousel() {
    const [womenSlideData, setWomenSlideData] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const fetchForMenSlide = async () => {
      try{
      const res = await api.get('/mediaforpage/women/carousel');
       setWomenSlideData(res.data.data);
      }catch(err){console.log(err)}finally{setIsLoading(false)}
    }

    fetchForMenSlide();
  },[])


    useEffect(() => {
    if(!isLoading){
      setTimeout(() => {
        setShowContent(true);
      },1000)
    }
  },[isLoading])

  if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
}






  return (
<div id="carouselExampleIndicators" className="carousel slide w-100">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner carousel-slide-inner">
    {womenSlideData?.map(item => (
    <div className="carousel-item carousel-slide-item active w-100" key={item?._id || item?.title}>
      <video src={item?.media} autoPlay muted className='carousel-slide-video'></video>
      {showContent && (
      <div className="position-absolute carousel-women-info mt-5 text-center">
        <h1 className='h1-women-info-1 text-uppercase'>{item?.title} </h1>
        <p className='p-women-info-1 text-capitalize'>{item?.description}</p>
        <div className="shop-now mt-lg-2 mt-xl-3  mt-2 btn btn-outline-white text-capitalize text-white border border-1 border-white">shop now</div>
      </div>
      )}

    </div>
    ))}

  </div>
</div>
  )
}

export default SlideCarousel
