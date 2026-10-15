import { useEffect,} from "react";
import './ProductBox.css';
import { Link, useParams } from "react-router-dom";
import api from '../../../api/api.js';
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import { useMenContext } from "../../../context/men/MenProductContext.js";

function ProductBox() {
const { 
  hoveredProductId, 
  setHoveredProductId,
  setAddedToFav, 
  addedToFav,
  carouselPrevIconHovered,
  setCarouselPrevIconHovered 
  ,carouselNextIconHovered, 
  setCarouselNextIconHovered,
  productData, 
  setProductData,
  isLoading, 
  setIsLoading
} = useMenContext();  

const { category, userId } = useParams();


useEffect(() => {
 const fetchProduct = async () => {
  try{
  const res = await api.get(`/products/men/${category.toUpperCase()}`);

  const uniqueProducts = Array.from(
  res.data.data.reduce((map, item) => {
  const productName = item.productName;
      if (!map.has(productName)) {
        map.set(productName, {
          ...item,
          availableColors: item.colorImage ? [item.colorImage] : []
        });
      } else {
        const existingProduct = map.get(productName);
        if (item.colorImage && !existingProduct.availableColors.includes(item.colorImage)) {
          existingProduct.availableColors.push(item.colorImage);
        }
      }

      return map;
    }, new Map())
    .values()
  );

  setProductData(uniqueProducts);
  }catch(err){console.log(err)}
  finally{
    setIsLoading(false)
  }

};
fetchProduct();
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

  setHoveredProductId(newItem._id);
  setProductData((prevData) =>
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

const addToFav = (product) => {

setAddedToFav(prev => [...prev, product]);

if (!userId) {
  const favo = JSON.parse(localStorage.getItem("fav")) || [];
  const data = [...favo, product];
  localStorage.setItem("fav", JSON.stringify(data));
}
};

const removeFromFav = (product) => {
const favo = JSON.parse(localStorage.getItem("fav")) || [];
const data = favo.filter((x) => x !== product);

localStorage.setItem("fav", JSON.stringify(data));
setAddedToFav(data);
};

return (
<div className="d-flex flex-wrap gap justify-content-center">
  {productData.map((data,index) => {
    const productHovered = hoveredProductId === data._id;
    const lookPath = userId ? `/lookup/${data._id}/${userId}` : `/lookup/${data._id}`;
    return (
      <div
        className="product-box-container position-relative"
        key={data._id || index}
      >
        <div
          onMouseEnter={() => setHoveredProductId(data._id)}
          onMouseLeave={() => setHoveredProductId(null)}
          className=""
        >
          <div className="product-box-img-container-carousel ">
            <div className="product-box-carousel">
              <img
                src={encodeURI(`/${data.lookImage}`)}
                alt=""
                className={`w-100 object-fit-cover ${
                  productHovered ? "is-hidden" : "is-visible"
                }`}

                style={{transition:"all ease-in-out 0.8s"}}
              />
              <div
                id={data._id}
                className={`carousel carousel-dark slide product-box-carousel fade-element ${
                  productHovered ? "is-visible" : "is-hidden"
                }`}
                data-bs-ride="carousel"
              >
                <div className="carousel-inner product-box-carousel-inner">
                  {data.slideImage?.map((srcLink, slideIndex) => (
                    <div
                      className={`carousel-item product-box-carousel-item ${
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
                  className="carousel-control-prev product-box-carousel-control-prev"
                  type="button"
                  data-bs-target={`#${data._id}`}
                  data-bs-slide="prev"
                >
                  <span
                    className={`carousel-control-prev-icon  product-box-carousel-control-prev-icon ${
                      carouselPrevIconHovered ? "w-50 p-2 bg-dark rounded-2" : ""
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
            className={`w-100 justify-content-between px-3 py-2 d-lg-flex position-absolute color-quicklook-div ${
              productHovered ? "is-visible" : "is-hidden"
            }`} 
          >
    <div className="d-flex gap-2">
      {data?.availableColors?.slice(0,4).map((clrImg, index) => {
        return (

          <div
            className={`product-colors-div rounded-circle d-flex justify-content-center align-items-center`}
            key={clrImg || index}
            onClick={() => selectVariant(clrImg, data.productName)}
            
          >
            <img
              src={encodeURI(`/${clrImg}`)}
              alt=""
              className={`w-100 h-100 rounded-circle border border-1 border-dark`}
            />     
          </div>            
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
              <h4 className="product-box-name-text w-100">{data?.productName}</h4>
            </Link>
            <div className="add-fav-icon-container">

                <IoIosHeart   className={`fa-solid fa-heart added-to-fav-product-icon ${
                  addedToFav.includes(data.productName) ? "d-block" : "d-none"
                }`} 
                onClick={() => removeFromFav(data.productName)}/>
                      
                <IoIosHeartEmpty  className={`add-to-fav-product-icon ${
                  addedToFav?.includes(data.productName) ? "d-none" : "d-block"
                }`}   onClick={() => addToFav(data.productName)}/>
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
                      src={encodeURI(`/${clrImg}`)}
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

export default ProductBox;