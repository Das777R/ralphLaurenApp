import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import HomePageHeader from "../components/ForLandingPage/Header/HomepageHeader/HomePageHeader"
import MenGrid from "../components/ForMen/MenGrid/MenGrid"
import MenSlide from "../components/ForMen/MenSlide/MenSlide"
import MenStories from "../components/ForMen/MenStories/MenStories"
import MenTrend from "../components/ForMen/MenTrend/MenTrend"
import MenExplore from "../components/ForMen/MenExplore/MenExplore"
import { useState, useEffect } from "react"
import api from "../api/api"

function MenNavPage() {
    const [showMenPage, setShowMenPage] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
              setShowMenPage(true);
          }else{
              setShowMenPage(false);
          }
        }catch(err){
          console.log(err)
        }
        }

        fetchProducts()
      },[]);


    return (
      <>
      {showMenPage ? (
        <>
          <HomePageHeader/>
          <MenSlide/>
          <MenGrid/>
          <MenStories/>
          <MenTrend/>
          <MenExplore/>
          <HomePageFooter/> 
        </>
      ): null}
      </>
    )
}

export default MenNavPage
