import { useContext } from "react"
import { UIContext } from "../../../context/UIContext.jsx";
import './RlcOnSearchClick.css';
import api from "../../../api/api.js";
import { useNavigate, Link, useParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";


function RlcOnSearchClick() {
   const {openSearchBar, setOpenSearchBar, setNav, Nav} = useContext(UIContext);
   const {setSearchedData,setFreezeST, setIsLoading,searchTerm, setSearchTerm} = useContext(UIContext)
   const nav = useNavigate();
   const {userId} = useParams();

     
    const mensPath = userId ? `/men-section/${userId}` : '/men-section'
    const womensPath = userId ? `/women-section/${userId}` : '/women-section'
    const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';
    const homeNavPath = userId ? `/home-section/${userId}` : `/home-section`;


    const handleNav = () => {
      if(Nav){
       setNav(false);
       setOpenSearchBar(true);
      } else {
        setNav(false);
        setOpenSearchBar(false);
      }
     }
   
   

   const handleOnChangeTerm = (e) => {
    const {value} = e.target;
     setSearchTerm(value);
   }

  const handleOnKeyDown = (e) => {
     if(e.key === "Enter"){
   const getSearchedData = async (query) => {
try{
  const res = await api.get(`/products/search?q=${query}`);
  setIsLoading(true);
  setSearchedData(res.data.data)
  setFreezeST(searchTerm)
  if(userId){
    nav(`/search/${userId}`)
    }else{
    nav('/search')
    }
  setOpenSearchBar(false);
}catch(err){
  console.log(err)
  setSearchedData([]);
  setIsLoading(false);
}

  }
  getSearchedData(searchTerm);
     }
}

const handleTermSearch = async (query) => {
  try{
    const res = await api.get(`/products/search?q=${query}`);
    setIsLoading(true);
    setSearchedData(res.data.data);
    setFreezeST(query)
    if(userId){
      nav(`/search/${userId}`)
    }else{
    nav('/search')
    }
    setOpenSearchBar(false);
  }catch(err){
    console.log(err);
    setSearchedData([]);
    setIsLoading(false);
  }
}


const searchPath = userId ? `/search/${userId}` : '/search';
   

  return (
  
<div className={`rlc-on-search w-100 bg-body ${openSearchBar ? 'd-block': 'd-none'}`}>
  <div className="search-for-rlc-container mt-3 pe-2 ps-3 pe-lg-2 ps-lg-3 d-flex align-items-center w-100 rounded-1">
  <IoIosSearch className="banner-icon search-icon-for-rlc"/>
  <input
  type="text"
  placeholder="Search"
  className="search-bar-for-rlc-products"
  value={searchTerm}
  onChange={handleOnChangeTerm}
  onKeyDown={handleOnKeyDown}
  />
  <div className="delete-query-container" onClick={() => setSearchTerm('')}>
  <i
  className="fa-solid fa-x delete-query-rlc-search"
  />
  </div>
  </div>

  <div className="pc-ts-container position-relative d-flex mt-4">
  <div className="rlc-trending-search-container mt-4">
    <h5 className="trending-search-title text-uppercase">trending searches</h5>
    <div className="rlc-queries">
      <div className="query-bag" onClick={() => handleTermSearch("Bags")}>
        <IoIosSearch
 className="for-query-search"/>
          <Link to={searchPath} style={{textDecoration: "none", color: "inherit"}}>
            Bags
          </Link>
      </div>
      <div className="query-boots" onClick={() => handleTermSearch("boots")}>
        <IoIosSearch
 className="for-query-search"/>
          <Link to={searchPath} style={{textDecoration: "none", color: "inherit"}}>
            Boots
          </Link>
      </div>
      <div className="query-coat" onClick={() => handleTermSearch("coats")}>
         <IoIosSearch
 className="for-query-search"/>

          <Link to={searchPath} style={{textDecoration: "none", color: "inherit"}}>
              Coat
          </Link>
    
      </div>
      <div className="query-polo-shirt" onClick={() => handleTermSearch("Polo Shirt")}>
        <IoIosSearch
 className="for-query-search"/>

          <Link to={searchPath} style={{textDecoration: "none", color: "inherit"}}>
              Polo Shirt
          </Link>
      </div>
    </div>
  </div>

  <div className="pc-container ms-5">
    <h3 className="pc-title text-capitalize">popular categories</h3>
    <div className="pc-img-container d-flex gap-3">
      <div className="pc-img pc-men-container">
      <div className="pc-men-img-container">
      <Link to={mensPath} style={{color:"inherit"}} onClick={handleNav}>
      <img src="/images/pc/pc-men.avif" alt="" className="pc-men-img"/>
      </Link>
      </div>

      <div className="pc-text-container">
      <h4 className="pc-title-men text-uppercase">men</h4>
      <Link to={mensPath} style={{color:"inherit"}} onClick={handleNav}>
      <p className="pc-shopnow text-uppercase text-decoration-underline">shop now</p>
      </Link>
      </div>
      </div>
      <div className="pc-img pc-women-container">
        <div className="pc-women-img-container">
        <Link to={womensPath} style={{color: "inherit"}} onClick={handleNav}>
          <img src="/images/pc/pc-women.avif" alt="" className="pc-women-img"/>
        </Link>
        </div>
        <div className="pc-text-container">
          <h4 className="pc-title-women text-uppercase">women</h4>
            <Link to={womensPath} style={{color: "inherit"}} onClick={handleNav}>
          <p className="pc-shopnow text-uppercase text-decoration-underline">shop now</p>
          </Link>
        </div>
      </div>

      <div className="pc-img pc-kids-container">
        <div className="pc-kids-img-container">
        <Link to={kidsPath} style={{color: "inherit"}} onClick={handleNav}> 
        <img src="/images/pc/pc-kids.avif" alt="" className="pc-kids-img"/>
        </Link> 
        </div>
        <div className="pc-text-container">
          <h4 className="pc-title-kids text-uppercase">kids</h4>
          <Link to={kidsPath} style={{color: "inherit"}} onClick={handleNav}> 
          <p className="pc-shopnow text-uppercase text-decoration-underline ">shop now</p>
          </Link>
        </div>
        </div>
        <div className="pc-img pc-home-container">
        <div className="pc-home-img-container">
        <Link to={homeNavPath} style={{color: "inherit"}} onClick={handleNav}>
         <img src="/images/pc/pc-home.avif" alt="" className="pc-home-img"/>
        </Link>
        </div>
        <div className="pc-text-container">
          <h4 className="pc-title-home text-uppercase">home</h4>
          <Link to={homeNavPath} style={{color: "inherit"}} onClick={handleNav}>
           <p className="pc-shopnow text-uppercase text-decoration-underline">shop now</p>
          </Link>
        </div>
      </div>
    </div>
  </div>
  </div> 
</div>
  
  )
}

export default RlcOnSearchClick
