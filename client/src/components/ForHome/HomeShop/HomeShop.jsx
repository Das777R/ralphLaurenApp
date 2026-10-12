import './HomeShop.css';
import { useState, useEffect } from 'react';
import api from '../../../api/api'

function HomeShop() {
  const [HomeShopData, setHomeShopData] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchHomeSlide = async () => {
      try{
       const res = await api.get('/mediaforpage/home/stories');
       setHomeShopData(res.data.data);
      }catch(err){console.log(err)}finally{
        setIsLoading(false)
      }

    }

    fetchHomeSlide();
  },[]);


  if(isLoading){
    return (
    <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"15rem"}}>
      <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
      </div>
    </div>
    )
  }



  return (
    <div className="home-shop-cont px-md-3 px-lg-4 px-2 d-flex h-100 w-100">
    <div className='d-md-block d-none'>
    <div className="home-shop-img bg-transparent position-relative overflow-hidden d-flex align-items-start justify-content-center flex-column">
      <h2 className="home-shop-category-text text-capitalize text-white">
        The <span className="d-block home-shop-title">Shops</span>
      </h2>
      <p className="home-shop-polo-rl-title text-uppercase text-white text-wrap mt-2 w-100 text-nowrap">
        Signature collections and seasonal edits
      </p>
    
    </div>
    </div>


    <div className="home-shop-img bg-transparent position-relative overflow-hidden d-block d-md-none">
    <div className="mx-auto text-center w-100 d-flex align-items-center justify-content-center flex-column">
    <h2 className="home-shop-category-text text-capitalize text-white text-center">
    The <span className="d-block home-shop-title">Shops</span>
    </h2>
    <p className="home-shop-polo-rl-title text-uppercase text-center mx-2 text-white text-nowrap mt-1 w-100">
    Signature collections and seasonal edits
    </p>
    </div>


    <div className="home-shop-img-info position-absolute"></div>
    </div>

    <div className="home-shop-carousel-cont">
    <div className="text-white text-capitalize d-xl-block d-xxl-block d-lg-block d-md-block d-none"></div>

    <div className="home-shop-img-carosuel-cont d-flex">
    {HomeShopData?.map((item) => (
    <div className="home-shop-img-carousel position-relative">
        <img src={item?.media[0]} alt="" className="home-shop-img-carousel-img" />
        <div className="home-shop-img-info position-absolute">
          <h2 className="home-shop-category-carousel-text text-capitalize text-white">
            {item?.title}
          </h2>

        </div>
      </div>
    ))}
    </div>
    </div>
    </div>
  );
}

export default HomeShop;