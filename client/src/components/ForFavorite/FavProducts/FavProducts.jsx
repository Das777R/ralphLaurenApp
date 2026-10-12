import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import api from "../../../api/api";
import { UIContext } from "../../../context/UIContext.jsx";

function FavProducts() {
  const { userId } = useParams();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [carouselPrevIconHovered, setCarouselPrevIconHovered] = useState(false);
  const [carouselNextIconHovered, setCarouselNextIconHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { setAddedToFav, addedToFav, guestFavData, setGuestFavData } =
    useContext(UIContext);


  useEffect(() => {
    const arrayOfNames = JSON.parse(localStorage.getItem("fav")) || [];
    setAddedToFav(arrayOfNames);
  }, []);

 
  useEffect(() => {
    const getItemForGuestFav = async () => {
      if (addedToFav.length === 0) {
        setGuestFavData([]);
        setIsLoading(false);
        return;
      }

      try {
        const result = await api.get("/products/guestBag", {
          params: { products: addedToFav },
          paramsSerializer: { indexes: null },
        });

    
        const uniqueProducts = Array.from(
          result.data.data
            .reduce((map, item) => {
              const productName = item.productName;

              if (!map.has(productName)) {
                map.set(productName, {
                  ...item,
                  availableColors: item.colorImage ? [item.colorImage] : [],
                });
              } else {
                const existing = map.get(productName);
                if (
                  item.colorImage &&
                  !existing.availableColors.includes(item.colorImage)
                ) {
                  existing.availableColors.push(item.colorImage);
                }
              }
              return map;
            }, new Map())
            .values()
        );

        setGuestFavData(uniqueProducts);
      } catch (err) {
        console.error("Failed to fetch guest favorites:", err);
        setGuestFavData([]);
      } finally {
        setIsLoading(false);
      }
    };

    getItemForGuestFav();
  }, [addedToFav]);

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
        />
      </div>
    );
  }

  const selectVariant = async (clrImg, product) => {
    try {
      const res = await api.get("/products/productByColor", {
        params: { clrImg, product },
      });

      const newItem = res.data.data;
      setHoveredProductId(newItem._id);

      setGuestFavData((prev) =>
        prev.map((item) =>
          item.productName === newItem.productName
            ? { ...newItem, availableColors: item.availableColors }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to change variant:", err);
    }
  };

  const addToFav = (product) => {
    setAddedToFav((prev) => [...prev, product]);

    if (!userId) {
      const current = JSON.parse(localStorage.getItem("fav")) || [];
      localStorage.setItem("fav", JSON.stringify([...current, product]));
    }
  };

  const removeFromFav = (product) => {
    const current = JSON.parse(localStorage.getItem("fav")) || [];
    const updated = current.filter((x) => x !== product);
    localStorage.setItem("fav", JSON.stringify(updated));
    setAddedToFav(updated);
  };

  const isVideo = (url) => /\.(mp4|webm|mov|ogg)$/i.test(url);

  if (guestFavData.length === 0) {
    return (
      <div className="d-flex w-100 justify-content-center py-5">
        <p className="text-uppercase">No favourites yet</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap justify-content-center fav-products-container">
      {guestFavData.map((data, index) => {
        const productHovered = hoveredProductId === data._id;
        const lookPath = userId
          ? `/lookup/${data._id}/${userId}`
          : `/lookup/${data._id}`;
        const colors = data.availableColors || [];

        return (
          <div
            className="fav-page-box-container position-relative"
            key={data._id || index}
          >
            <div
              onMouseEnter={() => setHoveredProductId(data._id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="fav-page-box-img-container-carousel">
                <div className="fav-page-box-carousel">
                  <img
                    src={encodeURI(`/${data.lookImage}`)}
                    alt=""
                    className={`w-100 object-fit-cover ${
                      productHovered ? "is-hidden" : "is-visible"
                    }`}
                    style={{ transition: "all ease-in-out 0.8s" }}
                  />
                  <div
                    id={data._id}
                    className={`carousel carousel-dark slide fav-page-box-carousel fade-element ${
                      productHovered ? "is-visible" : "is-hidden"
                    }`}
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner fav-page-box-carousel-inner">
                      {data.slideImage?.map((srcLink, slideIndex) => (
                        <div
                          className={`carousel-item fav-page-box-carousel-item ${
                            slideIndex === 0 ? "active" : ""
                          }`}
                          key={slideIndex}
                        >
                          <Link to={lookPath} className="no-underline">
                            {isVideo(srcLink) ? (
                              <video
                                src={encodeURI(`/${srcLink}`)}
                                className="d-block w-100"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <img
                                src={encodeURI(`/${srcLink}`)}
                                className="d-block w-100 object-fit-cover"
                                alt="Product"
                              />
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                    <button
                      className="carousel-control-prev fav-page-box-carousel-control-prev"
                      type="button"
                      data-bs-target={`#${data._id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className={`carousel-control-prev-icon fav-page-box-carousel-control-prev-icon ${
                          carouselPrevIconHovered
                            ? "bg-dark w-50 p-2 rounded-2"
                            : ""
                        }`}
                        onMouseEnter={() => setCarouselPrevIconHovered(true)}
                        onMouseLeave={() => setCarouselPrevIconHovered(false)}
                        style={{ height: "2rem" }}
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next fav-page-box-carousel-control-next"
                      type="button"
                      data-bs-target={`#${data._id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className={`carousel-control-next-icon fav-page-box-carousel-control-next-icon ${
                          carouselNextIconHovered
                            ? "bg-dark w-50 p-2 rounded-2"
                            : ""
                        }`}
                        onMouseEnter={() => setCarouselNextIconHovered(true)}
                        onMouseLeave={() => setCarouselNextIconHovered(false)}
                        style={{ height: "2rem" }}
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>

            
              <div
                className={`w-100 justify-content-between px-3 py-2 position-absolute color-quicklook-div ${
                  productHovered ? "d-lg-flex is-visible" : "is-hidden"
                }`}
              >
                <div className="d-flex gap-2">
                  {colors.slice(0, 4).map((clrImg, i) => (
                    <div
                      className="product-colors-div rounded-circle d-flex justify-content-center align-items-center"
                      key={clrImg || i}
                      onClick={() => selectVariant(clrImg, data.productName)}
                    >
                      <img
                        src={encodeURI(`/${clrImg}`)}
                        alt=""
                        className="w-100 h-100 rounded-circle border border-1 border-dark"
                      />
                    </div>
                  ))}
                  {colors.length > 4 ? <div>+{colors.length - 4}</div> : null}
                </div>
                <Link
                  to={lookPath}
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  <div className="quickLook text-uppercase d-flex align-items-center justify-content-center">
                    Quick Look
                  </div>
                </Link>
              </div>
            </div>

          
            <div className="fav-page-box-info-container pe-2 ps-3 py-3">
              <div className="fav-page-box-name-container d-flex justify-content-between">
                <Link to={lookPath} className="text-decoration-none">
                  <h4 className="fav-page-box-name-text w-100">
                    {data.productName}
                  </h4>
                </Link>
                <div className="fav-page-box-add-fav-icon-container">
                  <IoIosHeart
                    className={`added-to-fav-product-icon ${
                      addedToFav.includes(data.productName)
                        ? "d-block"
                        : "d-none"
                    }`}
                    onClick={() => removeFromFav(data.productName)}
                  />
                  <IoIosHeartEmpty
                    className={`add-to-fav-product-icon ${
                      addedToFav.includes(data.productName)
                        ? "d-none"
                        : "d-block"
                    }`}
                    onClick={() => addToFav(data.productName)}
                  />
                </div>
              </div>
              <div className="fav-page-box-brand-name text-uppercase">
                {data.brand}
              </div>
              <div className="fav-page-box-price">₹ {data.price}</div>
              <div className="fav-page-box-trending-text text-uppercase fw-semibold">
                {data.trending ? "Trending" : null}
              </div>
              <div className="gap-2 d-flex d-lg-none">
                {colors.map((clrImg, i) => (
                  <div
                    className="product-colors-div rounded-circle d-flex justify-content-center align-items-center"
                    key={clrImg || i}
                    onClick={() => selectVariant(clrImg, data.productName)}
                  >
                    <img
                      src={encodeURI(`/${clrImg}`)}
                      alt=""
                      className="w-100 h-100 rounded-circle border border-1 border-dark"
                    />
                  </div>
                ))}
              </div>
              <div className="fav-page-box-same-color-text mt-3 text-capitalize d-flex gap-1">
                <span className="d-block">{colors.length}</span>
                <span className="d-block">colors available</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FavProducts;