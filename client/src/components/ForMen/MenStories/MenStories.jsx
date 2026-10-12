import { useEffect, useState } from 'react';
import api from '../../../api/api';
import './MenStories.css'

function MenStories() {
  const [menStoriesData, setMenStoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchForMenSlide = async () => {
      try{
      const res = await api.get('/mediaforpage/men/stories');
       setMenStoriesData(res.data.data);
    }catch(err){console.log(err)}finally{setIsLoading(false)}
  }
 fetchForMenSlide();
  },[])


  if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
}

   const getImageUrl = (titleName, isMobile) => {
    const matchedMenStoriesData = menStoriesData.find((item) => item.forMobile === isMobile && item.title.toLowerCase() === titleName.toLowerCase());
    console.log(matchedMenStoriesData);
    return matchedMenStoriesData?.media?.[0];
  }
  return (
  <div className="women-men-stories-cont mt-5 d-flex">
      <div className="text-white text-capitalize d-xl-none d-xxl-none d-lg-none d-md-none d-sm-block">
        <h2 className="stories-carousel-title">The stories</h2>
        <div className="stories-carousel-text">Seasonal collections and curated edits from the wide-reaching world of Ralph Lauren</div>
      </div>
     <div className="stories-img-cont">
       <div className="stories-img position-relative overflow-hidden">
         <img src={getImageUrl("candy store",false)} alt="polo bags stories"/>
         <img src={getImageUrl("candy store", true)} alt="polo bags stories only mobile"/>
         <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-title text-uppercase text-white">polo ralph lauren</p>
           <h2 className="stories-category-text text-capitalize text-white">{'candy store'}</h2>
         </div>
       </div>
    </div>
     <div className="stories-carousel-cont">
      <div className="text-white text-capitalize d-xl-block d-xxl-block d-lg-block d-md-block d-none">
        <h2 className="stories-carousel-title ">The stories</h2>
        <div className="stories-carousel-text">Seasonal collections and curated edits from the wide-reaching world of Ralph Lauren</div>
      </div>
       <div className="stories-img-carosuel-cont d-flex">
        <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("rlx", false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">polo ralph lauren</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">{'RLX'}</h2>
         </div>
        </div>
        <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("polo bear shop", false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">polo ralph lauren</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">{'polo bear shop'}</h2>
         </div>
        </div>
          <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("wardrobe essentials", false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">polo ralph lauren</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">{'wardrobe essentials'}</h2>
         </div>
        </div>
         <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("sweater shop", false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">ralph lauren</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">{'shirts shop'}</h2>
         </div>
        </div>
        <div className="stories-img-carousel position-relative">
          <img src={getImageUrl("occasion shop", false)} alt="" className="stories-img-carousel-img"/>
          <div className="stories-img-info position-absolute">
           <p className="stories-polo-rl-carousel-title text-uppercase text-white">ralph lauren</p>
           <h2 className="stories-category-carousel-text  text-capitalize text-white">{'occasion shop'}</h2>
         </div>
        </div>
       </div>
     </div>
  </div>
  )
}

export default MenStories
