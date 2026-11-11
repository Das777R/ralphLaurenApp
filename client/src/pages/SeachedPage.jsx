import ProductsHeader from "../components/Shared/ProductsHeader/ProductsHeader.jsx";
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx";
import SearchInput from "../components/ForSearched/SearchInput/SearchInput.jsx";
import SearchHeading from "../components/ForSearched/SearchHeading/SearchHeading.jsx";
import SearchedProducts from "../components/ForSearched/SearchedProducts/SearchedProducts.jsx";
import { useState, useEffect } from "react";
import api from "../api/api.js";


function SearchedPage() {
     const [showSearchPage, setShowSearchPage] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
        try{
          const res = await api.get('/product');
          console.log(res.data.success);
          if(res.data.success){
              setShowSearchPage(true);
          }else{
              setShowSearchPage(false);
          }
        }catch(err){
          console.log(err)
        }
        }

        fetchProducts()
      },[]);
  return (
    <>
     {showSearchPage ? (
      <div className="w-100 overflow-hidden">
      <ProductsHeader />
      <SearchInput />
      <SearchHeading />
      <SearchedProducts />
      <HomePageFooter />
      </div>
     ):null}
    </>

  );
}

export default SearchedPage;