import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader"
import MenGrid from "../components/ForMen/MenGrid/MenGrid"
import MenSlide from "../components/ForMen/MenSlide/MenSlide"
import MenStories from "../components/ForMen/MenStories/MenStories"
import MenTrend from "../components/ForMen/MenTrend/MenTrend"
import MenExplore from "../components/ForMen/MenExplore/MenExplore"

function MenNavPage() {
  return (
    <>
    <HomePageHeader/>
    <MenSlide/>
    <MenGrid/>
    <MenStories/>
    <MenTrend/>
    <MenExplore/>
    <HomePageFooter/> 
    </>
  )
}

export default MenNavPage
