import { useContext } from "react";
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter";
import ProductsHeader from "../components/Shared/ProductsHeader/ProductsHeader";
import LookProduct from "../components/Shared/LookProduct/LookProduct";
import { UIContext } from "../context/UIContext";

function ProductLookOutPage() {
  const { completeLookOpen } = useContext(UIContext);

  return (
    <>
      {!completeLookOpen && <ProductsHeader />}
      <LookProduct />
      {!completeLookOpen && <HomePageFooter />}
    </>
  );
}

export default ProductLookOutPage;