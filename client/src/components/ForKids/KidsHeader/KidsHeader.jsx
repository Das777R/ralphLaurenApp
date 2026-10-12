
import { useContext, useEffect, useState } from "react";
import { UIContext } from "../../../context/UIContext";
import { Link, NavLink } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5"
import './KidsHeader.css';
import { useParams } from "react-router-dom";
import RlcOnBarClick from "../../ForSearched/OnBarClick/RlcOnBarClick";
import RlcOnSearchClick from "../../ForSearched/OnSearchClick/RlcOnSearchClick";
import HeaderBanner from '../../ForLandingPage/Header/HeaderBanner';
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsPerson, BsPersonFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineBars2 } from "react-icons/hi2";


function KidsHeader() {

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

useEffect(() => {
const lsbag = JSON.parse(localStorage.getItem('bag'));
const lengbag = lsbag.length;
setBagLength(lengbag)
},[])




return (
<div className="header-banner-container-kids user-select-none position-relative">
<HeaderBanner/>

<div className={`header-banner-container-ralph-products-kids position-relative w-100`}>
<div className={`d-flex justify-content-between align-items-center px-4  w-100`}>
<Link to={homePath} className="text-decoration-none text-uppercase" style={{color: "inherit"}}>
<div className="ralph-logo">
ralph lauren
</div>
</Link>
<div className="ralph-categories-kids text-uppercase d-lg-flex gap-4 pt-3 pe-5">
<NavLink to={menPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link-kids' : 'original-link-kids'}>
<div className="category-nav-kids">Men</div>
</NavLink>
<NavLink to={womenPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link-kids' : 'original-link-kids'}>
<div className="category-nav-kids">Women</div>
</NavLink>
<NavLink to={kidsPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link-kids' : 'original-link-kids'}>
<div className="category-nav-kids">kids & baby</div>
</NavLink>
<div className="category-nav-kids">home</div>
<div className="category-nav-kids">discover</div>
<div className="category-nav-kids">sale</div>
</div>

<div className="header-icons-kids d-flex gap-4">
<div className="search-icon-kids">
<Link onClick={() => handleSearchToggle()} style={{color: "inherit"}}>
<IoIosSearch className="banner-icon"/>
</Link>
</div>
<div className="profile-icon-kids d-none d-lg-block">
<Link to={authPath} style={{color: "inherit"}} onMouseEnter={() => setUserProfileIsHovered(true)} onMouseLeave={() => setUserProfileIsHovered(false)}>
{userProfileIsHovered ? (
           <BsPersonFill className="banner-icon"/>
          ):(
          <BsPerson className="banner-icon"/>
)}
</Link>
</div>
<div className="fav-icon-kids d-none d-lg-block">
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
<div className="bag-icon-kids">
<Link to={bagPath} style={{ color: "inherit" }} className="position-relative d-inline-block">
<IoBagHandleOutline />
<span style={{bottom: "-0.5rem",fontSize: "0.8rem", fontWeight:"200"}} className={`${'text-dark'} position-absolute top-0 start-100 translate-middle badge rounded-pill`}>
{bagLength}
</span>
</Link>
</div>
<div className="bar-icon-kids d-lg-none d-sm-block">
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

export default KidsHeader