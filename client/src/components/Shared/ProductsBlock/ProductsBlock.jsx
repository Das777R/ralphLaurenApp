import { useState, useEffect } from 'react';
import './ProductsBlock.css';
import api from '../../../api/api';
import { Link, useParams } from 'react-router-dom';

function ProductsBlock() {
  const [fetchData, setfetchData] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchForProductBlock = async () => {
      try {
        const res = await api.get(`/landingPage/rlc-block`);
        setfetchData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchForProductBlock();
  }, []);

  const kidsPath = userId ? `/kids-section/${userId}` : '/kids-section';
  const womensPath = userId ? `/women-section/${userId}` : '/women-section';

  return (
    <div className="rlc-block d-flex flex-column flex-md-row justify-content-between w-100 mb-2">
      
      <div className="pre-fall-block">
        <video
          src={fetchData?.[0]?.media?.[0]}
          className="pre-fall-vid"
          autoPlay
          muted
          loop
        ></video>
        <div className="block-info-overlay">
          <div className="pre-fall-info">
            <p className="polo-ralph-lauren-p text-uppercase">{fetchData?.[0]?.brand}</p>
            <h2 className="pre-fall-title text-capitalize">{fetchData?.[0]?.title}</h2>
            <p className="pre-fall-text">{fetchData?.[0]?.description}</p>
            <Link to={womensPath} style={{ color: "inherit" }}>
              <h4 className="text-uppercase text-decoration-underline shopnow-pre-fall">shop now</h4>
            </Link>
          </div>
        </div>
      </div> 

      
      <div className="teen-shop-block">
        <img
          src={fetchData?.[1]?.media?.[0]}
          className="teen-shop-img"
          alt=""
        />
        <div className="block-info-overlay">
          <div className="teen-shop-info">
            <p className="polo-ralph-lauren-p text-uppercase">{fetchData?.[1]?.brand}</p>
            <h2 className="teen-shop-title text-capitalize">{fetchData?.[1]?.title}</h2>
            <p className="teen-shop-text">{fetchData?.[1]?.description}</p>
            <div className="shop-teen-shop d-flex gap-4">
              <Link to={kidsPath} style={{ color: "inherit" }}>
                <h4 className="text-uppercase text-decoration-underline shop-teen-shop">shop boys</h4>
              </Link>
              <Link to={kidsPath} style={{ color: "inherit" }}>
                <h4 className="text-uppercase text-decoration-underline shop-teen-shop">shop girls</h4>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ProductsBlock;