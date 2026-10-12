import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import './StickyFilter.css';
import { IoIosClose } from "react-icons/io";
import { useWomenContext } from "./WomenProductContext";


function StickyFilter() {
  const [showFilterHead, setShowFilterHead] = useState(false);
  const { category, userId } = useParams();
  const [handleEnterCat, setHandleEnterCat] = useState(null);
  const { filterBtn,  handleCloseFilterPop} = useWomenContext();
 
  const cleanCategory = decodeURI(category);

  const womensPath = userId ? `/women-section/${userId}` : '/women-section';
  const categoryPath = userId
    ? `/women-section/category/${cleanCategory}/${userId}`
    : `/women-section/category/${cleanCategory}`;


  useEffect(() => {
  const handleScroll = () => {
    setShowFilterHead(window.scrollY > 500);
  }

   window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  },[])



  return (
   <div
     className={`sticky-filter-bar p-2 w-100 justify-content-between align-items-center position-fixed top-0 start-0 d-flex ${showFilterHead ? 'd-flex show-filter-bar' : ''}`}
     style={{ zIndex: 1000 }}
   >
    { filterBtn ? (
        <div className="sticky-filter-chip-wrap d-flex">
          <div className="filter-head-btn-pop d-flex justify-content-center align-items-center text-capitalize">
            <span>{filterBtn}</span>
            <IoIosClose style={{ cursor: 'pointer' }} className='close-head-filter' onClick={() => handleCloseFilterPop(cleanCategory)} />
          </div>
        </div>
    
    ):(
     <div className="sticky-filter-breadcrumb-wrap text-dark">
            <div className="sticky-filter-breadcrumb text-dark text-uppercase">
            <Link
              className={`sticky-filter-link-men text-dark me-2 ${handleEnterCat === 'men' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('men')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={womensPath}
            >
              men
            </Link>
            /
            <Link
              className={`sticky-filter-link-category text-dark mx-2 ${handleEnterCat === cleanCategory ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat(cleanCategory)}
              onMouseLeave={() => setHandleEnterCat('')}
              to={categoryPath}
            >
              {cleanCategory}
            </Link>
            /
          </div>
     </div>
    )}

     <div className="sticky-filter-action d-flex gap-1">
      <BiFilterAlt className="sticky-filter-icon"/>
      <p className="sticky-filter-text text-uppercase font-monospace">Filter & Sort</p>
     </div>
   </div>
  )
}

export default StickyFilter