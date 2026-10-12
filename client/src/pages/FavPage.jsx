import AuthHeader from "../components/Shared/AuthHeader/AuthHeader.jsx";
import FavHero from "../components/ForFavorite/FavHero/FavHero.jsx";
import FavProducts from "../components/ForFavorite/FavProducts/FavProducts.jsx";
import HomePageFooter from "../components/ForLandingPage/HomePageFooter/HomePageFooter.jsx";
import "../styles/FavPage.css";


function FavPage() {

  return (
    <div className="vh-100">
    <AuthHeader />
    <FavHero/>
    <FavProducts/>
    <HomePageFooter />
    </div>
  );
}

export default FavPage;