import Dmen from "../components/ForDiscover/men/Dmen"
import Dnew from "../components/ForDiscover/new/Dnew"
import Dwomen from '../components/ForDiscover/women/Dwomen'
import Dhome from '../components/ForDiscover/home/Dhome'
import Dsports from '../components/ForDiscover/sports/Dsports'
import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"


function DiscoverNavPage() {
  return (
    <>
    
      <HomePageHeader/>
      <Dnew/>
      <Dmen/>
      <Dwomen/>
      <Dhome/>
      <Dsports/>
      <HomePageFooter/>
    </>
  )
}

export default DiscoverNavPage
