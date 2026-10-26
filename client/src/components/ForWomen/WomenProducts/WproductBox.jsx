import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom"; 
import api from "../../../api/api";
import { UIContext } from "../../../context/UIContext";
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";

function WproductBox() {
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const { setAddedToFav, addedToFav } = useContext(UIContext);
  const [carouselPrevIconHovered, setCarouselPrevIconHovered] = useState(false);
  const [carouselNextIconHovered, setCarouselNextIconHovered] = useState(false);
  const [womenGridData, setWomenGridData] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  const {userId,category} = useParams();

  const cleanCategory = decodeURIComponent(category);
  
  useEffect(() => {
    const fetchForWomenGrid = async () => {
      try {
        const result = await api.get(`/products/women/${cleanCategory(category)}`);
          const uniqueProducts = Array.from(
            result.data.data.reduce((map, item) => {
            const productName = item.product;
            if (!map.has(productName)) {
              map.set(productName, {
                ...item,
                availableColors: item.colorImg ? [item.colorImg] : []
              });
            } else {
            
              const existingProduct = map.get(productName);
              if (item.colorImg && !existingProduct.availableColors.includes(item.colorImg)) {
                existingProduct.availableColors.push(item.colorImg);
              }
            }

            return map;
          }, new Map())
          .values()
        );
        setWomenGridData(uniqueProducts);
      } catch (err) {
        console.log(err);
      }finally{setIsLoading(false)}
    }
    fetchForWomenGrid();
  }, []);


  if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
}


  const selectVariant = async (clrImg, product) => {
    try {
      const res = await api.get('/products/productByColor', {
        params: {
        clrImg: clrImg,
        product: product
    }
      });
      const newItem = res.data.data;

      setHoveredProductId(newItem._id)
      setWomenGridData((prevData) =>
      prevData.map((item) =>
      item.product === newItem.product
      ? { ...newItem, availableColors: item.availableColors }
      : item
      )
      );
    } catch (err) {
      console.log(err);
    }
  };

const isVideo = (url) => /\.(mp4|webm|mov|ogg)$/i.test(url);


const addToFav = async (id) => {
setAddedToFav((prev) => [...prev, id]);
if(!userId){
const favo = JSON.parse(localStorage.getItem('fav')) || [];
const data = [...favo, id]; 
localStorage.setItem('fav', JSON.stringify(data));
}};

const removeFromFav = (id) => {
setAddedToFav((prev) => prev.filter((x) => x !== id));
const favo = JSON.parse(localStorage.getItem('fav')) || [];
const data = favo.filter((x) => x !== id); 
localStorage.setItem('fav', JSON.stringify(data));
};

