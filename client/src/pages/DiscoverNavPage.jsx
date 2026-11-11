import Dmen from "../components/ForDiscover/men/Dmen"
import Dnew from "../components/ForDiscover/new/Dnew"
import Dwomen from '../components/ForDiscover/women/Dwomen'
import Dhome from '../components/ForDiscover/home/Dhome'
import Dsports from '../components/ForDiscover/sports/Dsports'
import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import api from "../api/api"
import { useState, useEffect } from "react"

function DiscoverNavPage() {
      const [showFavPage, setShowFavPage] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
              setShowFavPage(true);
          }else{
              setShowFavPage(false);
          }
        }catch(err){
          console.log(err)
        }
        }

        fetchProducts()
      },[]);
      
  return (
    <>
    {showFavPage ? (
    <>
    <HomePageHeader/>
    <Dnew/>
    <Dmen/>
    <Dwomen/>
    <Dhome/>
    <Dsports/>
    <HomePageFooter/>
    </>
    ):null}
    </>
  )
}

export default DiscoverNavPage
