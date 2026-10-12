import ProductsHeader from "../components/Shared/ProductsHeader/ProductsHeader.jsx";
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx";
import SearchInput from "../components/ForSearched/SearchInput/SearchInput.jsx";
import SearchHeading from "../components/ForSearched/SearchHeading/SearchHeading.jsx";
import SearchedProducts from "../components/ForSearched/SearchedProducts/SearchedProducts.jsx";

function SearchedPage() {
  return (
    <div className="w-100 overflow-hidden">
      <ProductsHeader />
      <SearchInput />
      <SearchHeading />
      <SearchedProducts />
      <HomePageFooter />
    </div>
  );
}

export default SearchedPage;