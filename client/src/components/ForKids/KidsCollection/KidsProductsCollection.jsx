import './KidsProductsCollection.css';
import KproductBox from '../KproductBox/KproductBox';
import { useParams, Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useKidsContext } from '../../../context/kids/KidsProductContext';
import { IoIosClose } from "react-icons/io";

function KidsProductsCollection() {
  const {
    typeForBoysShirts,
    typeForBoysJumpers,
    typeForGirlsJumpers,
    typeForBoysJackets,
    typeForGirlsJackets,
    typeForGirlsTshirts,
    typeForBoysTshirts,
    filterBtn,
    handleFilterByCat,
    handleCloseFilterPop 
  } = useKidsContext();

  const { category, userId } = useParams();

  const cleanCategory = decodeURI(category);

  const isBoysShirt = cleanCategory === "boys' shirts";
  const isBoysJumpers = cleanCategory === "boys' jumpers & cardigans";
  const isGirlsJumpers = cleanCategory === "girls' jumpers & cardigans";
  const isBoysJackets = cleanCategory === "boys' jackets & coats";
  const isGirlsJackets = cleanCategory === "girls' jackets & coats";
  const isGirlsTshirts = cleanCategory === "girls' t-shirts & sweatshirts";
  const isBoysTshirts = cleanCategory === "boys' t-shirts & sweatshirts" || cleanCategory === "boys' polo & rugby shirts";

  const boysShirtTextRef = useRef(null);
  const boysShirtBtnRef = useRef(null);
  const boysShirtTruncatRef = useRef(null);

  const boysJumpersTextRef = useRef(null);
  const boysJumpersBtnRef = useRef(null);
  const boysJumpersTruncatRef = useRef(null);

  const girlsJumpersTextRef = useRef(null);
  const girlsJumpersBtnRef = useRef(null);
  const girlsJumpersTruncatRef = useRef(null);

  const boysJacketsTextRef = useRef(null);
  const boysJacketsBtnRef = useRef(null);
  const boysJacketsTruncatRef = useRef(null);

  const girlsJacketsTextRef = useRef(null);
  const girlsJacketsBtnRef = useRef(null);
  const girlsJacketsTruncatRef = useRef(null);

  const girlsTshirtsTextRef = useRef(null);
  const girlsTshirtsBtnRef = useRef(null);
  const girlsTshirtsTruncatRef = useRef(null);

  const boysTshirtsTextRef = useRef(null);
  const boysTshirtsBtnRef = useRef(null);
  const boysTshirtsTruncatRef = useRef(null);

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

  const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';

  const k_boys_shirt_path = userId ? `/kids-section/category/boys' shirts/${userId}` : `/kids-section/category/boys' shirts`;
  const k_boys_jumpers_path = userId ? `/kids-section/category/boys' jumpers & cardigans/${userId}` : `/kids-section/category/boys' jumpers & cardigans`;
  const k_girls_jumpers_path = userId ? `/kids-section/category/girls' jumpers & cardigans/${userId}` : `/kids-section/category/girls' jumpers & cardigans`;
  const k_boys_jackets_path = userId ? `/kids-section/category/boys' jackets & coats/${userId}` : `/kids-section/category/boys' jackets & coats`;
  const k_girls_jackets_path = userId ? `/kids-section/category/girls' jackets & coats/${userId}` : `/kids-section/category/girls' jackets & coats`;
  const k_girls_tshirts_path = userId ? `/kids-section/category/girls' t-shirts & sweatshirts/${userId}` : `/kids-section/category/girls' t-shirts & sweatshirts`;
  const k_boys_tshirts_path = userId ? `/kids-section/category/boys' t-shirts & sweatshirts/${userId}` : `/kids-section/category/boys' t-shirts & sweatshirts`;

  return (
    <>
      {isBoysShirt && (
        <div className='products-collection-info-container boys-shirt-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === "boys' shirts" ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat("boys' shirts")}
              onMouseLeave={() => setHandleEnterCat('')}
              to={k_boys_shirt_path}
            >
              boys' shirts
            </Link>
            /
          </div>

          <h1 className='products-collection-info-title text-capitalize'>Boys' Designer Shirts</h1>
          <p className="products-collection-info-text text-white">
            Layered with suits or a jumper, classic shirting for every occasion. Ranging from sizes 1.5 years to 14 years, Ralph Lauren’s boys
            <span ref={boysShirtTruncatRef}>...</span>
            <span className="d-none mt-2" ref={boysShirtTextRef}>
              designer shirts offer timeless comfort and smart tailoring, perfect for formal family gatherings or relaxed weekend outings.
            </span>
            <span
              className='text-decoration-underline d-block mt-3 view-more-btn'
              ref={boysShirtBtnRef}
              onClick={() => handleToggle(boysShirtTextRef, boysShirtBtnRef, boysShirtTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForBoysShirts?.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, "boys' shirts")}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isBoysJumpers && (
        <div className='products-collection-info-container boys-jumpers-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === "boys' jumpers & cardigans" ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat("boys' jumpers & cardigans")}
              onMouseLeave={() => setHandleEnterCat('')}
              to={k_boys_jumpers_path}
            >
              boys' jumpers & cardigans
            </Link>
            /
          </div>

          <h1 className='products-collection-info-title text-capitalize'>Boys' Jumpers & Cardigans</h1>
          <p className="products-collection-info-text text-white">
            Warm and cosy knitwear he’ll love. There are Ralph Lauren boys’ jumpers for every season, from wool cardigans with winter alpine prints to cotton V-necks for cool summer nights. Striped quarter-zips ar
            <span ref={boysJumpersTruncatRef}>...</span>
            <span className="d-none mt-2" ref={boysJumpersTextRef}>
              re crafted to deliver durable insulation and effortless everyday style for active youngsters.
            </span>
            <span
              className='text-decoration-underline d-block mt-3 view-more-btn'
              ref={boysJumpersBtnRef}
              onClick={() => handleToggle(boysJumpersTextRef, boysJumpersBtnRef, boysJumpersTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForBoysJumpers?.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, "boys' jumpers & cardigans")}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isGirlsJumpers && (
        <div className='products-collection-info-container girls-jumpers-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === "girls' jumpers & cardigans" ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat("girls' jumpers & cardigans")}
              onMouseLeave={() => setHandleEnterCat('')}
              to={k_girls_jumpers_path}
            >
              girls' jumpers & cardigans
            </Link>
            /
          </div>

          <h1 className='products-collection-info-title text-capitalize'>Girls' Jumpers & Cardigans</h1>
          <p className="products-collection-info-text text-white">
            Warm and cosy knitwear she’ll love. There are Ralph Lauren girls’ jumpers for every season, from wool pullovers with winter alpine prints to cotton V-necks for cool summer nights. Buttoned girls’ cardigans
            <span ref={girlsJumpersTruncatRef}>...</span>
            <span className="d-none mt-2" ref={girlsJumpersTextRef}>
              offer versatile layering options paired seamlessly with skirts, dresses, and denim trousers.
            </span>
            <span
              className='text-decoration-underline d-block mt-3 view-more-btn'
              ref={girlsJumpersBtnRef}
              onClick={() => handleToggle(girlsJumpersTextRef, girlsJumpersBtnRef, girlsJumpersTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForGirlsJumpers?.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, "girls' jumpers & cardigans")}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isBoysJackets && (
        <div className='products-collection-info-container boys-jackets-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === "boys' jackets & coats" ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat("boys' jackets & coats")}
              onMouseLeave={() => setHandleEnterCat('')}
              to={k_boys_jackets_path}
            >
              boys' jackets & coats
            </Link>
            /
          </div>

          <h1 className='products-collection-info-title text-capitalize'>Boys' Jackets & Coats</h1>
          <p className="products-collection-info-text text-white">
            Essential layers for every season. Boys’ winter coats, including vibrant, down-filled puffer jackets, wool-blend peacoats and cosy, sherpa-lined outerwear provide warmth and style for even the coldest months. Authentic barn jackets and ripstop gilets are made for back-to-school days and autumn adventures,
            <span ref={boysJacketsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={boysJacketsTextRef}>
              guaranteeing durable weather protection without compromising on classic styling.
            </span>
            <span
              className='text-decoration-underline d-block mt-3 view-more-btn'
              ref={boysJacketsBtnRef}
              onClick={() => handleToggle(boysJacketsTextRef, boysJacketsBtnRef, boysJacketsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForBoysJackets?.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, "boys' jackets & coats")}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isGirlsJackets && (
        <div className='products-collection-info-container girls-jackets-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === "girls' jackets & coats" ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat("girls' jackets & coats")}
              onMouseLeave={() => setHandleEnterCat('')}
              to={k_girls_jackets_path}
            >
              girls' jackets & coats
            </Link>
            /
          </div>

          <h1 className='products-collection-info-title text-capitalize'>Girls' Jackets & Coats</h1>
          <p className="products-collection-info-text text-white">
            Essential layers for every season. Girls’ designer winter coats – colourful down-filled puffer jackets, wool princess coats and soft teddy fleeces – provide warmth and style for even the coldest months. Authentic
            <span ref={girlsJacketsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={girlsJacketsTextRef}>
              outerwear designs tailored with luxury finishes to keep her comfortable and stylish all winter long.
            </span>
            <span
              className='text-decoration-underline d-block mt-3 view-more-btn'
              ref={girlsJacketsBtnRef}
              onClick={() => handleToggle(girlsJacketsTextRef, girlsJacketsBtnRef, girlsJacketsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForGirlsJackets?.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, "girls' jackets & coats")}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isGirlsTshirts && (
        <div className='products-collection-info-container girls-tshirts-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === "girls' t-shirts & sweatshirts" ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat("girls' t-shirts & sweatshirts")}
              onMouseLeave={() => setHandleEnterCat('')}
              to={k_girls_tshirts_path}
            >
              girls' t-shirts & sweatshirts
            </Link>
            /
          </div>

          <h1 className='products-collection-info-title text-capitalize'>Girls' T-Shirts & Sweatshirts</h1>
          <p className="products-collection-info-text text-white">
            Warm and cosy knitwear she’ll love. From wool winter jumpers with alpine prints to full-zip styles for cool summer nights, there are Ralph Lauren girls’ jumpers for every season. Button-down cardigans for girls
            <span ref={girlsTshirtsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={girlsTshirtsTextRef}>
              and soft jersey tees combine casual ease with iconic Ralph Lauren branding.
            </span>
            <span
              className='text-decoration-underline d-block mt-3 view-more-btn'
              ref={girlsTshirtsBtnRef}
              onClick={() => handleToggle(girlsTshirtsTextRef, girlsTshirtsBtnRef, girlsTshirtsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForGirlsTshirts?.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, "girls' t-shirts & sweatshirts")}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {isBoysTshirts && (
        <div className='products-collection-info-container boys-tshirts-container mt-0'>
          <div className="text-white text-uppercase collect-info-link">
            <Link
              className={`text-white me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${handleEnterCat === "boys' t-shirts & sweatshirts" ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat("boys' t-shirts & sweatshirts")}
              onMouseLeave={() => setHandleEnterCat('')}
              to={k_boys_tshirts_path}
            >
              boys' t-shirts & sweatshirts
            </Link>
            /
          </div>

          <h1 className='products-collection-info-title text-capitalize'>Boys' Hoodies & Sweatshirts</h1>
          <p className="products-collection-info-text text-white">
            Warm and cosy knitwear he’ll love. From warm wool jumpers to easy cotton half-zips, there are Ralph Lauren boys’ jumpers for every season. Striped boys’ cardigans are perfect for school or play, while
            <span ref={boysTshirtsTruncatRef}>...</span>
            <span className="d-none mt-2" ref={boysTshirtsTextRef}>
              graphic hoodies and fleece sweatshirts offer relaxed athletic appeal.
            </span>
            <span
              className='text-decoration-underline d-block mt-3 view-more-btn'
              ref={boysTshirtsBtnRef}
              onClick={() => handleToggle(boysTshirtsTextRef, boysTshirtsBtnRef, boysTshirtsTruncatRef)}
            >
              View More
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap filteBtn-collection">
            {typeForBoysTshirts?.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center filterBtn ${
                  filterBtn === t ? 'bg-body text-dark' : 'bg-transparent text-white'
                }`}
                onClick={() => handleFilterByCat(t, "boys' t-shirts & sweatshirts")}
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
        <KproductBox />
      </div>
    </>
  );
}

export default KidsProductsCollection;