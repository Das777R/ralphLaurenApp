import './KidsExplore.css';
import { useState, useEffect, useRef } from 'react';
import api from '../../../api/api';
import { Link, useParams } from 'react-router-dom';

const SECTION_BY_TITLE = {
  women: 'women-section',
  men: 'men-section',
  kids: 'kids-section',
  home: 'home-section',
};

function KidsExplore() {
  const [kidsExploreData, setKidsExploreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const fetchForKidsSlide = async () => {
      try {
        const res = await api.get('/mediaforpage/kids&baby/explore');
        setKidsExploreData(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForKidsSlide();
  }, []);

  const scrollBoxRef = useRef(null);
  const scrolledRightBtnRef = useRef(null);
  const scrolledLeftBtnRef = useRef(null);

  const scrollLeft = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTo({
        left: scrollBoxRef.current.scrollLeft - 300,
        behavior: "smooth",
      });
    }

    if (scrolledLeftBtnRef.current) {
      scrolledLeftBtnRef.current.classList.add("active");
      scrolledRightBtnRef.current.classList.remove("active");
    }
  };

  const scrollRight = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTo({
        left: scrollBoxRef.current.scrollLeft + 300,
        behavior: "smooth",
      });
    }

    if (scrolledRightBtnRef.current) {
      scrolledRightBtnRef.current.classList.add("active");
      scrolledLeftBtnRef.current.classList.remove("active");
    }
  };

  function getLink(title = '') {
    const section = SECTION_BY_TITLE[title.trim().toLowerCase()] || 'kids-section';
    return userId ? `/${section}/${userId}` : `/${section}`;
  }

  if (isLoading) {
    return (
      <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "20rem" }}>
        <div className="spinner-grow text-dark" style={{ width: "4rem", height: "4rem" }} role="status"></div>
      </div>
    );
  }

  return (
    <div className="kids-explore-cont p-lg-1 py-1 px-1 d-flex">
      <div className="kids-explore-img-cont">
        <div className="kids-explore-img position-relative overflow-hidden d-flex flex-column justify-content-center">
          <h1 className="text-capitalize">More to <span className="d-block">Explore</span></h1>
          <p>Discover our curated edits and seasonal collections</p>
        </div>
      </div>

      <div className="kids-explore-carousel-cont">
        <div className="btn-group ms-0 mb-3 w-100 pe-1 pe-lg-5 mt-5 d-flex justify-content-end position-relative" role="group">
          <div
            className="fs-3 kids-move-right-btn btn-md rounded-start-1 px-3 position-relative"
            onClick={scrollLeft}
            ref={scrolledLeftBtnRef}
            style={{ cursor: "pointer" }}
          >&lsaquo;</div>
          <div
            className="fs-3 kids-move-left-btn btn-md rounded-end-1 px-3 position-relative"
            onClick={scrollRight}
            ref={scrolledRightBtnRef}
            style={{ cursor: "pointer" }}
          >&rsaquo;</div>
        </div>

        <div className="kids-explore-img-carosuel-cont d-flex gap-2 overflow-x-auto" ref={scrollBoxRef}>
          {kidsExploreData?.map((item) => (
            <Link
              to={getLink(item?.title)}
              key={item?._id || item?.title}
              className="flex-shrink-0 text-decoration-none"
            >
              <div className="kids-explore-img-carousel position-relative">
                <img src={item?.media[0]} alt="" className="kids-explore-img-carousel-img"/>
                <div className="kids-explore-img-info position-absolute">
                  <h2 className="kids-explore-category-carousel-text text-capitalize text-white">{item?.title}</h2>
                  <p className="text-uppercase text-white text-decoration-underline shopnow-kids">shop now</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KidsExplore;