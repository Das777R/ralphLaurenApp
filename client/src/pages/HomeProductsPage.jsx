import HomeCollection from "../components/ForHome/HomeCollection/HomeColllection";
import HeaderBanner from "../components/ForLandingPage/Header/HeaderBanner/HeaderBanner"
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter";
import HomeProductProvider from "../context/home/HomeProductProvider";
import StickyFilterHome from "../context/home/StickyFilterHome";
import { useState, useEffect } from "react";
import api from "../api/api";



function HomeProductsPage() {
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
    <HomeProductProvider>
      <HeaderBanner/>
      <StickyFilterHome/>
      <HomeCollection/>
      <HomePageFooter/>
    </HomeProductProvider>
    ):null}
    </>

  )
}

export default HomeProductsPage
