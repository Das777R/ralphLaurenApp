import CategoryGrid from "../components/ForWomen/CategoryGrid/CategoryGrid"
import SlideCarousel from "../components/ForWomen/SlideCarousel/SlideCarousel"
import StoriesScroll from "../components/ForWomen/StoriesScroll/StoriesScroll"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import HomePageHeader from '../components/ForLandingPage/Header/HomepageHeader/HomePageHeader'
import WomenTrend from "../components/ForWomen/WomenTrend/WomenTrend"
import WomenExplore from "../components/ForWomen/WomenExplore/WomenExplore"
import { useState, useEffect } from "react"
import api from "../api/api"


function WomenNavPage() {
       const [showWomenPage, setShowWomenPage] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
              setShowWomenPage(true);
          }else{
              setShowWomenPage(false);
          }
        }catch(err){
          console.log(err)
        }
        }

        fetchProducts()
      },[]);
  return (
    <>
    {showWomenPage ? (
      <>
        <HomePageHeader/>
        <SlideCarousel/>
        <CategoryGrid/>
        <StoriesScroll/>
        <WomenTrend/>
        <WomenExplore/>
        <HomePageFooter/>
      </>
    ):null}
    </>

  )
}

export default WomenNavPage
