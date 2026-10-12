import { useParams, Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { useWomenContext } from '../../../context/women/WomenProductContext';
import WproductBox from "./WproductBox";
import './WproductCollection.css';


function WproductCollection() {
  const {
  typeForShirts,
  typeForJumpers,
  typeForDresses,
  typeForTrousers,
  typeForBags,
  typeForJackets,
  filterBtn,
  handleFilterByCat,
  handleCloseFilterPop } = useWomenContext();
  const { category, userId } = useParams();

  const cleanCategory = decodeURI(category);

  const isShirts = cleanCategory === 'shirts';
  const isJumpers = cleanCategory === 'jumpers';
  const isDresses = cleanCategory === 'dresses';
  const isTrousers = cleanCategory === 'trousers';
  const isBags = cleanCategory === 'bags';
  const isJackets = cleanCategory === 'jackets';

  const shirtsTextRef = useRef(null);
  const shirtsBtnRef = useRef(null);
  const shirtsTruncatRef = useRef(null);

  const jumpersTextRef = useRef(null);
  const jumpersBtnRef = useRef(null);
  const jumpersTruncatRef = useRef(null);

  const dressesTextRef = useRef(null);
  const dressesBtnRef = useRef(null);
  const dressesTruncatRef = useRef(null);

  const trousersTextRef = useRef(null);
  const trousersBtnRef = useRef(null);
  const trousersTruncatRef = useRef(null);

  const bagsTextRef = useRef(null);
  const bagsBtnRef = useRef(null);
  const bagsTruncatRef = useRef(null);

  const jacketsTextRef = useRef(null);
  const jacketsBtnRef = useRef(null);
  const jacketsTruncatRef = useRef(null);

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

  const womensPath = userId ? `/women-section/${userId}` : '/women-section';

  const ws_shirts_path = userId ? `/women-section/category/shirts/${userId}` : '/women-section/category/shirts';
  const ws_jumpers_path = userId ? `/women-section/category/jumpers/${userId}` : '/women-section/category/jumpers';
  const ws_dresses_path = userId ? `/women-section/category/dresses/${userId}` : '/women-section/category/dresses';
  const ws_trousers_path = userId ? `/women-section/category/trousers/${userId}` : '/women-section/category/trousers';
  const ws_bags_path = userId ? `/women-section/category/bags/${userId}` : '/women-section/category/bags';
  const ws_jackets_path = userId ? `/women-section/category/jackets/${userId}` : '/women-section/category/jackets';

  return (
    <>
      {isShirts && (
        <div className="w-collection-info-container w-shirts-container">
          <div className="text-white text-uppercase w-collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'women' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('women')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={womensPath}
            >
              women
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'shirts' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('shirts')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={ws_shirts_path}
            >
              shirts
            </Link>
            /
          </div>

          <h1 className="w-collection-info-title text-capitalize">
            Women's Shirts
          </h1>
          <p className="w-collection-info-text text-white">
            From special statement pieces to elevated everyday staples, Ralph Lauren’s women's Polos, shirts, and blouses reimagine classic silhouettes in modern styles. Polo’s iconic cotton oxford shirts, in slim or
            <span ref={shirtsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={shirtsTextRef}>
              oversize fits, are great for both weekends and workdays, and hand-embroidered embellishments and dynamic cutouts from Collection make for eye-catching eveningwear. Double RL’s vintage-inspired Americana has a laid-back ease, while Lauren’s timeless versatility offers range for any occasion. Layer women's tees and tanks with collared shirts and Polos for a casual look, or an elegant women’s silk blouse with wide-leg trousers and pleated skirts
            </span>
            <span
              className="text-decoration-underline d-block mt-3 w-view-more-btn"
              ref={shirtsBtnRef}
              onClick={() => handleToggle(shirtsTextRef, shirtsBtnRef, shirtsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap w-filter-btn-collection">
            {typeForShirts.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center w-filter-btn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'shirts')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isJumpers && (
        <div className="w-collection-info-container w-jumpers-container">
          <div className="text-white text-uppercase w-collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'women' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('women')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={womensPath}
            >
              women
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'jumpers' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('jumpers')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={ws_jumpers_path}
            >
              jumpers
            </Link>
            /
          </div>

          <h1 className="w-collection-info-title text-capitalize">
            Women's Jumpers
          </h1>
          <p className="w-collection-info-text text-white">
            Soft, warm and endlessly wearable, our women's jumpers bring polished comfort to every season, from fine-gauge merino crewnecks to chunky cable-knit cardigans and cashmere turtlenecks designed for layering
            <span ref={jumpersTruncatRef}>...</span>
            <span className="d-none mt-2" ref={jumpersTextRef}>
              Crafted from premium yarns with refined finishing, each knit holds its shape wash after wash, pairing effortlessly with tailored trousers, pleated skirts or your favourite denim for a look that moves easily from weekday to weekend.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 w-view-more-btn"
              ref={jumpersBtnRef}
              onClick={() => handleToggle(jumpersTextRef, jumpersBtnRef, jumpersTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap w-filter-btn-collection">
            {typeForJumpers.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center w-filter-btn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'jumpers')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isDresses && (
        <div className="w-collection-info-container w-dresses-container">
          <div className="text-white text-uppercase w-collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'women' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('women')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={womensPath}
            >
              women
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'dresses' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('dresses')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={ws_dresses_path}
            >
              dresses
            </Link>
            /
          </div>

          <h1 className="w-collection-info-title text-capitalize">
            Women's Dresses
          </h1>
          <p className="w-collection-info-text text-white">
            From relaxed shirtdresses to elegant evening silhouettes, our women's dresses are cut for confident movement and timeless style, in fabrics that feel as good as they look for every occasion on your calendar
            <span ref={dressesTruncatRef}>...</span>
            <span className="d-none mt-2" ref={dressesTextRef}>
              Choose flowing midis and maxis for sunlit days, structured wrap styles for the office, or embellished cocktail dresses for the evening, each designed with considered tailoring and a flattering, modern line.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 w-view-more-btn"
              ref={dressesBtnRef}
              onClick={() => handleToggle(dressesTextRef, dressesBtnRef, dressesTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap w-filter-btn-collection">
            {typeForDresses.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center w-filter-btn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'dresses')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isTrousers && (
        <div className="w-collection-info-container w-trousers-container">
          <div className="text-white text-uppercase w-collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'women' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('women')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={womensPath}
            >
              women
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'trousers' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('trousers')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={ws_trousers_path}
            >
              trousers
            </Link>
            /
          </div>

          <h1 className="w-collection-info-title text-capitalize">
            Women's Trousers
          </h1>
          <p className="w-collection-info-text text-white">
            Tailored with precision and cut for comfort, our women's trousers offer a polished foundation for any wardrobe, from fluid wide-leg styles to sharp pleated pairs and easy straight-fit silhouettes
            <span ref={trousersTruncatRef}>...</span>
            <span className="d-none mt-2" ref={trousersTextRef}>
              Made from refined wools, crisp cottons and drapey crepes, they move seamlessly from the office to dinner, pairing beautifully with a silk blouse, a fine knit or a classic oxford shirt.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 w-view-more-btn"
              ref={trousersBtnRef}
              onClick={() => handleToggle(trousersTextRef, trousersBtnRef, trousersTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap w-filter-btn-collection">
            {typeForTrousers.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center w-filter-btn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'trousers')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isBags && (
        <div className="w-collection-info-container w-bags-container">
          <div className="text-white text-uppercase w-collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'women' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('women')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={womensPath}
            >
              women
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'bags' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('bags')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={ws_bags_path}
            >
              bags
            </Link>
            /
          </div>

          <h1 className="w-collection-info-title text-capitalize">
            Women's Bags
          </h1>
          <p className="w-collection-info-text text-white">
            Considered design meets everyday function in our women's bags, from structured top-handle styles and roomy leather totes to compact crossbody bags made to carry you from morning meetings to evening plans
            <span ref={bagsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={bagsTextRef}>
              Finished with signature hardware and crafted from supple, durable leathers, each piece is built to age beautifully and complete your look with understated, enduring style.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 w-view-more-btn"
              ref={bagsBtnRef}
              onClick={() => handleToggle(bagsTextRef, bagsBtnRef, bagsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap w-filter-btn-collection">
            {typeForBags.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center w-filter-btn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'bags')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isJackets && (
        <div className="w-collection-info-container w-jackets-container">
          <div className="text-white text-uppercase w-collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'women' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('women')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={womensPath}
            >
              women
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === 'jackets' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('jackets')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={ws_jackets_path}
            >
              jackets
            </Link>
            /
          </div>

          <h1 className="w-collection-info-title text-capitalize">
            Women's Jackets
          </h1>
          <p className="w-collection-info-text text-white">
            Define your outerwear wardrobe with women's jackets that balance function and style, from sharp tailored blazers and supple leather moto jackets to quilted layers and classic trench coats
            <span ref={jacketsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={jacketsTextRef}>
              Built with weather-ready finishes and thoughtful detailing, each jacket adds structure and polish to everyday looks while keeping you comfortable through every change of season.
            </span>
            <span
              className="text-decoration-underline d-block mt-3 w-view-more-btn"
              ref={jacketsBtnRef}
              onClick={() => handleToggle(jacketsTextRef, jacketsBtnRef, jacketsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap w-filter-btn-collection">
            {typeForJackets.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center w-filter-btn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, 'jackets')}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {filterBtn && (
        <div className="text-white w-100 d-flex">
          <div className="border-white border-1 border py-1 px-2 w-filter-btn-pop d-flex justify-content-center align-items-center text-capitalize">
            <span>{filterBtn}</span>
            <IoIosClose style={{ cursor: 'pointer' }} className='w-close-filter' onClick={() => handleCloseFilterPop(cleanCategory)} />
          </div>
        </div>
      )}
      <div className="w-collection-product-container d-flex flex-wrap justify-content-center mt-5">
        <WproductBox/>
      </div>
    </>
  );
}

export default WproductCollection