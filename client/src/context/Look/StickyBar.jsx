import { useState, useEffect } from "react";
import { useLookProduct } from "./LookProductContext";
import { useContext } from "react";
import { UIContext } from "../UIContext";
import './StickyBar.css';

function StickyBar() {
  const { productLook, formatImgSrc, handleAddToBag, addedToBag, lookSize} = useLookProduct();
  const [headBag, ShowHeadBag] = useState(false);
  const {completeLookOpen} = useContext(UIContext);

  useEffect(() => {
    const handleScroll = () => {
      ShowHeadBag(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`bg-body z-3 w-100  justify-content-between align-items-center position-sticky top-0 sticky-bar-container ${headBag ? 'sticky-bar-visible' : ''} ${completeLookOpen ? 'd-none': ''}`}>
        <div className="d-flex gap-3 align-content-center">
          <div className="sticky-bar-img-wrapper">
            <img src={formatImgSrc(productLook.lookImage)} alt="" className="w-100 h-100 object-fit-contain" />
          </div>
          <div className="sticky-bar-info mt-2">
            <h3 className="sticky-bar-title">{productLook.productName}</h3>
            <p className="sticky-bar-price">₹{productLook.price}</p>
          </div>
        </div>

        <div 
          className="text-white d-flex align-items-center justify-content-center text-uppercase sticky-bar-btn" 
          onClick={() => handleAddToBag(productLook._id, lookSize)}
          aria-controls="offcanvasExample"
          href={lookSize ? "#offcanvasExample" : undefined}
          data-bs-toggle={lookSize ? "offcanvas" : undefined}
        >
          {addedToBag ? 'Item added' : 'add to bag'}
        </div>
      </div>
    </>
  );
}

export default StickyBar;