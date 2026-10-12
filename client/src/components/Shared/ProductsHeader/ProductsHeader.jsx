import { useContext, useEffect, useState } from "react";
import { UIContext } from "../../../context/UIContext";
import { Link, NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5"
import HeaderBanner from "../../ForLandingPage/Header/HeaderBanner/HeaderBanner"
import RlcOnBarClick from "../OnBarClick/RlcOnBarClick"
import RlcOnSearchClick from "../OnSearchClick/RlcOnSearchClick"
import './ProductsHeader.css';
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsPerson, BsPersonFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineBars2 } from "react-icons/hi2";


function ProductsHeader() {

    const {handleSearchToggle, handleBarToggle, bagLength, setBagLength} = useContext(UIContext);
    const [userProfileIsHovered, setUserProfileIsHovered] = useState(false);
    const [userFavIsHovered, setUserFavIsHovered] = useState(false);

    const {userId} = useParams();
 
    
    const homePath = userId ? `/${userId}` : '/';
    const menPath = userId ? `/men-section/${userId}`: '/men-section';
    const womenPath = userId ? `/women-section/${userId}`: '/women-section'
    const authPath = userId ? `/auth/${userId}` : '/auth';
    const bagPath = userId ? `/bag/${userId}` : '/bag';
    const favPath = userId? `/fav/${userId}` : '/fav';
    const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';
    const homeNavPath = userId ? `/home-section/${userId}` : `/home-section`;
     const discoverPath = userId ? `/discover-section/${userId}` : '/discover-section';

    useEffect(() => {
      const lsbag = JSON.parse(localStorage.getItem('bag')) || [];
      const lengbag = lsbag.length;
      setBagLength(lengbag)
    },[])
  
    


  
  

  return (
      <div className="header-banner-container user-select-none position-relative">
       <HeaderBanner/>
      <div className={`header-banner-container-ralph-products position-relative w-100 top-0`}>
      <div className={`logos-header d-flex justify-content-between align-items-center px-lg-4 px-md-3  w-100 user-select-none`}>
        <div className="d-flex gap-3 align-items-center">
          <Link to={homePath} className="text-decoration-none text-uppercase">
      <div className="ralph-logo">
        ralph lauren
      </div>
      </Link>
      <div className="ralph-categories text-uppercase d-lg-flex gap-lg-3 gap-4 pt-3 pe-5">
        <NavLink to={menPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
        <div className="category-nav men-nav">Men</div>
        </NavLink>
        <NavLink to={womenPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
        <div className="category-nav women-nav">Women</div>
        </NavLink>
        <NavLink to={kidsPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
        <div className="category-nav kids&baby-nav">kids & baby</div>
        </NavLink>
              <NavLink to={homeNavPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>      
        <div className="category-nav home-nav">home</div>
        </NavLink>
        <NavLink to={discoverPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
            <div className="category-nav discover-nav">discover</div>
        </NavLink>  
       
      </div>
     </div>
     <div className="header-icons d-flex gap-lg-4 gap-2 gap-md-3 gap-3">
        <div className="search-icon">
          <Link onClick={() => handleSearchToggle()} style={{color: "inherit"}}>
         <IoIosSearch className="banner-icon"/>

          </Link>
        </div>
       <div className="profile-icon d-none d-lg-block">
          <Link to={authPath} style={{color: "inherit"}} onMouseEnter={() => setUserProfileIsHovered(true)} onMouseLeave={() => setUserProfileIsHovered(false)}>
          {userProfileIsHovered ? (
           <BsPersonFill className="banner-icon"/>
          ):(
          <BsPerson className="banner-icon"/>
          )}
          </Link>
        </div>
        <div className="fav-icon d-none d-lg-block">
          <Link 
          to={favPath}
          onMouseEnter={() => setUserFavIsHovered(true)}
          onMouseLeave={() => setUserFavIsHovered(false)}
           style={{color: "inherit"}}>
           {userFavIsHovered ? (
           <IoIosHeart/>
           ):(
           <IoIosHeartEmpty className="banner-icon"/>
           )}
          </Link>
        </div>
      <div className="bag-icon">
        <Link to={bagPath} style={{ color: "inherit" }} className="position-relative d-inline-block">
        <IoBagHandleOutline />
        <span className={`baglength ${'text-dark'} position-absolute top-0 start-100 translate-middle badge rounded-pill ${bagLength === 0 ? 'd-none': 'd-block'}`}>
        {bagLength}
        </span>
        </Link>
      </div>
        <div className="bar-icon d-lg-none d-sm-block">
          <Link style={{color: "inherit"}} onClick={() => handleBarToggle()}>
          <HiOutlineBars2 />
          </Link>
        </div>
      </div>
    </div>
      <RlcOnBarClick/>
      <RlcOnSearchClick/>
      </div>

      </div>
  )
}

export default ProductsHeader
