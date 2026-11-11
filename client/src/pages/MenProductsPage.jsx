

import ProductsCollectionInfo from '../components/ForMen/MenProducts/ProductsCollectionInfo'
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter"
import MenProductProvider from "../context/men/MenProductProvider"
import HeaderBanner from "../components/ForLandingPage/Header/HeaderBanner/HeaderBanner"
import StickyFilter from '../context/men/StickyFilter'
import { useState, useEffect } from 'react'
import api from '../api/api'


function MenProductsPage() {
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
      <MenProductProvider>
        <HeaderBanner/>
        <StickyFilter/>
        <ProductsCollectionInfo/>
        <HomePageFooter/>
      </MenProductProvider>
    ):null}
    </>
  )
}

export default MenProductsPage
