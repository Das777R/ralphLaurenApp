import { useContext } from "react"
import { UIContext } from "../../../context/UIContext"
import { Link, useParams } from "react-router-dom"
import './RlcOnBarClick.css'
import { IoIosHeartEmpty } from "react-icons/io";
import { BsPerson } from "react-icons/bs";


function RlcOnBarClick() {
  const {openRlcBar,handleBarToggle} = useContext(UIContext);

  const {userId} = useParams();

  const mensPath = userId ? `/men-section/${userId}` : '/men-section'
  const womensPath = userId ? `/women-section/${userId}` : '/women-section'
  const authPath = userId ? `/auth/${userId}` : '/auth';

  const favPath = userId? `/fav/${userId}` : '/fav';
  const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';
  const homeNavPath = userId ? `/home-section/${userId}` : `/home-section`;
  const discoverPath = userId ? `/discover-section/${userId}` : `/discover-section`;



  return (  
<div className={`rlc-on-bar ${openRlcBar ?'d-block':'d-none'} d-lg-none w-100 p-4 bg-body position-relative text-dark pb-5`}>
  <Link to={authPath} className="text-decoration-none text-dark">
      <div className="signup-or-login-container" onClick={() => handleBarToggle()}>
          <BsPerson className="banner-icon"/>
      Sign In / Register
      </div>
  </Link>
  <div className="rlc-on-bar-categories-container d-flex gap-3 flex-column py-4">
    <Link to={mensPath} onClick={() => handleBarToggle()} className="text-decoration-none text-dark">
      <div className="on-bar-category">Men</div>
    </Link>
    <Link to={womensPath} className="text-decoration-none text-dark">
      <div className="on-bar-category" onClick={() => handleBarToggle()}>Women</div>
    </Link>
    <Link to={kidsPath} className="text-decoration-none text-dark">
      <div className="on-bar-category" onClick={() => handleBarToggle()}>Kids & Baby</div>
    </Link>
    <Link to={homeNavPath} className="text-decoration-none text-dark">
      <div className="on-bar-category" onClick={() => handleBarToggle()}>Home</div>
    </Link>
     <Link to={discoverPath} className="text-decoration-none text-dark">
      <div className="on-bar-category" onClick={() => handleBarToggle()}>Discover</div>
      </Link>
  </div>

  <div className="rlc-bar-icon-container mt-4 d-flex flex-column gap-3">
    <div className="on-bar-wishlist">
       <IoIosHeartEmpty className="banner-icon"/>
      <Link to={favPath} className="text-decoration-none text-dark">
        <p className="on-bar-whishlist-text">WISHLIST</p>
      </Link>
    </div>
    <div className="on-bar-stores">
      <i className="fa-solid fa-location-dot"></i>
        <p className="on-bar-stores-text">STORES</p>
    </div>
    <div className="on-bar-language">
      <i className="fa-solid fa-globe"></i>
      <p className="on-bar-english-text">IN ENGLISH</p> 
    </div>
  </div>
</div>
  )
}

export default RlcOnBarClick
