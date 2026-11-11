import AuthHeader from "../components/Shared/AuthHeader/AuthHeader.jsx";
import FavHero from "../components/ForFavorite/FavHero/FavHero.jsx";
import FavProducts from "../components/ForFavorite/FavProducts/FavProducts.jsx";
import FavPageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx";
import "../styles/FavPage.css";
import { useState, useEffect } from "react";
import api from "../api/api.js";

function FavPage() {
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
      <div className="vh-100">
      <AuthHeader />
      <FavHero/>
      <FavProducts/>
      <FavPageFooter />
      </div>
    ):null}
    </>

  );
}

export default FavPage;