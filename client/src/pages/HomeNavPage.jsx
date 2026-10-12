import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader";
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter";
import HomeSlide from "../components/ForHome/HomeSlide/HomeSlide";
import HomeShop from "../components/ForHome/HomeShop/HomeShop";
import HomeExplore from "../components/ForHome/HomeExplore/HomeExplore";
import HomeTrend from "../components/ForHome/HomeTrend/HomeTrend";
import HomeCategory from "../components/ForHome/HomeCategory/HomeCategory";

function HomeNavPage() {
  return (
    <div>
     <HomePageHeader/>
     <HomeSlide/>
     <HomeShop/>
     <HomeCategory/>
     <HomeTrend/>
     <HomeExplore/>
     <HomePageFooter/>
    </div>
  )
}

export default HomeNavPage
