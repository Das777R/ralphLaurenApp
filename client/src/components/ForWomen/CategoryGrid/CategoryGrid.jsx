import './CategoryGrid.css';
import {Link, useParams} from 'react-router-dom'
import api from '../../../api/api';
import { useState, useEffect } from 'react';

function CategoryGrid() {
  const [womenGridData, setWomenGridData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchForMenSlide = async () => {
      try{
       const res = await api.get('/mediaforpage/women/category');
       setWomenGridData(res.data.data);
      }catch(err){console.log(err)}finally{setIsLoading(false)}
    }

    fetchForMenSlide();
  },[])



   const getImageUrl = (titleName, isMobile) => {
    const matchedWomenData = womenGridData.find((item) => item.forMobile === isMobile && item.title.toLowerCase() === titleName.toLowerCase());
  
    return matchedWomenData?.media?.[0];
  }

  const {userId} = useParams();
  const ws_shirts_path = userId ? `/women-section/category/shirts/${userId}` : '/women-section/category/shirts';
  const ws_jumpers_path = userId ? `/women-section/category/jumpers/${userId}` : '/women-section/category/jumpers';
  const ws_dresses_path = userId ? `/women-section/category/dresses/${userId}` : '/women-section/category/dresses';
  const ws_trousers_path = userId ? `/women-section/category/trousers/${userId}` : '/women-section/category/trousers';
  const ws_bags_path = userId ? `/women-section/category/bags/${userId}` : '/women-section/category/bags';
  const ws_jackets_path = userId ? `/women-section/category/jackets/${userId}` : '/women-section/category/jackets';
  
  
  if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
}
  return (
  <div className="women-men-categories-cont">
    <h1 className="women-categories-title text-capitalize text-xl-center text-xxl-center text-lg-center text-md-center text-sm-start">women's categories</h1>
    <div className="grid-container">
      <div className="box-grid box-grid-1">
        <Link to={ws_shirts_path}>
        <img src={getImageUrl("shirts", false)} alt="women-category-shirts" className="women-men-cat-desktop"/>
        <img src={getImageUrl("shirts", true)} alt="women-category-shirts-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{getImageUrl("shirts", false) ? 'Shirts' : null}</div>
        </Link>
      </div>
   
      <div className="box-grid box-grid-2">
        <Link to={ws_jumpers_path}>
        <img src={getImageUrl("jumpers", false)} alt="women-category-jumpers" className="women-men-cat-desktop"/>
        <img src={getImageUrl("jumpers", true)} alt="women-category-jumpers-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{getImageUrl("jumpers", false) ? 'Jumpers' : null}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-3">
        <Link to={ws_dresses_path}>
        <img src={getImageUrl("dresses", false)} alt="women-category-dresses" className="women-men-cat-desktop"/>
        <img src={getImageUrl("dresses", true)} alt="women-category-dresses-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{getImageUrl("dresses", false) ? 'Dresses' : null}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-4">
        <Link to={ws_trousers_path}>
        <img src={getImageUrl("trousers", false)} alt="women-category-trousers" className="women-men-cat-desktop"/>
        <img src={getImageUrl("trousers", true)} alt="women-category-trousers-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{getImageUrl("trousers", false) ? 'Trousers' : null}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-5">
        <Link to={ws_bags_path}>
        <img src={getImageUrl("bags", false)} alt="women-category-bags" className="women-men-cat-desktop"/>
        <img src={getImageUrl("bags", true)} alt="women-category-bags-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{getImageUrl("bags", false) ? 'Bags' : null}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-6">
        <Link to={ws_jackets_path}>
        <img src={getImageUrl("jackets", false)} alt="women-category-jackets" className="women-men-cat-desktop"/>
        <img src={getImageUrl("jackets", true)} alt="women-category-jackets-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{getImageUrl("jackets", false) ? 'Jackets' : null}</div>
        </Link>
      </div>
    </div>
  </div>
  )
}

export default CategoryGrid
