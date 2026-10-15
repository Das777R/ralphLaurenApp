import HeaderBanner from "../../ForLandingPage/Header/HeaderBanner/HeaderBanner"
import { NavLink, Link } from "react-router-dom";
import RlcOnBarClick from "../OnBarClick/RlcOnBarClick";
import RlcOnSearchClick from "../OnSearchClick/RlcOnSearchClick";
import { useContext, useState,useEffect } from "react";
import { UIContext } from "../../../context/UIContext";
import { useParams } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5"
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import './AuthHeader.css';
import { BsPerson, BsPersonFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineBars2 } from "react-icons/hi2";


function AuthHeader() {
   const {handleSearchToggle, handleBarToggle, bagLength, setBagLength, bagProducts, setBagProducts } = useContext(UIContext);
   const [userProfileIsHovered, setUserProfileIsHovered] = useState(false);
   const [userFavIsHovered, setUserFavIsHovered] = useState(false);

  const {userId} = useParams();

  useEffect(() => {
  const lsbag = JSON.parse(localStorage.getItem('bag')) || [];
  const lengbag = lsbag.reduce((i,c) => i + c.qty,0);
  setBagLength(lengbag)
  },[bagProducts, setBagProducts ]);


  
  const homePath = userId ? `/${userId}` : '/';
  const menPath = userId ? `/men-section/${userId}`: '/men-section';
  const womenPath = userId ? `/women-section/${userId}`: '/women-section'
  const authPath = userId ? `/auth/${userId}` : '/auth';
  const bagPath = userId ? `/bag/${userId}` : '/bag';
  const favPath = userId? `/fav/${userId}` : '/fav';
  const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';
   const homeNavPath = userId ? `/home-section/${userId}` : `/home-section`;
  const discoverPath = userId ? `/discover-section/${userId}` : '/discover-section';

  return (
    <div className="header-banner-container user-select-none position-fixed w-100 top-0 user-select-none ">
    <HeaderBanner/>
    <div className={`header-banner-container-ralph-products position-relative w-100 px-lg-4 px-md-3  w-100 top-0 `}>
    <div className={`logos-header d-flex justify-content-between align-items-center  w-100`}>
    <div className="d-flex gap-3 align-items-center">
    <Link to={homePath} className="text-decoration-none text-uppercase" style={{color: "inherit"}}>
    <div className="ralph-logo">
    ralph lauren
    </div>
    </Link>
    <div className="ralph-categories text-uppercase d-lg-flex gap-4 pt-3 pe-5">
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
    <IoIosHeart className="banner-icon"/>
      ):(
   <IoIosHeartEmpty className="banner-icon"/>
      )}
    </Link>
    </div>
    <div className="bag-icon">
    <Link to={bagPath} style={{ color: "inherit" }} className="position-relative d-inline-block">
    <IoBagHandleOutline className="banner-icon" />
    <span 
    style={{bottom: "1rem",left: '1rem' ,fontSize: "0.8rem", fontWeight:"100"}} 
    className={`position-absolute text-dark ${bagLength === 0 ? 'd-none': 'd-block'} `}
    >
    {bagLength}
    </span>
    </Link>
    </div>
    <div className="bar-icon d-lg-none d-sm-block">
    <Link style={{color: "inherit"}} onClick={() => handleBarToggle()}>
     <HiOutlineBars2 className="banner-icon" />
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

export default AuthHeader