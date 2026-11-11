import HeroSection from "../components/ForLandingPage/HeroSection/HeroSection.jsx"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx"
import ProductsBlock from "../components/Shared/ProductsBlock/ProductsBlock.jsx"
import WorldLuxury from "../components/ForLandingPage/WorldLuxury/WorldLuxury.jsx"
import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader.jsx"
import WomenTrend from '../components/ForWomen/WomenTrend/WomenTrend.jsx'
import AdsSection from "../components/ForLandingPage/Ads/AdsSection.jsx"
import { useState, useEffect } from "react"
import api from "../api/api.js"

function LandingPage() {
  const [showLandingPage, setShowLandingPage] = useState(false);
    useEffect(() => {
       const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
             setShowLandingPage(true);
          }else{
             setShowLandingPage(false);
          }
        }catch(err){
          console.log(err)
        }
       }
  
       fetchProducts()
    },[])
  return (
    <>
    {showLandingPage ? (
      <>
      <HomePageHeader/>
      <HeroSection/>
      <ProductsBlock/>
      <WomenTrend/>
      <AdsSection/>
      <WorldLuxury/>
      <HomePageFooter/>
      </>
    ) : null}

    </>
  )
}

export default LandingPage
