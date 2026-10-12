import AuthHeader from "../components/Shared/AuthHeader/AuthHeader.jsx"
import '../styles/BagPage.css'
import HomePageFooter from '../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx'
import BagProducts from "../components/ForBag/BagProducts/BagProducts.jsx"




function BagPage() {

  return (
    <div className="vh-100">
      <AuthHeader/>
      <BagProducts/>
      <HomePageFooter/>
    </div>
  )
}

export default BagPage