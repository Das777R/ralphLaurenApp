import HomeCollection from "../components/ForHome/HomeCollection/HomeColllection";
import HeaderBanner from "../components/ForLandingPage/Header/HeaderBanner/HeaderBanner"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter";
import HomeProductProvider from "../context/home/HomeProductProvider";
import StickyFilterHome from "../context/home/StickyFilterHome";



function HomeProductsPage() {
  return (
    <HomeProductProvider>
      <HeaderBanner/>
      <StickyFilterHome/>
     <HomeCollection/>
      <HomePageFooter/>
    </HomeProductProvider>
  )
}

export default HomeProductsPage
