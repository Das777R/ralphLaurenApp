import { useState, useRef, useEffect } from 'react';
import './WorldLuxury.css';
import api from '../../../api/api';

function WorldLuxury() {
  const [fetchData, setFetchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const forWorldLuxury = async () => {
      try {
        const res = await api.get('/landingPage/rlc-wrapper');
        setFetchData(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    forWorldLuxury();
  }, []);

  const scrollBoxRef = useRef();
  const scrolledRightBtnRef = useRef();
  const scrolledLeftBtnRef = useRef();

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

  if (isLoading) {
    return (
      <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "20rem" }}>
        <div className="spinner-grow text-dark" style={{ width: "4rem", height: "4rem" }} role="status"></div>
      </div>
    );
  }

  return (
    <div className="wrld-lxry-container pb-5">
      <div className="wrld-lxry-para ms-3">
        <h1 className="wrld-lxry-title text-capitalize text-dark fs-1">the world of luxury</h1>
        <p className="wrld-lxry-text">Explore seasonal collections, iconic accessories, and more</p>
      </div>

      <div className="btn-group ms-3 mb-3 w-100 d-flex justify-content-end pe-5 position-relative" role="group">
        <div 
          className="fs-3 move-right-btn btn-md rounded-start-1 px-3 position-relative"
          onClick={scrollLeft}
          ref={scrolledLeftBtnRef}
          style={{ cursor: "pointer" }}
        >&lsaquo;</div>
        <div 
          className="fs-3 move-left-btn btn-md rounded-end-1 px-3 position-relative"
          onClick={scrollRight}
          ref={scrolledRightBtnRef}
          style={{ cursor: "pointer" }}
        >&rsaquo;</div>
      </div>

      <div className="wrld-lxry-prefall-container d-flex gap-2 py-2 overflow-x-auto" ref={scrollBoxRef}>
        {fetchData.map((item, index) => {
          return (
            <div className="wrld-lxry-prefall-2026 rlc-collection position-relative flex-shrink-0" key={index}>
              <img src={item?.media} alt="" className="wrld-lxry-prefall-2026-img" />
              <div className="wrld-lxry-info-container position-absolute">
                <p className="wrld-lxry-info-title text-uppercase">
                  {item?.title}
                </p>
                <h3 className="wrld-lxry-big-season text-capitalize">
                  {item?.description}
                </h3>
                <p className="wrld-lxry-shop-now text-uppercase text-decoration-underline mt-4">shop now</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorldLuxury;