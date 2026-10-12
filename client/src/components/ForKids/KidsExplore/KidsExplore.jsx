import './KidsExplore.css'
import { useState, useEffect } from 'react';
import api from '../../../api/api';
import { Link, useParams } from 'react-router-dom';


const SECTION_BY_TITLE = {
  women: 'women-section',
  men: 'men-section',
  kids: 'kids-section',
  home: 'home-section',
};

function KidsExplore() {
  const [kidsExploreData, setKidsExploreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {userId} = useParams();


  useEffect(() => {
    const fetchForMenSlide = async () => {
      try{
      const res = await api.get('/mediaforpage/kids&baby/explore');
      setKidsExploreData(res.data.data);
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



    function getLink(title = '') {
    const section = SECTION_BY_TITLE[title.trim().toLowerCase()] || 'kids-section';
    return userId ? `/${section}/${userId}` : `/${section}`;
  }


  return (
    <div className="home-explore-cont p-lg-1 p-md-5 py-1  px-1 d-flex">
      <div className="home-explore-img-cont">
      <div className="home-explore-img position-relative overflow-hidden d-flex flex-column justify-content-center">
      <h1 className='text-capitalize'>More to <span className='d-block'>Explore</span></h1>      
      <p>Discover our curated edits and seasonal collections</p>
      </div>
      </div>
      <div className="home-explore-carousel-cont">
      <div className="home-explore-img-carosuel-cont d-flex">
        {kidsExploreData?.map((item) => (
        <Link to={getLink(item?.title)} key={item._id || item.title}>
          <div className="home-explore-img-carousel position-relative">
          <img src={item?.media[0]} alt="" className="home-explore-img-carousel-img"/>
          <div className="home-explore-img-info position-absolute">

          <h2 className="home-explore-category-carousel-text  text-capitalize text-white">{item?.title}</h2>
          </div>
          </div>
        </Link>
        ))}
      </div>
      </div>
    </div>
  )
}

export default KidsExplore