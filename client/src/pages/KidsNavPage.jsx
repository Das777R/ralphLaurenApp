

import KidsPageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import KidsPageHeader from "../components/ForLandingPage/Header/HeaderBanner/HeaderBanner"
import KidsCategory from "../components/ForKids/KidsCategory/KidsCategory"
import KidsShop from "../components/ForKids/KidsShop/KidsShop"
import KidsSlide from "../components/ForKids/KidsSlide/KidsSlide"
import KidsTrend from "../components/ForKids/KidsTrend/KidsTrend"
import KidsExplore from "../components/ForKids/KidsExplore/KidsExplore"
import { useState, useEffect } from "react";
import api from "../api/api"


function KidsPage() {
      const [showKidsPage, setShowKidsPage] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
              setShowKidsPage(true);
          }else{
              setShowKidsPage(false);
          }
        }catch(err){
          console.log(err)
        }
        }

        fetchProducts()
      },[]);

  return (
    <>
    {showKidsPage ? (
      <>
      <KidsPageHeader/>
      <KidsSlide/>
      <KidsShop/>
      <KidsCategory/>
      <KidsTrend/>
      <KidsExplore/>
      <KidsPageFooter/>
      </>
    ):null}
    </>
  )
}

export default KidsPage
