import './WomenExplore.css'
import { useState, useEffect } from 'react';
import api from '../../../api/api';

function WomenExplore() {
  const [WomenExploreData, setWomenExploreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForMenSlide = async () => {
      try{
       const res = await api.get('/mediaforpage/women/explore');
       setWomenExploreData(res.data.data);
      }catch(err){console.log(err)}finally{
        setIsLoading(false)
      }

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

  return (
    <div className="home-explore-cont p-lg-1 py-1  px-1 d-flex">
      <div className="home-explore-img-cont">
      <div className="home-explore-img position-relative overflow-hidden d-flex flex-column justify-content-center">
      <h1 className='text-capitalize'>More to <span className='d-block'>Explore</span></h1>      
      <p>Discover our curated edits and seasonal collections</p>
      </div>
      </div>
      <div className="home-explore-carousel-cont">
      <div className="home-explore-img-carosuel-cont d-flex">
      {WomenExploreData?.map((item) => (
        <div className="home-explore-img-carousel position-relative" key={item?._id || item?.title}>
        <img src={item?.media[0]} alt="" className="home-explore-img-carousel-img"/>
        <div className="home-explore-img-info position-absolute">
        <h2 className="home-explore-category-carousel-text  text-capitalize text-white">{item?.title}</h2>
        <p className='text-uppercase text-white text-decoration-underline shopnow-women'>shop now</p>
        </div>
        </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default WomenExplore