return (
<div className="d-flex flex-wrap gap justify-content-center">
  {womenGridData.map((data) => {
    const productHovered = hoveredProductId === data._id;
    const lookPath = userId ? `/lookup/${data._id}/${userId}` : `/lookup/${data._id}`;
    return (
      <div
        className="product-box-container position-relative"
        key={data.product}
      >
        <div
          onMouseEnter={() => setHoveredProductId(data._id)}
          onMouseLeave={() => setHoveredProductId(null)}
          className=""
        >
          <div className="product-box-img-container-carousel ">
            <div className="product-box-carousel">
              <img
                src={data.lookImages}
                alt=""
                className={`w-100 object-fit-cover ${
                  productHovered ? "d-none" : "d-block"
                }`}
              />
              <div
                id={data._id}
                className={`carousel carousel-dark slide product-box-carousel ${
                  productHovered ? "d-block" : "d-none"
                }`}
                data-bs-ride="carousel"
              >
                <div className="carousel-inner product-box-carousel-inner">
                  {data.slideImages?.map((srcLink, slideIndex) => (
                    <div
                      className={`carousel-item product-box-carousel-item ${
                        slideIndex === 0 ? "active" : ""
                      }`}
                      key={slideIndex}
                    >
                      <Link to={lookPath} className="no-underline">
                        {isVideo(srcLink) ? (
                          <video
                            src={srcLink}
                            className="d-block w-100"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={srcLink}
                            className="d-block w-100 object-fit-cover"
                            alt="Product"
                          />
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev product-box-carousel-control-prev"
                  type="button"
                  data-bs-target={`#${data._id}`}
                  data-bs-slide="prev"
                >
                  <span
                    className={`carousel-control-prev-icon product-box-carousel-control-prev-icon ${
                      carouselPrevIconHovered ? "bg-dark w-50 p-2 rounded-2" : ""
                    }`}
                    onMouseEnter={() => setCarouselPrevIconHovered(true)}
                    onMouseLeave={() => setCarouselPrevIconHovered(false)}
                    style={{ height: "2rem" }}
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next product-box-carousel-control-next"
                  type="button"
                  data-bs-target={`#${data._id}`}
                  data-bs-slide="next"
                >
                  <span
                    className={`carousel-control-next-icon product-box-carousel-next-icon ${
                      carouselNextIconHovered ? "bg-dark w-50 p-2 rounded-2" : ""
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
            className={`w-100 justify-content-between px-3 py-2 position-absolute color-quicklook-div d-none  ${
              productHovered ? "d-lg-flex" : "d-none"
            }`} 
          >
    <div className="d-flex gap-2">
      {data?.availableColors?.slice(0,4).map((clrImg, index) => {
        
        return (
          <>
          <div
            className={`product-colors-div rounded-circle d-flex justify-content-center align-items-center`}
            key={index}
            onClick={() => selectVariant(clrImg, data.productName)}
          >
            <img
              src={clrImg}
              alt=""
              className={`w-100 h-100 rounded-circle border border-1 border-dark`}
            />     
          </div>            
          </>
        );
      })}
      <div className="">{data.availableColors.length > 4 ? 
      <div className="">
        +{data?.availableColors?.slice(4,-1).length + 1}
      </div> : null}</div>
    </div>
    <Link to={lookPath} style={{ color: "inherit", textDecoration: "inherit" }}>
        <div className="quickLook text-uppercase d-flex align-items-center justify-content-center">
          Quick Look
        </div>
    </Link>
          </div>
        </div>

       
        <div className="product-info-container pe-2 ps-3 py-3">
          <div className="product-name-container d-flex justify-content-between">
            <Link to={lookPath} className="text-decoration-none">
              <h4 className="product-box-name-text w-100">{data.product}</h4>
            </Link>
            <div className="add-fav-icon-container">
              <IoIosHeartEmpty className={`fa-regular fa-heart add-to-fav-product-icon ${
                  addedToFav.includes(data.productName) ? "d-none" : "d-block"
                }`}
                onClick={() => addToFav(data.productName)}/>
              <IoIosHeart className={`fa-solid fa-heart added-to-fav-product-icon ${
                  addedToFav.includes(data.productName) ? "d-block" : "d-none"
                }`}
                onClick={() => removeFromFav(data.productName)}/>
            </div>
          </div>
          <div className="brand-name text-uppercase">{data.brand}</div>
          <div className="product-box-price">₹ {data.price}</div>
          <div className="trending-text text-uppercase fw-semibold">
            {data.trending ? "Trending" : null}
          </div>
        <div className="gap-2 d-flex d-lg-none">
              {data?.availableColors?.map((clrImg, index) => {
                return (
                  <div
                    className="product-colors-div rounded-circle d-flex justify-content-center align-items-center"
                    key={index}
                    onClick={() => selectVariant(clrImg, data.productName)}
                  >
                    <img
                      src={clrImg}
                      alt=""
                      className="w-100 h-100 rounded-circle border border-1 border-dark"
                    />
                  </div>
                );
              })}
        </div>
          <div className="same-color-product-box-text mt-3 text-capitalize d-flex gap-1">
            <span className="d-block">{data.availableColors?.length}</span>
            <span className="d-block">colors available</span>
          </div>
        </div>
      </div>
    );
  })}
</div>
  );
}

export default WproductBox;