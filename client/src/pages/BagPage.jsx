import AuthHeader from "../components/Shared/AuthHeader/AuthHeader.jsx"
import '../styles/BagPage.css'
import HomePageFooter from '../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx'
import BagProducts from "../components/ForBag/BagProducts/BagProducts.jsx"
import api from "../api/api.js"
import { useState, useEffect } from "react"



function BagPage() {
      const [showBagPage, setShowBagPage] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
              setShowBagPage(true);
          }else{
              setShowBagPage(false);
          }
        }catch(err){
          console.log(err)
        }
        }

        fetchProducts()
      },[]);

  return (
    <>
     {showBagPage ? (
      <div className="vh-100">
        <AuthHeader/>
        <BagProducts/>
        <HomePageFooter/>
      </div>
     ):null}
    </>

  )
}

export default BagPage