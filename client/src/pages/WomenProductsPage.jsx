import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import WproductCollection from "../components/ForWomen/WomenProducts/WproductCollection"
import WomenProductProvider from "../context/women/WomenProductProvider"
import HeaderBanner from "../components/ForLandingPage/Header/HeaderBanner/HeaderBanner"
import StickyFilter from "../context/women/StickyFilter"
import { useState, useEffect } from "react"
import api from "../api/api"

function WomenProductsPage() {
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
    <WomenProductProvider>
      <HeaderBanner/>
      <StickyFilter/>
      <WproductCollection/>
      <HomePageFooter/>
     </WomenProductProvider>
    ):null}

    </>
  )
}

export default WomenProductsPage
