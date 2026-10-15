import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/api.js";
import { CiHeart } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { BsHandbag } from "react-icons/bs";
import { useLookProduct } from "../../../context/Look/LookProductContext.js";
import LookProductProvider from '../../../context/Look/LookProductProvider.jsx'
import StickyBar from "../../../context/Look/StickyBar.jsx";
import { isVideo } from "../../../context/Look/LookHelpers.js";
import { FiAlertCircle } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { Offcanvas } from "bootstrap";
import { useContext } from "react";
import "./LookProduct.css";
import CompleteLook from "./CompleteLook.jsx";
import { UIContext } from "../../../context/UIContext.jsx";

function getSectionSlug(category) {
  const c = (category || "").toLowerCase().trim();
  if (c.startsWith("women")) return "women-section";
  if (c.startsWith("men")) return "men-section";
  if (c.startsWith("kid") || c.startsWith("boy") || c.startsWith("girl")) {
    return "kids-section";
  }
  if (c.startsWith("home")) return "home-section";
  return null;
}

function LookProductContent() {
  const {
    productLook,
    availableColor,
    recommendProducts,
    compleProductsData,
    offCanavasRecommendData,
    canvasData,
    isLoading,
    addedToBag,
    availableSizes,
    recommendAvailableSizes,
    lookSize,
    recommendSize,
    homePath,
    selectSizeForCanvas,
    selectSizeForLook,
    getProductByName,
    getProductByColor,
    productId,
    formatImgSrc,
    handleAddToBag,
    setProductsLook,
    setIsLoading,
    bag,
    bagLength,
    sizeNotSelectForLook,
    
    
  } = useLookProduct();

  const {setCompleteLookOpen,completeLookOpen} = useContext(UIContext);

  const { userId } = useParams();
  const scrollContainerRef = useRef(null);
   
  const scrolledLeftBtnRef = useRef(); 
  const scrolledRightBtnRef = useRef();


     


  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }

    if(scrolledRightBtnRef.current){
       if(!scrollContainerRef.current.classList.contains('active')){
      scrolledRightBtnRef.current.classList.add('active');
      scrolledLeftBtnRef.current.classList.remove('active');
       }else{
         scrolledRightBtnRef.current.classList.remove('active');
         scrolledLeftBtnRef.current.classList.add('active');
       }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }

    if(scrolledLeftBtnRef.current){
      scrolledLeftBtnRef.current.classList.add('active');
       scrolledRightBtnRef.current.classList.remove('active');
    }else{
      scrolledLeftBtnRef.current.classList.remove('active');
      scrolledRightBtnRef.current.classList.add('active');
    }
  };

  const bagOffcanvasRef = useRef(null);
  const recommendOffcanvasRef = useRef(null);

  const handleOpenBagOffcanvas = () => {
    const el = bagOffcanvasRef.current;
    if (el) {
      const bsOffcanvas = Offcanvas.getInstance(el) || new Offcanvas(el);
      bsOffcanvas.show();
    }
  };

  const handleOpenRecommendOffcanvas = () => {
    const el = recommendOffcanvasRef.current;
    if (el) {
      const bsOffcanvas = Offcanvas.getInstance(el) || new Offcanvas(el);
      bsOffcanvas.show();
    }
  };

  const handleCloseRecommendOffcanvas = () => {
    const el = recommendOffcanvasRef.current;
    if (el) {
      Offcanvas.getInstance(el)?.hide();
    }
  };

  const [handleEnterCat, setHandleEnterCat] = useState(null);

  useEffect(() => {
    const getProductsById = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProductsLook((prev) => ({
          ...prev,
          ...res.data.data,
        }));
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      getProductsById();
    }
    
  }, [productId]);

  const userSuffix = userId ? `/${userId}` : "";

  const getUrlForCat = () => {
    const slug = getSectionSlug(productLook?.category);
    return slug ? `/${slug}${userSuffix}` : null;
  };

  const getUrlForKind = () => {
    const slug = getSectionSlug(productLook?.category);
    const kind = (productLook?.kind || "").trim();
    return slug && kind
      ? `/${slug}/category/${encodeURIComponent(kind)}${userSuffix}`
      : null;
  };

  const catUrl = getUrlForCat();
  const kindUrl = getUrlForKind();

  const fullDetailsPath = offCanavasRecommendData?._id
    ? `/lookup/${offCanavasRecommendData._id}${userSuffix}`
    : "#";



  if (isLoading) {
    return (
      <div
        className="d-flex w-100 justify-content-center align-items-center"
        style={{ height: "20rem" }}
      >
        <div
          className="spinner-grow text-dark"
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        ></div>
      </div>
    );
  }

  return (
    <>
    
      <StickyBar />
      <CompleteLook/>
      <div className={`product-look-container d-flex ${completeLookOpen ? 'd-none': ''}`}>
        <div className="product-image-look-container">
          <img
            src={formatImgSrc(productLook?.lookImage)}
            alt=""
            className="product-lookImage position-relative"
          />
        <button
        type="button"
        className="complete-look-btn position-absolute"
        onClick={() => setCompleteLookOpen(true)}
        >
        COMPLETE THE LOOK <FiChevronDown />
        </button>
          {productLook?.slideImage?.map((slideUrl, index) => (
            <div key={index} className="product-slideImage">
              {isVideo(slideUrl) ? (
                <video
                  src={formatImgSrc(slideUrl)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-100"
                />
              ) : (
                <img src={formatImgSrc(slideUrl)} alt="Product" />
              )}
            </div>
          ))}

          <div className="w-100 look-product-carousel d-flex">
            <div className="slide-img-look-container">
              <img
                src={formatImgSrc(productLook?.lookImage)}
                className="slide-img-look"
                alt=""
              />
            </div>
            {productLook?.slideImage?.map((slideUrl, index) => (
              <div key={index} className="slide-img-look-container">
                {isVideo(slideUrl) ? (
                  <video
                    src={formatImgSrc(slideUrl)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="slide-img-look"
                  />
                ) : (
                  <img
                    src={formatImgSrc(slideUrl)}
                    alt="Product"
                    className="slide-img-look"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="product-look-info-container d-flex flex-column">
          <div className="product-look-info mb">
            <div className="product-look-path text-uppercase mb-3 d-flex gap-2">
              {catUrl ? (
                <Link to={catUrl} style={{ textDecoration: "inherit" }}>
                  <p
                    className={`text-dark ${
                      handleEnterCat === productLook?.category
                        ? "text-decoration-underline"
                        : ""}`}
                    onMouseEnter={() => setHandleEnterCat(productLook?.category)}
                    onMouseLeave={() => setHandleEnterCat("")}
                  >
                    {productLook?.category}
                  </p>
                </Link>
              ) : (
                <p className="text-dark">{productLook?.category}</p>
              )}
              /
              {kindUrl ? (
                <Link to={kindUrl} style={{ textDecoration: "inherit" }}>
                  <p
                    className={`text-dark ${
                      handleEnterCat === productLook?.kind
                        ? "text-decoration-underline"
                        : ""
                    }`}
                    onMouseEnter={() => setHandleEnterCat(productLook?.kind)}
                    onMouseLeave={() => setHandleEnterCat("")}
                  >
                    {productLook?.kind}
                  </p>
                </Link>
              ) : (
                <p className="text-dark">{productLook?.kind}</p>
              )}
            </div>
            <h3 className="product-name-look-text text-capitalize">
              {productLook?.productName}
            </h3>
            <div className="product-look-brand-name text-capitalize">
              {productLook?.brand}
            </div>
            <div className="product-look-price my-2">₹ {productLook?.price}</div>
            <div className="product-look-trending-text text-uppercase my-3">
              {productLook?.trending ? "Trending" : ""}
            </div>

            <div className="product-look-color-container">
              COLOR:{" "}
              <span className="product-look-color-text text-capitalize">
                {productLook?.colorName}
              </span>
              <div className="d-flex gap-2 mt-2 look-product-color-img-con">
                {availableColor?.map((clr, index) => (
                  <img
                    key={index}
                    src={formatImgSrc(clr)}
                    alt="color option"
                    className={`look-product-color-img ${
                      clr === productLook?.colorImage ? "currentColor" : ""
                    }`}
                    onClick={() => getProductByColor(clr)}
                  />
                ))}
              </div>
            </div>

            <div className="product-look-size-container mt-3 d-flex flex-column gap-2">
              <div className="product-look-size-text text-capitalize">
                SIZE: <span className="size-chart-text">Size Chart</span>
              </div>
              <div className="product-look-size-box-container d-flex gap-2 flex-wrap">
                {(availableSizes || []).map((size) => (
                  <div
                    key={size}
                    className={`product-look-size-box text-uppercase ${
                      lookSize === size ? "size-selected" : ""
                    }`}
                    onClick={() => selectSizeForLook(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            {sizeNotSelectForLook && (
              <div className="d-flex gap-2 font-monospace mt-3 fw-bold">
                <FiAlertCircle className="text-white bg-danger rounded-circle" />
                <p
                  className="text-danger text-capitalize"
                  style={{ fontSize: "12px" }}
                >
                  please select a size
                </p>
              </div>
            )}
            <div
              className="add-to-bag-div text-uppercase mt-3"
              onClick={() => {
                handleAddToBag(productLook?._id, lookSize);
                if (lookSize) {
                  handleOpenBagOffcanvas();
                }
              }}
              role="button"
              id="liveToastBtn"
            >
              {addedToBag ? "Item added" : "add to bag"}
            </div>

            <div className="slide-img-look-container d-lg-none d-md-none d-block mt-5">
              <img
                src={formatImgSrc(productLook?.lookImage)}
                className="slide-img-look w-100 h-100"
                alt=""
              />
            </div>
          </div>

          <div className="product-look-delivery-info-contatiner mt-0">
            <div className="products-instruction-text">
              {productLook?.description}
            </div>
            <div className="product-look-instruction-div d-flex flex-column gap-2 text-uppercase mt-5">
              <div className="product-look-instruction product-details">
                <i className="fa-solid fa-tag mt-1"></i> product details
              </div>
              <div className="product-look-instruction delivery-returns">
                <i className="fa-solid fa-truck-fast mt-1"></i> delivery returns
              </div>
              <div className="product-look-instruction payment-options">
                <i className="fa-solid fa-credit-card mt-1"></i> payment options
              </div>
            </div>
          </div>

          <div className="container py-1 position-sticky" style={{ top: "0px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-uppercase complete-the-look-title">
                Complete the Look
              </h3>
            </div>

            <div className="d-flex flex-column gap-4">
              {compleProductsData?.map((item, index) => (
                <div key={index} className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "174px", height: "220px", cursor: "pointer" }}
                    onClick={() => {
                      getProductByName(item.productName);
                      handleOpenRecommendOffcanvas();
                    }}
                  >
                    <img
                      src={formatImgSrc(item.lookImage)}
                      alt={item.productName}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>

                  <div
                    className="d-flex flex-column py-3"
                    style={{ width: "174px", height: "220px", cursor: "pointer" }}
                    onClick={() => {
                      getProductByName(item.productName);
                      handleOpenRecommendOffcanvas();
                    }}
                  >
                    <h6
                      className="mb-1 recom-offcanvas-title"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {item.productName}
                    </h6>
                    <p className="mt-2 pd-price">₹ {item.price}</p>

                    <div className="d-flex align-items-end gap-2 h-100">
                      <BsHandbag className="hand-bag-icon" />
                      <span className="text-uppercase ql-text">Quick Shop</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={bagOffcanvasRef}
          className="offcanvas offcanvas-end bag-offcanvas"
          tabIndex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div className="offcanvas-header bag-offcanvas-header d-flex justify-content-center">
            <h5
              className="offcanvas-title bag-offcanvas-title d-flex align-items-center gap-3"
              id="offcanvasExampleLabel"
            >
              <span className="bag-offcanvas-title-icon d-flex justify-content-center align-items-center">
                <i className="fa-solid fa-check"></i>
              </span>
              Item Added to Bag
            </h5>
          </div>

          <div className="offcanvas-body bag-offcanvas-body">
            <div className="bag-offcanvas-item">
              <div className="bag-offcanvas-item-image">
                <Link style={{ textDecoration: "inherit" }} to="#">
                  <img
                    src={formatImgSrc(canvasData?.lookImage)}
                    alt=""
                    className="w-100 h-100"
                  />
                </Link>
              </div>

              <div className="bag-offcanvas-item-details">
                <div className="text-uppercase bag-offcanvas-item-category">
                  {canvasData?.section}
                </div>
                <Link style={{ textDecoration: "inherit" }} to="#">
                  <h5 className="bag-offcanvas-item-title">
                    {canvasData?.productName}
                  </h5>
                </Link>
                <div className="bag-offcanvas-item-features">
                  <div className="user-select-none bag-offcanvas-item-feature">
                    Color: {canvasData?.colorName}
                  </div>
                  <div className="user-select-none bag-offcanvas-item-feature">
                    Size:{" "}
                    <span className="text-uppercase">{canvasData?.size}</span>
                  </div>
                </div>
                <div className="bag-offcanvas-item-price">
                  ₹ {canvasData?.price}
                </div>
              </div>
            </div>
          </div>

          <div className="bag-offcanvas-footer">
            <Link to={bag}>
              <button
                type="button"
                className="bag-offcanvas-checkout-btn text-uppercase w-100"
              >
                Checkout ({bagLength})
              </button>
            </Link>
            <Link to={homePath}>
              <button
                type="button"
                className="bag-offcanvas-continue-btn text-uppercase w-100"
                data-bs-dismiss="offcanvas"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className={`container mt-5 ${completeLookOpen ? 'd-none': ''}`}>
        <div className="d-flex gap-3 align-items-center mb-4">
          <h2 className="fw-normal user-select-none you-may-also-title">
            You may also like
          </h2>
          <div className="btn-group" role="group" aria-label="Carousel Navigation">
              <div 
              className="fs-3 move-right-btn  btn-md rounded-start-1 px-3"
               onClick={scrollLeft}
               ref={scrolledLeftBtnRef}
              >&lsaquo;</div>
              <div 
              className=" fs-3 move-left-btn btn-md rounded-end-1 px-3"
              onClick={scrollRight}
               ref={scrolledRightBtnRef}
              >&rsaquo;</div>
            {/* </button> */}
          </div>
        </div>
        <div
          className="you-may-also-like-con row row-cols-2 row-cols-md-3 row-cols-lg-5 g-2 flex-nowrap mb-5"
          ref={scrollContainerRef}
        >
          {recommendProducts?.map((item) => (
            <div className="col" key={item._id}>
              <div className="card product-card">
                <div
                  className="product-img-wrapper"
                  onClick={() => {
                    getProductByName(item.productName);
                    handleOpenRecommendOffcanvas();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={formatImgSrc(item.lookImage)}
                    alt={item.productName}
                    className="w-100 h-100"
                  />
                </div>
                <div className="card-body p-0 mt-2">
                  <p className="brand-name">{item.brand}</p>
                  <h3 className="product-title fs-6">{item.productName}</h3>
                  <p className="product-price">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={recommendOffcanvasRef}
        className={`offcanvas offcanvas-end w-75 d-flex flex-row recommend-offcanvas-body ${completeLookOpen ? 'd-none': ''}`}
        tabIndex="-1"
        id="recommendOffcanvas"
        aria-labelledby="recommendOffcanvasLabel"
        data-bs-backdrop="false"
      >
        {offCanavasRecommendData && (
          <div className="d-flex overflow-auto recommend-offcanvas-con h-100 w-100">
            <div className="d-flex flex-column w-75 recommend-offcanvas-image-con p-0">
              <img
                src={formatImgSrc(offCanavasRecommendData.lookImage)}
                className="w-100"
                alt=""
              />
              {offCanavasRecommendData?.slideImage?.map((item, index) => (
                <img
                  key={index}
                  src={formatImgSrc(item)}
                  className="w-100"
                  alt=""
                />
              ))}
            </div>
            <div className="offcanvas-body w-50 d-flex flex-column p-4 position-sticky top-0 offcanvas-product-detail">
              <div className="w-100 d-flex justify-content-end">
                <IoCloseOutline
                  className="fs-3 text-dark"
                  style={{ cursor: "pointer" }}
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                />
              </div>

              <div className="w-100">
                <h1 className="recom-offcanvas-title" id="recommendOffcanvasLabel">
                  {offCanavasRecommendData.productName}
                </h1>
                <p className="recom-offcanvas-brand">
                  {offCanavasRecommendData.brand}
                </p>

                <div>
                  <p className="recom-offcanvas-price">
                    ₹{offCanavasRecommendData.price}
                  </p>
                  <p className="recom-offcanvas-taxes">MRP, incl. of all taxes</p>
                </div>

                <div className="product-look-color-container">
                  COLOR:{" "}
                  <span className="product-look-color-text text-capitalize">
                    {offCanavasRecommendData.color}
                  </span>
                  <div className="d-flex gap-2 mt-2 look-product-color-img-con">
                    {offCanavasRecommendData?.availableColors?.map((clr, index) => (
                      <img
                        key={index}
                        src={formatImgSrc(clr)}
                        alt="color option"
                         className={`look-product-color-img ${
                          clr === offCanavasRecommendData.colorImage
                            ? "currentColor" : ""}`}
                        onClick={() => getProductByColor(clr)}
                      />
                    ))}
                  </div>
                </div>

                <div className="product-look-size-container mt-3 d-flex flex-column gap-2">
                  <div className="product-look-size-text text-capitalize">
                    SIZE: <span className="size-chart-text">Size Chart</span>
                  </div>
                  <div className="product-look-size-box-container d-flex gap-2 flex-wrap">
                    {(recommendAvailableSizes || []).map((size) => (
                      <div
                        key={size}
                        className={`product-look-size-box text-uppercase ${
                          recommendSize === size ? "size-selected" : ""
                        }`}
                        onClick={() => selectSizeForCanvas(size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                  {sizeNotSelectForLook && (
                    <div className="d-flex gap-2 font-monospace mt-3 fw-bold">
                      <FiAlertCircle className="text-white bg-danger rounded-circle" />
                      <p
                        className="text-danger text-capitalize"
                        style={{ fontSize: "12px" }}
                      >
                        please select a size
                      </p>
                    </div>
                  )}
                </div>

                <div className="d-flex flex-column gap-3 mt-5">
                  <div className="d-flex" style={{ gap: "1px" }}>
                    <div
                      className="flex-grow-1 text-white d-flex align-items-center justify-content-center py-3 text-uppercase add-to-bag-recommend"
                      onClick={() => {
                        handleAddToBag(offCanavasRecommendData._id, recommendSize);
                        if (recommendSize) {
                          handleCloseRecommendOffcanvas();
                          handleOpenBagOffcanvas();
                        }
                      }}
                      role="button"
                    >
                      {addedToBag ? "Item added" : "add to bag"}
                    </div>
                    <div className="border border-dark d-flex align-items-center justify-content-center px-3 add-to-fav-recommend">
                      <CiHeart className="text-white" />
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <Link
                      to={fullDetailsPath}
                      style={{ textDecoration: "inherit" }}
                      onClick={handleCloseRecommendOffcanvas}
                    >
                      <p
                        className="text-dark d-inline text-decoration-none text-uppercase border-bottom border-dark pb-1"
                        style={{ letterSpacing: "1.5px", fontSize: "0.7rem" }}
                      >
                        Full Details
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function LookProduct() {
  return (
      <LookProductProvider>
        <LookProductContent />
      </LookProductProvider>
  );
}

export default LookProduct;