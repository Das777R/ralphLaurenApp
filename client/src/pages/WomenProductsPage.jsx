import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import WproductCollection from "../components/ForWomen/WomenProducts/WproductCollection"
import WomenProductProvider from "../context/women/WomenProductProvider"
import HeaderBanner from "../components/ForLandingPage/Header/HeaderBanner/HeaderBanner"
import StickyFilter from "../context/women/StickyFilter"

function WomenProductsPage() {
  return (
    <>
    <WomenProductProvider>
       <HeaderBanner/>
       <StickyFilter/>
      <WproductCollection/>
      <HomePageFooter/>
    </WomenProductProvider>
    </>
  )
}

export default WomenProductsPage
