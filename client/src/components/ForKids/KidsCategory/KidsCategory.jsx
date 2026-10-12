import { useState, useEffect } from "react";
import api from "../../../api/api";
import './KidsCategory.css'
import {Link ,useParams } from 'react-router-dom';


function KidsCategory() {
    const {userId} = useParams();
    const [kidsCategoryData, setKidsCategoryData] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
    const fetchKidsShopSlide = async () => {
      try{
      const res = await api.get('/mediaforpage/kids&baby/category');
      setKidsCategoryData(res?.data?.data);
      }catch(err){
        console.log(err)
      }finally{
        setIsLoading(false)
      }
    };

    fetchKidsShopSlide();
  }, []);



  if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"15rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
  }

  return (
  <div className="shop-by-category-kids-container user-select-none w-100">
  <div className="shop-by-category-kids-category">


  <h1 className="text-white kids-category-title flex-nowrap text-uppercase">Kids: Shop by category</h1>
  <div className="kids-category-img-carosuel-cont d-flex">
  {kidsCategoryData?.map((item) => (
  <Link 
  to={userId ? `/kids-section/category/${item?.title}/${userId}` : `/kids-section/category/${item?.title}`}
  style={{textDecoration:"inherit"}}>
    <div className="kids-category-img-carousel">
    <img src={item?.media[0]} alt="" className="kids-category-img-carousel-img" />
    <div className="kids-category-img-info">
    <p className="kids-category-polo-rl-carousel-title text-uppercase">
    {item?.title}
    </p>
    </div>
    </div>
  </Link>
    ))}

  </div>
  </div>
  </div>
  )
}

export default KidsCategory
