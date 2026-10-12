import HomePageFooter from '../components/ForLandingPage/HomePageFooter/HomePageFooter'
import KidsProductsCollection from '../components/ForKids/KidsCollection/KidsProductsCollection'
import './KidsProductsPage.css'
import KidsProductProvider from '../context/kids/KidsProductProvider'
import HeaderBanner from '../components/ForLandingPage/Header/HeaderBanner/HeaderBanner'
import StickyFilter from '../context/kids/StickyFilter'

function KidsProductsPage() {





  return (
    
     <>
     <KidsProductProvider>
      <HeaderBanner/>
      <StickyFilter/>
      <KidsProductsCollection/>
      <HomePageFooter/>
      </KidsProductProvider>
    </>
  )
}

export default KidsProductsPage
