import { useRef, useState } from "react";
import { useLookProduct } from "../../../context/Look/LookProductContext";
import { isVideo } from "../../../context/Look/LookHelpers.js";
import { UIContext } from "../../../context/UIContext.jsx";
import { useContext } from "react";
import { IoCloseOutline } from "react-icons/io5";
import './CompleteLook.css'

function CompleteLook() {
    const {productLook,   formatImgSrc,} = useLookProduct();
    const {completeLookOpen,setCompleteLookOpen} = useContext(UIContext);
   
    const [activeSlide, setActiveSlide] = useState(0);
    const slideRefs = useRef([]);

  return (
    <div>
    {completeLookOpen && (
      <div className="d-flex flex-column w-100 position-relative z-2">
      <div className="bg-white rounded-circle position-relative d-flex justify-content-center align-items-center m-2 position-fixed end-0 p-1 close-btn-cp" onClick={() => setCompleteLookOpen(false)}>
           <IoCloseOutline className="fs-3 rounded-circle close-btn-cp"/>
        </div>
       
        <div
          className="d-flex flex-column gap-2 position-fixed ms-2"
          style={{ marginTop: "6rem" }}
        >
          {productLook?.slideImage?.map((slideUrl, index) => (
            <button
              type="button"
              key={index}
              className={`z-3 p-0 bg-transparent border ms-4 ${
                activeSlide === index ? "border-black border-1" : "border-secondary"
              }`}
              style={{ width: "3.5rem", cursor: "pointer" }}
              onClick={() => {
                setActiveSlide(index);
                slideRefs.current[index]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {isVideo(slideUrl) ? (
                <video
                  src={formatImgSrc(slideUrl)}
                  muted
                  playsInline
                  className="w-100 object-fit-contain"
                />
              ) : (
                <img
                  src={formatImgSrc(slideUrl)}
                  className="object-fit-contain w-100"
                  alt="Product"
                />
              )}
            </button>
          ))}
        </div>

        <div className="product-slideImage d-flex flex-column">
          {productLook?.slideImage?.map((slideUrl, index) => (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className="w-100"
            >
              {isVideo(slideUrl) ? (
                <video
                  src={formatImgSrc(slideUrl)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-100 h-auto object-fit-contain"
                />
              ) : (
                <img
                  src={formatImgSrc(slideUrl)}
                  className="w-100 h-auto object-fit-contain"
                  alt="Product"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  )
}

export default CompleteLook
