import './HomeCollection.css';
import { useParams, Link } from 'react-router-dom';
import { useProductsContext } from '../../../context/home/HomeProductContext';
import { IoIosClose } from "react-icons/io";
import HomeProducts from '../HomeProducts/HomeProducts';

function HomeCollection() {
  const {
    filterBtn,
    handleFilterByCat,
    handleCloseFilterPop 
  } = useProductsContext();

  const { category, userId } = useParams();
  const cleanCategory = decodeURI(category || '').toLowerCase();
  
  const isBath = cleanCategory.includes("bath") || cleanCategory.includes("towel");
  const isPillows = cleanCategory.includes("pillow") || cleanCategory.includes("cushion");
  const isThrows = cleanCategory.includes("throw") || cleanCategory.includes("blanket");
  const isFrames = cleanCategory.includes("frame");
  const isDrinkware = cleanCategory.includes("drinkware");
  const isTables = cleanCategory.includes("Tableware");

  const homePath = userId ? `/home-section/${userId}` : '/home-section';
  const h_bath_path = userId ? `/home-section/category/bath/${userId}` : `/home-section/category/bath`;
  const h_pillows_path = userId ? `/home-section/category/pillows & cushions/${userId}` : `/home-section/category/pillows & cushions`;
  const h_throws_path = userId ? `/home-section/category/throws & blankets/${userId}` : `/home-section/category/throws & blankets`;
  const h_frames_path = userId ? `/home-section/category/frames/${userId}` : `/home-section/category/frames`;
  const h_drinkware_path = userId ? `/home-section/category/drinkware/${userId}` : `/home-section/category/drinkware`;
  const h_tables_path = userId ? `/home-section/category/tables/${userId}` : `/home-section/category/Tableware`;

  return (
    <>
      {isBath && (
        <div className='home-collection-info-container boys-shirt-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link className="text-white me-2" style={{ textDecoration: "inherit" }} to={homePath}>
              Home
            </Link>
            /
            <Link className="text-white mx-2" style={{ textDecoration: "inherit" }} to={h_bath_path}>
              Bath
            </Link>
            /
          </div>

          <h1 className='home-collection-info-title text-capitalize'>Designer Towels & Bath Mats</h1>
          <p className="home-collection-info-text text-white">
            Designed with premium absorbency and a soft touch, Ralph Lauren’s bath towels and mats provide spa-like quality at home. The plush fabrics, including cottons and high-looped cotton terry, have antimicrobial properties to maintain freshness.
          </p>

     
        </div>
      )}

      {isPillows && (
        <div className='home-collection-info-container boys-jumpers-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link className="text-white me-2" style={{ textDecoration: "inherit" }} to={homePath}>
              Home
            </Link>
            /
            <Link className="text-white mx-2" style={{ textDecoration: "inherit" }} to={h_pillows_path}>
              Bedding
            </Link>
            /
          </div>

          <h1 className='home-collection-info-title text-capitalize'>Designer Pillows & Cushions</h1>
          <p className="home-collection-info-text text-white">
            Mix decorative throw pillows with bold prints, refined textures, and embroidered accents in complementary colour palettes to find the keys to well-appointed bedroom sets.
          </p>

        
        </div>
      )}

      {isThrows && (
        <div className='home-collection-info-container girls-jumpers-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link className="text-white me-2" style={{ textDecoration: "inherit" }} to={homePath}>
              Home
            </Link>
            /
            <Link className="text-white mx-2" style={{ textDecoration: "inherit" }} to={h_throws_path}>
              Bedding
            </Link>
            /
          </div>

          <h1 className='home-collection-info-title text-capitalize'>Designer Throws & Blankets</h1>
          <p className="home-collection-info-text text-white">
            A comforting addition to every room. Whether it’s artfully draped at the end of a bed or tossed over your legs on a cosy evening in, a throw blanket always warms up the space.
          </p>

      
        </div>
      )}

      {isFrames && (
        <div className='home-collection-info-container boys-jackets-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link className="text-white me-2" style={{ textDecoration: "inherit" }} to={homePath}>
              Home
            </Link>
            /
            <Link className="text-white mx-2" style={{ textDecoration: "inherit" }} to={h_frames_path}>
              Decor
            </Link>
            /
          </div>

          <h1 className='home-collection-info-title text-capitalize'>Designer Frames</h1>
          <p className="home-collection-info-text text-white">
            Transform your favourite moments into meaningful memories. Ralph Lauren’s designer picture frames elevate your most cherished photos into artful décor.
          </p>

   
        </div>
      )}

      {isDrinkware && (
        <div className='home-collection-info-container girls-jackets-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link className="text-white me-2" style={{ textDecoration: "inherit" }} to={homePath}>
              Home
            </Link>
            /
            <Link className="text-white mx-2" style={{ textDecoration: "inherit" }} to={h_drinkware_path}>
              Dining
            </Link>
            /
          </div>

          <h1 className='home-collection-info-title text-capitalize'>Designer Drinkware</h1>
          <p className="home-collection-info-text text-white">
            Sophisticated Ralph Lauren glassware and drinkware exhibit considered crafting and timeless design.
          </p>

    
        </div>
      )}

      {isTables && (
        <div className='home-collection-info-container girls-tshirts-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link className="text-white me-2" style={{ textDecoration: "inherit" }} to={homePath}>
              Home
            </Link>
            /
            <Link className="text-white mx-2" style={{ textDecoration: "inherit" }} to={h_tables_path}>
              Furniture
            </Link>
            /
          </div>

          <h1 className='home-collection-info-title text-capitalize'>Designer Tables</h1>
          <p className="home-collection-info-text text-white">
            Ralph Lauren furniture is thoughtfully designed and expertly crafted with an unwavering commitment to quality.
          </p>

      
        </div>
      )}

      <div className="home-collection-product-container d-flex flex-wrap justify-content-center mt-5">
        <HomeProducts />
      </div>
    </>
  );
}

export default HomeCollection;