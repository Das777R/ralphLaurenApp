

import ProductsCollectionInfo from '../components/ForMen/MenProducts/ProductsCollectionInfo'
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import MenProductProvider from "../context/men/MenProductProvider"
import HeaderBanner from "../components/ForLandingPage/Header/HeaderBanner/HeaderBanner"
import StickyFilter from '../context/men/StickyFilter'


function MenProductsPage() {
  return (
    <>
    <MenProductProvider>
      <HeaderBanner/>
      <StickyFilter/>
      <ProductsCollectionInfo/>
      <HomePageFooter/>
    </MenProductProvider>

    </>
  )
}

export default MenProductsPage
