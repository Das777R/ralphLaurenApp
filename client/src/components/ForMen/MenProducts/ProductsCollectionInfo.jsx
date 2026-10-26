import './ProductsCollectionInfo.css';
import MenProducts from '../MenProductBox/MenProducts';
import { useParams, Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useMenContext } from '../../../context/men/MenProductContext';
import { IoIosClose } from "react-icons/io";

function ProductsCollectionInfo() {
  const {
  typeForCasualShirts,
  typeForPoloShirts,
  typeForJumpers,
  typeForjackets,
  typeShorts,
  typeAccessories,
  filterBtn,
  handleFilterByCat,
  handleCloseFilterPop } = useMenContext();
  const { category, userId } = useParams();

  const cleanCategory = decodeURI(category);

  const isCasualShirt = cleanCategory === 'casual shirts';
  const isPoloShirts = cleanCategory === 'polo shirts';
  const isJumpers = cleanCategory === 'jumpers & cardigans';
  const isJackets = cleanCategory === 'jackets & coats';
  const isShorts = cleanCategory === 'shorts';
  const isAccessories = cleanCategory === 'accessories';

  const casualTextRef = useRef(null);
  const casualBtnRef = useRef(null);
  const casualTruncatRef = useRef(null);

  const poloTextRef = useRef(null);
  const poloBtnRef = useRef(null);
  const poloTruncatRef = useRef(null);

  const jumpersTextRef = useRef(null);
  const jumpersBtnRef = useRef(null);
  const jumpersTruncatRef = useRef(null);

  const jacketsTextRef = useRef(null);
  const jacketsBtnRef = useRef(null);
  const jacketsTruncatRef = useRef(null);

  const shortsTextRef = useRef(null);
  const shortsBtnRef = useRef(null);
  const shortsTruncatRef = useRef(null);

  const accessoriesTextRef = useRef(null);
  const accessoriesBtnRef = useRef(null);
  const accessoriesTruncatRef = useRef(null);

  const [handleEnterCat, setHandleEnterCat] = useState(null);

  function handleToggle(textRef, btnRef, truncatRef) {
    if (!textRef.current) {
      return;
    }

    const isHidden = textRef.current.classList.contains('d-none');

    if (isHidden) {
      textRef.current.classList.remove('d-none');
      textRef.current.classList.add('d-inline');

      btnRef.current.textContent = 'View Less';

      if (truncatRef?.current) {
        truncatRef.current.textContent = ' ';
      }
    } else {
      textRef.current.classList.add('d-none');
      textRef.current.classList.remove('d-inline');

      btnRef.current.textContent = 'View More';

      if (truncatRef?.current) {
        truncatRef.current.textContent = '...';
      }
    }
  }

  const mensPath = userId ? `/men-section/${userId}` : '/men-section';

  const m_casual_shirts_path = userId ? `/men-section/category/casual shirts/${userId}`:`/men-section/category/casual shirts`;
  const m_polo_shirts_path = userId ? `/men-section/category/polo shirts/${userId}`:`/men-section/category/polo shirts`;
  const m_jumpers_path = userId ? `/men-section/category/jumpers & cardigans/${userId}`: `/men-section/category/jumpers & cardigans`;
  const m_jackets_path = userId ? `/men-section/category/jackets & coats/${userId}`:`/men-section/category/jackets & coats`;
  const m_shorts_path = userId ? `/men-section/category/shorts/${userId}` : `/men-section/category/shorts`;
  const m_accessories_path = userId ? `/men-section/category/accessories/${userId}` : `/men-section/category/accessories`;

  return (
    <>
      {isCasualShirt && (
        <div className="products-collection-info-container casual-shirt-container">
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'men' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('men')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={mensPath}
            >
              men
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'casual shirts' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('casual shirts')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={m_casual_shirts_path}
            >
              casual shirts
            </Link>
            /
          </div>

          <h1 className="products-collection-info-title text-capitalize">
            Men's Casual Shirts
          </h1>
          <p className="products-collection-info-text text-white">
            Unmatched comfort meets effortless everyday versatility. Crafted
            from lightweight cotton and breathable linens, our casual shirts
            range from crisp button-downs to relaxed overshirts designed for
            any weekend outing
            <span ref={casualTruncatRef}>...</span>
            <span className="d-none mt-2" ref={casualTextRef}>
              Whether you are layering up for a chilly evening or heading out
              for a sunny coastal drive, these curated silhouettes ensure you
              maintain a sharp, refined profile without ever feeling overdressed.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 view-more-btn"
              ref={casualBtnRef}
              onClick={() => handleToggle(casualTextRef, casualBtnRef, casualTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2  text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForCasualShirts.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize  rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'casual shirts')}
              >
                {t}
              </div>
            ))}
          </div>
         
        </div>
      )}

      {isPoloShirts && (
        <div className="products-collection-info-container polo-shirt-container">
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2  ${handleEnterCat === 'men' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('men')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={mensPath}
            >
              men
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'polo shirts' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('polo shirts')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={m_polo_shirts_path}
            >
              polo shirts
            </Link>
            /
          </div>

          <h1 className="products-collection-info-title text-capitalize">
            Men's Polo Shirts
          </h1>
          <p className="products-collection-info-text text-white">
            Unmatched since 1972, the signature polo shirt remains a beloved
            icon of culture and style. Casual yet sophisticated, polos work as
            well on the beach with chinos as they do under a tailored blazer
            for dinner
            <span ref={poloTruncatRef}>...</span>
            <span className="d-none mt-2" ref={poloTextRef}>
              Engineered with premium mesh cotton for optimal breathability
              and a tailored fit, each piece delivers timeless elegance that
              transitions seamlessly through every season and casual occasion.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 view-more-btn"
              ref={poloBtnRef}
              onClick={() => handleToggle(poloTextRef, poloBtnRef, poloTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForPoloShirts.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize  rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'polo shirts')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isJumpers && (
        <div className="products-collection-info-container jumpers-container">
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'men' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('men')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={mensPath}
            >
              men
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'jumpers & cardigans' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('jumpers & cardigans')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={m_jumpers_path}
            >
              jumpers & cardigans
            </Link>
            /
          </div>

          <h1 className="products-collection-info-title text-capitalize">
            Men's Jumpers & Cardigans
          </h1>
          <p className="products-collection-info-text text-white">
            A signature mix of sophisticated comfort and classic American
            style. Our thoughtfully designed men's jumpers – including wool
            turtlenecks, shawl cardigans and cashmere crewnecks – add warmth
            and flair
            <span ref={jumpersTruncatRef}>...</span>
            <span className="d-none mt-2" ref={jumpersTextRef}>
              Sourced from the finest fabrics, these knitwear essentials offer
              exceptional softness and insulation, making them indispensable
              additions to your cold-weather layering repertoire.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 view-more-btn"
              ref={jumpersBtnRef}
              onClick={() => handleToggle(jumpersTextRef, jumpersBtnRef, jumpersTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForJumpers.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize  rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'jumpers & cardigans')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isJackets && (
        <div className="products-collection-info-container jackets-container">
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'men' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('men')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={mensPath}
            >
              men
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'jackets & coats' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('jackets & coats')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={m_jackets_path}
            >
              jackets & coats
            </Link>
            /
          </div>

          <h1 className="products-collection-info-title text-capitalize">
            Men's Jackets & Coats
          </h1>
          <p className="products-collection-info-text text-white">
            A wide range of silhouettes and styles crafted from timeless
            fabrications, our men's jackets and coats yield both functionality
            and elevated style for all-weather protection and sharp tailoring
            <span ref={jacketsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={jacketsTextRef}>
              From rugged utility parkas to sleek leather bombers and
              structured topcoats, every piece is built with weather-resistant
              finishes and durable hardware designed to last a lifetime.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 view-more-btn"
              ref={jacketsBtnRef}
              onClick={() => handleToggle(jacketsTextRef, jacketsBtnRef, jacketsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForjackets.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize  rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'jackets & coats')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isShorts && (
        <div className="products-collection-info-container shorts-container">
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'men' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('men')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={mensPath}
            >
              men
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'shorts' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('shorts')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={m_shorts_path}
            >
              shorts
            </Link>
            /
          </div>

          <h1 className="products-collection-info-title text-capitalize">
            Men's Designer Trousers
          </h1>
          <p className="products-collection-info-text text-white">
            Traditional silhouettes and modern sensibilities with an unmatched
            fit and feel. Our men's jeans, joggers, and trousers offer a range
            of styles, from tailored wool herringbone to casual streetwear fits
            <span ref={shortsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={shortsTextRef}>
              Expertly constructed to provide supreme flexibility and
              structure, these trousers provide a polished foundation for both
              casual tees and formal button-down shirts.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 view-more-btn"
              ref={shortsBtnRef}
              onClick={() => handleToggle(shortsTextRef, shortsBtnRef, shortsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeShorts.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize  rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'shorts')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isAccessories && (
        <div className="products-collection-info-container accessories-container">
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'men' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('men')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={mensPath}
            >
              men
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'accessories' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('accessories')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={m_accessories_path}
            >
              accessories
            </Link>
            /
          </div>

          <h1 className="products-collection-info-title text-capitalize">
            Men's Scarves, Hats & Gloves
          </h1>
          <p className="products-collection-info-text text-white">
            Accessories of style and substance: Find the perfect complement to
            an array of looks in our exclusive selection of men's hats, gloves,
            and scarves designed to elevate your look instantly
            <span ref={accessoriesTruncatRef}>...</span>
            <span className="d-none mt-2" ref={accessoriesTextRef}>
              Detailed with signature embroideries and crafted from plush wool
              and leather, these finishing touches ensure you stay warm while
              making a powerful statement of personal style.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 view-more-btn"
              ref={accessoriesBtnRef}
              onClick={() => handleToggle(accessoriesTextRef, accessoriesBtnRef, accessoriesTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeAccessories.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize  rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'accessories')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
{filterBtn && (
  <div className="text-white w-100 d-flex">
    <div className="border-white border-1 border py-1 px-2 filter-btn-pop d-flex justify-content-center align-items-center text-capitalize">
      <span>{filterBtn}</span>
      <IoIosClose style={{ cursor: 'pointer' }} className='close-filter' onClick={() => handleCloseFilterPop(cleanCategory)} />
    </div>
  </div>
)}
      <div className="products-collection-product-container d-flex flex-wrap justify-content-center mt-5">
 
        
        <MenProducts />
      </div>
    </>
  );
}

export default ProductsCollectionInfo;