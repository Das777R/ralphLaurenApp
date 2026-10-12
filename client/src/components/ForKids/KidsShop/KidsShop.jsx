import './KidsShop.css';
import { useState, useEffect } from 'react';
import api from '../../../api/api';

function KidsShop() {
  const [kidsShopData, setKidsShopData] = useState([]);
  const [isLoading,setIsloading] = useState(true);

  useEffect(() => {
    const fetchKidsShopSlide = async () => {
      try{
      const res = await api.get('/mediaforpage/kids&baby/stories');
      setKidsShopData(res?.data?.data);
      }catch(err){
        console.log(err);
      }finally{
        setIsloading(false)
      }

    };

    fetchKidsShopSlide();
  }, []);

  const getImageUrl = (titleName, isMobile) => {
    const matchedKidsData = kidsShopData.find(
      (item) => item.forMobile !== isMobile && item.title.toLowerCase() === titleName.toLowerCase()
    );
    return matchedKidsData?.media?.[0];
  };


  if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
  }

  return (
  <div className="kids-shop-cont px-md-3 px-lg-4 px-2 d-flex h-100 w-100">
  <div className='d-md-block d-none'>
    <div className="kids-shop-img bg-transparent position-relative overflow-hidden">
      <h2 className="kids-shop-category-text text-capitalize text-white">
        The <span className="d-block shop-kids-title">Shops</span>
      </h2>
      <p className="kids-shop-polo-rl-title text-uppercase text-white text-wrap mt-5 w-50">
        Signature collections and seasonal edits
      </p>

      <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
        shop all boys
      </p>
      <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
        shop all girls
      </p>
      <div className="kids-shop-img-info position-absolute"></div>
    </div>
  </div>


  <div className="kids-shop-img bg-transparent position-relative overflow-hidden d-block d-md-none">
    <div className="mx-auto text-center">
  <h2 className="kids-shop-category-text text-capitalize text-white text-center">
  The <span className="d-block shop-kids-title">Shops</span>
  </h2>
  <p className="kids-shop-polo-rl-title text-uppercase text-center mx-5 text-white text-nowrap mt-5 w-50">
  Signature collections and seasonal edits
  </p>


  <div className='d-flex flex-cloumn gap-3 justify-content-center'>
  <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link ">
  shop all boys
  </p>
  <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
  shop all girls
  </p>
  </div>
    </div>


  <div className="kids-shop-img-info position-absolute"></div>
  </div>

  <div className="kids-shop-carousel-cont">
    <div className="text-white text-capitalize d-xl-block d-xxl-block d-lg-block d-md-block d-none"></div>

    <div className="kids-shop-img-carosuel-cont d-flex">
      <div className="kids-shop-img-carousel position-relative">
        <img src={getImageUrl("teen shop", true)} alt="" className="kids-shop-img-carousel-img" />
        <div className="kids-shop-img-info position-absolute">
          <h2 className="kids-shop-category-carousel-text text-capitalize text-white">
            teen shop
          </h2>
          <div className="d-flex gap-3">
            <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
            shop all boys
            </p>
            <p className="text-uppercase text-white text-decoration-underline d-flex shopAll-kids-link">
            shop all girls
            </p>
          </div>

        </div>
      </div>
      <div className="kids-shop-img-carousel position-relative">
        <img src={getImageUrl("polo bear shop", true)} alt="" className="kids-shop-img-carousel-img" />
        <div className="kids-shop-img-info position-absolute">
          <h2 className="kids-shop-category-carousel-text text-capitalize text-white text-nowrap">
            polo bear shop
          </h2>
          <div className="d-flex gap-3">
            <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
            shop all boys
            </p>
            <p className="text-uppercase text-white text-decoration-underline d-flex shopAll-kids-link">
            shop all girls
            </p>
          </div>
        </div>
      </div>

      <div className="kids-shop-img-carousel position-relative">
        <img src={getImageUrl("sibling style", true)} alt="" className="kids-shop-img-carousel-img" />
        <div className="kids-shop-img-info position-absolute">
          <h2 className="kids-shop-category-carousel-text text-capitalize text-white">
            sibling style
          </h2>
          <div className="d-flex gap-3">
            <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
            shop now
            </p>
          </div>
        </div>
      </div>


      <div className="kids-shop-img-carousel position-relative">
        <img src={getImageUrl("backpack shop", true)} alt="" className="kids-shop-img-carousel-img" />
        <div className="kids-shop-img-info position-absolute">
          <h2 className="kids-shop-category-carousel-text text-capitalize text-white">
            backpack shop
          </h2>
          <div className="d-flex gap-3">
            <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
            shop now
            </p>
          </div>
        </div>
      </div>

      <div className="kids-shop-img-carousel position-relative">
        <img src={getImageUrl("icons shop", true)} alt="" className="kids-shop-img-carousel-img" />
        <div className="kids-shop-img-info position-absolute">
          <h2 className="kids-shop-category-carousel-text text-capitalize text-white">
            icons shop
          </h2>
        <div className="d-flex gap-3">
        <p className="text-uppercase text-white text-decoration-underline shopAll-kids-link">
        shop now
        </p>
        </div> 
        </div>
      </div>

    </div>
  </div>
  </div>
  );
}

export default KidsShop;