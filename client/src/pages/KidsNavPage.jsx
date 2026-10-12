

import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader"
import KidsCategory from "../components/ForKids/KidsCategory/KidsCategory"
import KidsShop from "../components/ForKids/KidsShop/KidsShop"
import KidsSlide from "../components/ForKids/KidsSlide/KidsSlide"
import KidsTrend from "../components/ForKids/KidsTrend/KidsTrend"
import KidsExplore from "../components/ForKids/KidsExplore/KidsExplore"



function KidsPage() {

  return (
    <>
      <HomePageHeader/>
      <KidsSlide/>
      <KidsShop/>
      <KidsCategory/>
      <KidsTrend/>
      <KidsExplore/>
      <HomePageFooter/>
    </>
  )
}

export default KidsPage
