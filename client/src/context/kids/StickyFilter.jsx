import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";

import { IoIosClose } from "react-icons/io";
import { useKidsContext } from "./KidsProductContext";


function StickyFilter() {
  const [showFilterHead, setShowFilterHead] = useState(false);
  const { category, userId } = useParams();
  const [handleEnterCat, setHandleEnterCat] = useState(null);
  const { filterBtn, handleCloseFilterPop } = useKidsContext();

  const cleanCategory = decodeURI(category);

  const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';
  const categoryPath = userId
    ? `/kids-section/category/${cleanCategory}/${userId}`
    : `/kids-section/category/${cleanCategory}`;

  useEffect(() => {
    const handleScroll = () => {
      setShowFilterHead(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky-filter-bar p-2 w-100 justify-content-between align-items-center position-fixed top-0 start-0 d-flex ${showFilterHead ? 'd-flex show-filter-bar' : ''}`}
      style={{ zIndex: 1000 }}
    >
      {filterBtn ? (
        <div className="sticky-filter-chip-wrap d-flex">
          <div className="filter-head-btn-pop d-flex justify-content-center align-items-center text-capitalize">
            <span>{filterBtn}</span>
            <IoIosClose style={{ cursor: 'pointer' }} className='close-head-filter' onClick={() => handleCloseFilterPop(cleanCategory)} />
          </div>
        </div>
      ) : (
        <div className="sticky-filter-breadcrumb-wrap text-dark">
          <div className="sticky-filter-breadcrumb text-dark text-uppercase">
            <Link
              className={`sticky-filter-link-kids text-dark me-2 ${handleEnterCat === 'kids' ? 'text-decoration-underline' : ''}`}
              style={{ textDecoration: "inherit" }}
              onMouseEnter={() => setHandleEnterCat('kids')}
              onMouseLeave={() => setHandleEnterCat('')}
              to={kidsPath}
            >
              kids
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
        <BiFilterAlt className="sticky-filter-icon" />
        <p className="sticky-filter-text text-uppercase font-monospace">Filter & Sort</p>
      </div>
    </div>
  );
}

export default StickyFilter;