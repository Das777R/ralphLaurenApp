import HeroSection from "../components/ForLandingPage/HeroSection/HeroSection.jsx"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx"
import ProductsBlock from "../components/Shared/ProductsBlock/ProductsBlock.jsx"
import WorldLuxury from "../components/ForLandingPage/WorldLuxury/WorldLuxury.jsx"
import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader.jsx"
import WomenTrend from '../components/ForWomen/WomenTrend/WomenTrend.jsx'
import AdsSection from "../components/ForLandingPage/Ads/AdsSection.jsx"

function LandingPage() {
  return (
    <>
      <HomePageHeader/>
      <HeroSection/>
      <ProductsBlock/>
      <WomenTrend/>
      <AdsSection/>
      <WorldLuxury/>
      <HomePageFooter/>
    </>
  )
}

export default LandingPage
