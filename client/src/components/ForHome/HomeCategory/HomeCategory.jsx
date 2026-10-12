import './HomeCategory.css';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../../api/api';

function HomeCategory() {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/mediaforpage/home/category');
        setCategoryData(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "15rem" }}>
        <div className="spinner-grow text-dark" style={{ width: "4rem", height: "4rem" }} role="status"></div>
      </div>
    );
  }

  return (
    <div className="home-category-container d-flex flex-column flex-md-row justify-content-center align-items-center py-lg-4 py-md-3 py-2 w-100 gap-0">
      <div className="home-category-title text-capitalize">
        Shop by <span className="text-dark d-block span-category">Category</span>
      </div>
      <div className="home-category-item-container d-flex flex-wrap flex-md-nowrap justify-content-center gap-2">
        {categoryData?.map((item) => {
          const categoryPath = userId
            ? `/home-section/category/${item?.title}/${userId}`
            : `/home-section/category/${item?.title}`;

          return (
            <Link
              to={categoryPath}
              className="home-category-item text-decoration-none text-dark"
              key={item?._id}
            >
              <img src={item?.media[0]} alt={item?.title} />
              <p className="text-center text-capitalize">{item?.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default HomeCategory;