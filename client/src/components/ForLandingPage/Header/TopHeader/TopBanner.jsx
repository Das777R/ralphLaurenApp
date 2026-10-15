import { useContext,  useState, useEffect } from "react"
import { UIContext } from "../../../../context/UIContext"
import './TopBanner.css'
import { NavLink, Link, useParams } from 'react-router-dom';
import { IoBagHandleOutline } from "react-icons/io5"
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsPerson, BsPersonFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineBars2 } from "react-icons/hi2";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";


function TopBanner() {
 const {handleSearchToggle, handleBarToggle, setOpenSearchBar, bagLength, setBagLength} = useContext(UIContext);
  const {userId} = useParams();

  const [userProfileIsHovered, setUserProfileIsHovered] = useState(false);
  const [userFavIsHovered, setUserFavIsHovered] = useState(false);
  const [adminIconIsHovered, setAdminIconIsHovered] = useState(false);
  const [Nav, setNav] = useState(false);


  const homePath = userId ? `/${userId}` : '/';
  const mensPath = userId ? `/men-section/${userId}` : '/men-section'
  const womensPath = userId ? `/women-section/${userId}` : '/women-section'
  const authPath = userId ? `/auth/${userId}` : '/auth';
  const bagPath = userId ? `/bag/${userId}` : '/bag';
  const favPath = userId? `/fav/${userId}` : '/fav';
  const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';
  const homeNavPath = userId ? `/home-section/${userId}` : `/home-section`;
  const discoverPath = userId ? `/discover-section/${userId}` : '/discover-section';
   
    
     const handleNav = () => {
      if(Nav){
       setNav(false);
       setOpenSearchBar(true);
      } else {
        setNav(false);
        setOpenSearchBar(false);
      }
     }


    useEffect(() => {
      const lsbag = JSON.parse(localStorage.getItem('bag')) || [];
       const lengbag = lsbag.reduce((i,c) => i + c.qty,0);
       setBagLength(lengbag)
    },[]);

    
  const adminPath = `/admin/auth`; 

  return (
    <div className={`logos-header d-flex justify-content-between align-items-center px-lg-4 px-md-3  w-100 user-select-none ${Nav ? 'nav-open' : ''}`}>
      <div className="d-flex gap-3 align-items-center">
      <Link to={homePath} className="text-decoration-none text-uppercase" style={{color: "inherit"}}>
      <div className={`ralph-logo-user`}>
        ralph lauren
      </div>
      </Link>

      <div className="ralph-categories text-uppercase d-lg-flex gap-lg-3 gap-4 pt-3 pe-5">
        <NavLink to={mensPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
        <div className="category-nav men-nav" onClick={handleNav}>Men</div>
        </NavLink>
        <NavLink to={womensPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
        <div className="category-nav women-nav" onClick={handleNav}>Women</div>
        </NavLink>
        <NavLink to={kidsPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
        <div className="category-nav kids&baby-nav" onClick={handleNav}>kids & baby</div>
        </NavLink>
    
        <NavLink to={homeNavPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>      
        <div className="category-nav home-nav">home</div>
        </NavLink>  
        
        <NavLink to={discoverPath} className={({isActive}) => isActive ? 'text-decoration-underline original-link' : 'original-link'}>
          <div className="category-nav discover-nav">discover</div>
        </NavLink>
        
      </div>
      </div>

      


      <div className="header-icons d-flex gap-lg-4 gap-3 gap-md-3">
        <div className="profile-icon d-none d-lg-block">
          <Link to={adminPath} style={{color: "inherit"}} target='_blank' onMouseEnter={() => setAdminIconIsHovered(true)} onMouseLeave={() => setUserProfileIsHovered(false)}>
          {adminIconIsHovered ? (
           <MdAdminPanelSettings className="banner-icon"/>
          ):(
          <MdOutlineAdminPanelSettings className="banner-icon"/>
          )}
          </Link>
        </div>
        <div className="search-icon" onClick={() => handleSearchToggle()}>
          <IoIosSearch className="banner-icon"/>
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
        <IoBagHandleOutline className="banner-icon"/>
        <span 
        style={{bottom: "1rem",left: '1rem' ,fontSize: "0.7rem", fontWeight:"100"}} 
        className={`position-absolute ${bagLength === 0 ? 'd-none': 'd-block'} `}
        >
        {bagLength}
        </span>
        </Link>
      </div>
        <div className="bar-icon d-lg-none d-sm-block" onClick={() => handleBarToggle()}>
          <HiOutlineBars2 className="banner-icon"/>
        </div>
      </div>
    </div>
  )
}

export default TopBanner
