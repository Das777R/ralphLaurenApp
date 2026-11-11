import { useContext } from "react";
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter";
import ProductsHeader from "../components/Shared/ProductsHeader/ProductsHeader";
import LookProduct from "../components/Shared/LookProduct/LookProduct";
import { UIContext } from "../context/UIContext";
import api from "../api/api";
import { useState, useEffect } from "react";

function ProductLookOutPage() {
  const { completeLookOpen } = useContext(UIContext);
  const [showLookPage, setShowLookPage] = useState(false);

  useEffect(() => {
  const fetchProducts = async () => {
  try{
    const res = await api.get('/product');
    console.log(res.data.success);
    if(res.data.success){
        setShowLookPage(true);
    }else{
        setShowLookPage(false);
    }
  }catch(err){
    console.log(err)
  }
  }

  fetchProducts()
  },[]);

  return (
    <>
    {showLookPage ? (
    <>
    {!completeLookOpen && <ProductsHeader />}
    <LookProduct />
    {!completeLookOpen && <HomePageFooter />}
    </>
    ): null}
    </>

  );
}

export default ProductLookOutPage;