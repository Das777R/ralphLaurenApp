import './StoriesScroll.css'
import { useState, useEffect } from 'react';
import api from '../../../api/api';

function StoriesScroll() {
  const [womenStoriesData, setWomenStoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const fetchForMenSlide = async () => {
      try{
       const res = await api.get('/mediaforpage/women/stories');
       setWomenStoriesData(res.data.data);
      }catch(err){console.log(err)}finally{setIsLoading(false)}
    }

    fetchForMenSlide();
  },[]);




if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
}

    const getImageUrl = (titleName, isMobile) => {

    const matchedWomenData = womenStoriesData.find((item) => item.forMobile === isMobile && item.title.toLowerCase() === titleName.toLowerCase());
    return matchedWomenData?.media?.[0];
  }
  return (
      <div className="women-men-stories-cont mt-5 p-lg-5 p-md-5 py-5 px-1 d-flex">
      <div className="text-white text-capitalize d-xl-none d-xxl-none d-lg-none d-md-none d-sm-block">
        <h2 className="stories-carousel-title">The stories</h2>
        <div className="stories-carousel-text">Seasonal collections and special moments from across the wide-reaching world of Ralph Lauren</div>
      </div>
     <div className="stories-img-cont">
    <div className="stories-img position-relative overflow-hidden">
  {getImageUrl("fall/holiday 2026", false) && (
    <video 
      autoPlay 
      playsInline 
      muted 
      loop 
      className='w-100 h-100 object-fit-cover d-md-block d-none' 
      src={getImageUrl("fall/holiday 2026", false)}
    />
  )}
  {getImageUrl("fall/holiday 2026", true) && (
    <video 
      autoPlay 
      playsInline 
      muted 
      loop 
      className='w-100 h-100 object-fit-cover d-block d-md-none' 
      src={getImageUrl("fall/holiday 2026", true)}
    />
  )}
  
  <div className="stories-img-info position-absolute">
    <p className="stories-polo-rl-title text-uppercase text-white">polo ralph lauren</p>
    <h2 className="stories-category-text text-capitalize text-white">Fall/Holiday 2026</h2>
  </div>
</div>
    </div>
     <div className="stories-carousel-cont">
      <div className="text-white text-capitalize d-xl-block d-xxl-block d-lg-block d-md-block d-none">
        <h2 className="stories-carousel-title ">The stories</h2>
        <div className="stories-carousel-text">Seasonal collections and special moments from across the wide-reaching world of Ralph Lauren</div>
      </div>

       <div className="stories-img-carosuel-cont d-flex">
        <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("Polo Blaze", false)} alt="" className="stories-img-carousel-img"/>
       
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">polo ralph lauren</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">Polo Blaze</h2>
         </div>
        </div>
        <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("dress shop", false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">polo ralph lauren</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">dress shop</h2>
         </div>
        </div>
        <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("ralph lauren catwalk",false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">ralph lauren</p>
           <h2 className="stories-category-carousel-text text-capitalize text-white">ralph lauren catwalk</h2>
         </div>
        </div>
          <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("Spring 2027 Runaway Show",false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">ralph lauren collection</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">Spring 2027 Runaway Show</h2>
         </div>
        </div>
       </div>
     </div>
  </div>
  )
}

export default StoriesScroll
