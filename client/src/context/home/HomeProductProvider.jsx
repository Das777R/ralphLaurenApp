import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { HomeProductContext } from "./HomeProductContext";
import { UIContext } from '../UIContext';
import api from '../../api/api';

function HomeProductProvider({ children }) {
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const { setAddedToFav, addedToFav } = useContext(UIContext);
  const [carouselPrevIconHovered, setCarouselPrevIconHovered] = useState(false);
  const [carouselNextIconHovered, setCarouselNextIconHovered] = useState(false);
  const [HomeGridData, setHomeGridData] = useState([]);
  const { userId, category } = useParams();

  const cleanCategory = decodeURIComponent(category || '');

  useEffect(() => {
    const fetchForHomeGrid = async () => {
      try {
        const result = await api.get(`/products/home/${cleanCategory}`);
        const uniqueProducts = Array.from(
          result.data.data.reduce((map, item) => {
            const productName = item.product;
            if (!map.has(productName)) {
              map.set(productName, {
                ...item,
                availableColors: item.colorImg ? [item.colorImg] : []
              });
            } else {
              const existingProduct = map.get(productName);
              if (item.colorImg && !existingProduct.availableColors.includes(item.colorImg)) {
                existingProduct.availableColors.push(item.colorImg);
              }
            }
            return map;
          }, new Map())
          .values()
        );
        setHomeGridData(uniqueProducts);
      } catch (err) {
        console.log(err);
      }
    };
    if (cleanCategory) {
      fetchForHomeGrid();
    }
  }, [cleanCategory]);

  const selectVariant = async (clrImg, product) => {
    try {
      const res = await api.get('/products/productByColor', {
        params: {
          clrImg: clrImg,
          product: product
        }
      });
      const newItem = res.data.data;

      setHoveredProductId(newItem._id);
      setHomeGridData((prevData) =>
        prevData.map((item) =>
          item.product === newItem.product
            ? { ...newItem, availableColors: item.availableColors }
            : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const isVideo = (url) => /\.(mp4|webm|mov|ogg)$/i.test(url);

  const addToFav = async (id) => {
    setAddedToFav((prev) => [...prev, id]);
    if (!userId) {
      const favo = JSON.parse(localStorage.getItem('fav')) || [];
      const data = [...favo, id]; 
      localStorage.setItem('fav', JSON.stringify(data));
    }
  };

  const removeFromFav = (id) => {
    setAddedToFav((prev) => prev.filter((x) => x !== id));
    const favo = JSON.parse(localStorage.getItem('fav')) || [];
    const data = favo.filter((x) => x !== id); 
    localStorage.setItem('fav', JSON.stringify(data));
  };

  const value = {
    hoveredProductId,
    setHoveredProductId,
    carouselPrevIconHovered,
    setCarouselPrevIconHovered,
    carouselNextIconHovered,
    setCarouselNextIconHovered,
    HomeGridData,
    setHomeGridData,
    userId,
    category,
    cleanCategory,
    selectVariant,
    isVideo,
    addedToFav,
    setAddedToFav,
    addToFav,
    removeFromFav
  };

  return (
    <HomeProductContext.Provider value={value}>
      {children}
    </HomeProductContext.Provider>
  );
}

export default HomeProductProvider;