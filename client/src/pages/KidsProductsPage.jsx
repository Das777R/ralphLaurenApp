import HomePageFooter from '../components/ForLandingPage/HomePageFooter/HomePageFooter'
import KidsProductsCollection from '../components/ForKids/KidsCollection/KidsProductsCollection'
import './KidsProductsPage.css'
import KidsProductProvider from '../context/kids/KidsProductProvider'
import HeaderBanner from '../components/ForLandingPage/Header/HeaderBanner/HeaderBanner'
import StickyFilter from '../context/kids/StickyFilter'
import { useState, useEffect } from 'react'
import api from '../api/api'

function KidsProductsPage() {
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
    <KidsProductProvider>
      <HeaderBanner/>
      <StickyFilter/>
      <KidsProductsCollection/>
      <HomePageFooter/>
    </KidsProductProvider>
     ):null}

    </>
  )
}

export default KidsProductsPage
