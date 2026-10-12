import CategoryGrid from "../components/ForWomen/CategoryGrid/CategoryGrid"
import SlideCarousel from "../components/ForWomen/SlideCarousel/SlideCarousel"
import StoriesScroll from "../components/ForWomen/StoriesScroll/StoriesScroll"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import HomePageHeader from '../components/ForLandingPage/Header/HomepageHeader/HomePageHeader'
import WomenTrend from "../components/ForWomen/WomenTrend/WomenTrend"
import WomenExplore from "../components/ForWomen/WomenExplore/WomenExplore"


function WomenNavPage() {
  return (
    <>
    <HomePageHeader/>
     <SlideCarousel/>
     <CategoryGrid/>
     <StoriesScroll/>
     <WomenTrend/>
     <WomenExplore/>
     <HomePageFooter/>
    </>
  )
}

export default WomenNavPage
