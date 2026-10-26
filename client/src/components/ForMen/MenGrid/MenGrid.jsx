
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../../api/api.js';

function MenGrid() {
  const {userId} = useParams();
  const [gridData, setGridData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForMenGridDeskTop = async () => {
      try{
        const res = await api.get('/mediaforpage/men/category');
        setGridData(res.data.data)
      }catch(err){
        console.log(err)
      }finally{
        setIsLoading(false)
      }
    }

    fetchForMenGridDeskTop()
  },[])

  if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
  }

 
  const m_casual_shirts_path = userId ? `/men-section/category/casual shirts/${userId}`:`/men-section/category/casual shirts`;
  const m_polo_shirts_path = userId ? `/men-section/category/polo shirts/${userId}`:`/men-section/category/polo shirts`;
  const m_jumpers_path = userId ? `/men-section/category/jumpers & cardigans/${userId}`: `/men-section/category/jumpers & cardigans`;
  const m_jackets_path = userId ? `/men-section/category/jackets & coats/${userId}`:`/men-section/category/jackets & coats`;
  const m_shorts_path = userId ? `/men-section/category/shorts/${userId}` : `/men-section/category/shorts`;
  const m_accessories_path = userId ? `/men-section/category/accessories/${userId}` : `/men-section/category/accessories`;

  const getImageUrl = (titleName, isMobile) => {
    const matchedGridData = gridData.find((item) => item.forMobile === isMobile && item.title.toLowerCase() === titleName.toLowerCase());
    return matchedGridData?.media?.[0];
  }

  return (
  <div className="women-men-categories-cont">
    <h1 className="women-categories-title text-capitalize text-xl-center text-xxl-center text-lg-center text-md-center text-sm-start">men's categories</h1>
    <div className="grid-container">
      <div className="box-grid box-grid-1">
        <Link to={m_casual_shirts_path}>
        <img src={getImageUrl("Casual Shirts", false)} alt="women-category-shirts" className="women-men-cat-desktop"/>
        <img src={getImageUrl("Casual Shirts", true)} alt="women-category-shirts-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">Shirts</div>
        </Link>
      </div>
      <div className="box-grid box-grid-2">
        <Link to={m_polo_shirts_path}>
        <img src={getImageUrl("polo shirts", false)} alt="women-category-jumpers" className="women-men-cat-desktop"/>
        <img src={getImageUrl("polo shirts", true)} alt="women-category-jumpers-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{'polo shirts'}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-3">
        <Link to={m_jumpers_path}>
        <img src={getImageUrl("jumpers & cardigans", false)} alt="women-category-dresses" className="women-men-cat-desktop"/>
        <img src={getImageUrl("jumpers & cardigans", true)} alt="women-category-dresses-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{'jumpers & cardigans'}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-4">
        <Link to={m_jackets_path}>
        <img src={getImageUrl("jackets & coats", false)} alt="women-category-trousers" className="women-men-cat-desktop"/>
        <img src={getImageUrl("jackets & coats", true)} alt="women-category-trousers-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{'jackets & coats'}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-5">
        <Link to={m_shorts_path}>
        <img src={getImageUrl("shorts", false)} alt="women-category-bags" className="women-men-cat-desktop"/>
        <img src={getImageUrl("shorts", true)} alt="women-category-bags-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{'shorts'}</div>
        </Link>
      </div>
      <div className="box-grid box-grid-6">
        <Link to={m_accessories_path}>
        <img src={getImageUrl("accessories", false)} alt="women-category-jackets" className="women-men-cat-desktop"/>
        <img src={getImageUrl("accessories",true)} alt="women-category-jackets-mobile" className="women-men-cat-mobile"/>
        <div className="text-label">{"accessories"}</div>
        </Link>
      </div>
    </div>
  </div>
  )
}

export default MenGrid
