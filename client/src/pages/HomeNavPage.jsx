import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader";
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter";
import HomeSlide from "../components/ForHome/HomeSlide/HomeSlide";
import HomeShop from "../components/ForHome/HomeShop/HomeShop";
import HomeExplore from "../components/ForHome/HomeExplore/HomeExplore";
import HomeTrend from "../components/ForHome/HomeTrend/HomeTrend";
import HomeCategory from "../components/ForHome/HomeCategory/HomeCategory";
import { useState, useEffect } from "react";
import api from "../api/api";

function HomeNavPage() {
      const [showHomePage, setShowHomePage] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
              setShowHomePage(true);
          }else{
              setShowHomePage(false);
          }
        }catch(err){
          console.log(err)
        }
        }

        fetchProducts()
      },[]);
  return (
    <>
     {showHomePage ? (
      <div>
        <HomePageHeader/>
        <HomeSlide/>
        <HomeShop/>
        <HomeCategory/>
        <HomeTrend/>
        <HomeExplore/>
        <HomePageFooter/>
      </div>
     ):null}
    </>

  )
}

export default HomeNavPage
