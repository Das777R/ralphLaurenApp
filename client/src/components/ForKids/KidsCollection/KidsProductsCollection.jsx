import "./KidsProductsCollection.css";
import KproductBox from "../KproductBox/KproductBox";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useKidsContext } from "../../../context/kids/KidsProductContext";
import { IoIosClose } from "react-icons/io";

const CATEGORY_CONTENT = {
  "boys' shirts": {
    title: "Boys' Designer Shirts",
    containerClass: "k-boys-shirt-container",
    intro:
      "Layered with suits or a jumper, classic shirting for every occasion. Ranging from sizes 1.5 years to 14 years, Ralph Lauren’s boys",
    more:
      "designer shirts offer timeless comfort and smart tailoring, perfect for formal family gatherings or relaxed weekend outings.",
  },
  "boys' jumpers & cardigans": {
    title: "Boys' Jumpers & Cardigans",
    containerClass: "k-boys-jumpers-container",
    intro:
      "Warm and cosy knitwear he’ll love. There are Ralph Lauren boys’ jumpers for every season, from wool cardigans with winter alpine prints to cotton V-necks for cool summer nights. Striped quarter-zips",
    more:
      "are crafted to deliver durable insulation and effortless everyday style for active youngsters.",
  },
  "girls' jumpers & cardigans": {
    title: "Girls' Jumpers & Cardigans",
    containerClass: "k-girls-jumpers-container",
    intro:
      "Warm and cosy knitwear she’ll love. There are Ralph Lauren girls’ jumpers for every season, from wool pullovers with winter alpine prints to cotton V-necks for cool summer nights. Buttoned girls’ cardigans",
    more:
      "offer versatile layering options paired seamlessly with skirts, dresses, and denim trousers.",
  },
  "boys' jackets & coats": {
    title: "Boys' Jackets & Coats",
    containerClass: "k-boys-jackets-container",
    intro:
      "Essential layers for every season. Boys’ winter coats, including vibrant, down-filled puffer jackets, wool-blend peacoats and cosy, sherpa-lined outerwear provide warmth and style for even the coldest months. Authentic barn jackets and ripstop gilets are made for back-to-school days and autumn adventures,",
    more:
      "guaranteeing durable weather protection without compromising on classic styling.",
  },
  "girls' jackets & coats": {
    title: "Girls' Jackets & Coats",
    containerClass: "k-girls-jackets-container",
    intro:
      "Essential layers for every season. Girls’ designer winter coats – colourful down-filled puffer jackets, wool princess coats and soft teddy fleeces – provide warmth and style for even the coldest months. Authentic",
    more:
      "outerwear designs tailored with luxury finishes to keep her comfortable and stylish all winter long.",
  },
  "girls' t-shirts & sweatshirts": {
    title: "Girls' T-Shirts & Sweatshirts",
    containerClass: "k-girls-tshirts-container",
    intro:
      "Warm and cosy knitwear she’ll love. From wool winter jumpers with alpine prints to full-zip styles for cool summer nights, there are Ralph Lauren girls’ jumpers for every season. Button-down cardigans for girls",
    more:
      "and soft jersey tees combine casual ease with iconic Ralph Lauren branding.",
  },
  "boys' t-shirts & sweatshirts": {
    title: "Boys' Hoodies & Sweatshirts",
    containerClass: "k-boys-tshirts-container",
    intro:
      "Warm and cosy knitwear he’ll love. From warm wool jumpers to easy cotton half-zips, there are Ralph Lauren boys’ jumpers for every season. Striped boys’ cardigans are perfect for school or play, while",
    more:
      "graphic hoodies and fleece sweatshirts offer relaxed athletic appeal.",
  },
};

const CATEGORY_ALIASES = {
  "boys' polo & rugby shirts": "boys' t-shirts & sweatshirts",
  "boy's casual shirts": "boys' shirts",
  "boys' casual shirts": "boys' shirts",
};

function safeDecode(value) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return value || "";
  }
}

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
    handleCloseFilterPop,
  } = useKidsContext();

  const { category, userId } = useParams();

  const cleanCategory = safeDecode(category).toLowerCase();
  const activeCategory = CATEGORY_ALIASES[cleanCategory] || cleanCategory;
  const content = CATEGORY_CONTENT[activeCategory];

  const typesByCategory = {
    "boys' shirts": typeForBoysShirts,
    "boys' jumpers & cardigans": typeForBoysJumpers,
    "girls' jumpers & cardigans": typeForGirlsJumpers,
    "boys' jackets & coats": typeForBoysJackets,
    "girls' jackets & coats": typeForGirlsJackets,
    "girls' t-shirts & sweatshirts": typeForGirlsTshirts,
    "boys' t-shirts & sweatshirts": typeForBoysTshirts,
  };
  const filterTypes = typesByCategory[activeCategory] || [];

  const [hoveredLink, setHoveredLink] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
    setHoveredLink(null);
  }, [cleanCategory]);

  const withUser = (path) => (userId ? `${path}/${userId}` : path);
  const kidsPath = withUser("/kids-section");
  const categoryPath = withUser(`/kids-section/category/${cleanCategory}`);

  const underline = (name) =>
    hoveredLink === name ? "text-decoration-underline" : "";

  return (
    <>
      {content && (
        <div className={`k-collection-info-container ${content.containerClass}`}>
          <div className="text-white text-uppercase k-collect-info-link">
            <Link
              className={`text-white me-2 ${underline("kids")}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHoveredLink("kids")}
              onMouseLeave={() => setHoveredLink(null)}
              to={kidsPath}
            >
              kids
            </Link>
            /
            <Link
              className={`text-white mx-2 ${underline(cleanCategory)}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHoveredLink(cleanCategory)}
              onMouseLeave={() => setHoveredLink(null)}
              to={categoryPath}
            >
              {cleanCategory}
            </Link>
            /
          </div>

          <h1 className="k-collection-info-title text-capitalize">
            {content.title}
          </h1>

          <p className="k-collection-info-text text-white">
            {content.intro}
            <span>{expanded ? " " : "..."}</span>
            {expanded && <span className="mt-2">{content.more}</span>}
            <span
              className="text-decoration-underline d-block mt-3 k-view-more-btn"
              role="button"
              tabIndex={0}
              onClick={() => setExpanded((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpanded((prev) => !prev);
                }
              }}
            >
              {expanded ? "View Less" : "View More"}
            </span>
          </p>

          <div className="d-flex gap-2 text-white mt-lg-5 flex-wrap k-filter-btn-collection">
            {filterTypes.map((t, i) => (
              <div
                key={t || i}
                className={`text-center text-capitalize rounded-pill px-lg-5 py-lg-2 text-nowrap d-flex justify-content-center align-items-center k-filter-btn ${
                  filterBtn === t
                    ? "bg-body text-dark"
                    : "bg-transparent text-white"
                }`}
                onClick={() => handleFilterByCat(t, activeCategory)}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {filterBtn && (
        <div className="text-white w-100 d-flex">
          <div className="border-white border-1 border py-1 px-2 k-filter-btn-pop d-flex justify-content-center align-items-center text-capitalize">
            <span>{filterBtn}</span>
            <IoIosClose
              style={{ cursor: "pointer" }}
              className="k-close-filter"
              onClick={() => handleCloseFilterPop(cleanCategory)}
            />
          </div>
        </div>
      )}

      <div className="k-collection-product-container d-flex flex-wrap justify-content-center mt-5">
        <KproductBox />
      </div>
    </>
  );
}

export default KidsProductsCollection;