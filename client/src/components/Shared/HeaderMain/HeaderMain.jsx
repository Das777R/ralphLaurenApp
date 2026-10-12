import TopBanner from "../../ForLandingPage/Header/TopHeader/TopBanner";
import RlcOnBarClick from "../OnBarClick/RlcOnBarClick";
import RlcOnSearchClick from "../OnSearchClick/RlcOnSearchClick";
import { useState, useEffect } from "react";
import './HeaderMain.css';

function HeaderMain() {
const [isScrolled, setIsScrolled] = useState(false);


useEffect(() => {
  const handleScroll = () => {
   if(window.scrollY > 0){
      setIsScrolled(true);
      
    } else {
      setIsScrolled(false);

    }
  }

  window.addEventListener('scroll', handleScroll)

  return () => window.addEventListener('scroll', handleScroll)
},[])




return (
    <div className={`header-banner-container-ralph  ${isScrolled ? 'ralphBigHeader-scrolled': null} position-fixed w-100`}>
      <TopBanner/>
      <RlcOnBarClick/>
      <RlcOnSearchClick/>
    </div>
  )
}

export default HeaderMain
