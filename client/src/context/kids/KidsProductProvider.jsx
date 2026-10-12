import { useState, useContext } from "react";
import { UIContext } from "../UIContext";
import { KidsProductContext } from "./KidsProductContext";
import api from '../../api/api';

function KidsProductProvider({ children }) {
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const { setAddedToFav, addedToFav } = useContext(UIContext);
  const [carouselPrevIconHovered, setCarouselPrevIconHovered] = useState(false);
  const [carouselNextIconHovered, setCarouselNextIconHovered] = useState(false);
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterBtn, setFilterBtn] = useState('');

  const handleFilterByCat = async (type, kind) => {
    try {
      const res = await api.get(
        `/products/filter/kids/${kind}`,
        {
          params: {
            type: type
          }
        }
      );

      const uniqueProducts = Array.from(
        res.data.data.reduce((map, item) => {
          const productName = item.productName;

          if (!map.has(productName)) {
            map.set(productName, {
              ...item,
              availableColors: item.colorImage
                ? [item.colorImage]
                : []
            });
          } else {
            const existingProduct = map.get(productName);

            if (
              item.colorImage &&
              !existingProduct.availableColors.includes(item.colorImage)
            ) {
              existingProduct.availableColors.push(item.colorImage);
            }
          }

          return map;
        }, new Map()).values()
      );

      setFilterBtn(type);
      setProductData(uniqueProducts);

    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseFilterPop = (kind) => {
    handleFilterByCat('', kind);
  };

  const typeForBoysShirts = [
    'Oxford',
    'Poplin',
    'Cotton',
    'Flannel',
    'Denim'
  ];

  const typeForBoysJumpers = [
    'Quarter-Zip',
    'Crewneck',
    'Cable-Knit',
    'Cardigan',
    'V-Neck'
  ];

  const typeForGirlsJumpers = [
    'Quarter-Zip',
    'Crewneck',
    'Cable-Knit',
    'Cardigan',
    'V-Neck'
  ];

  const typeForBoysJackets = [
    'Puffer',
    'Windbreaker',
    'Quilted',
    'Denim',
    'Fleece'
  ];

  const typeForGirlsJackets = [
    'Puffer',
    'Windbreaker',
    'Quilted',
    'Denim',
    'Fleece'
  ];

  const typeForGirlsTshirts = [
    'Graphic Tee',
    'Long Sleeve',
    'Sweatshirt',
    'Hoodie',
    'Cotton Jersey'
  ];

  const typeForBoysTshirts = [
    'Graphic Tee',
    'Long Sleeve',
    'Sweatshirt',
    'Hoodie',
    'Cotton Jersey'
  ];

  const value = {
    hoveredProductId, 
    setHoveredProductId,
    setAddedToFav, 
    addedToFav,
    carouselPrevIconHovered, 
    setCarouselPrevIconHovered,
    carouselNextIconHovered, 
    setCarouselNextIconHovered,
    productData, 
    setProductData,
    isLoading, 
    setIsLoading,
    typeForBoysShirts,
    typeForBoysJumpers,
    typeForGirlsJumpers,
    typeForBoysJackets,
    typeForGirlsJackets,
    typeForGirlsTshirts,
    typeForBoysTshirts,
    handleCloseFilterPop,
    handleFilterByCat,
    filterBtn
  };

  return (
    <KidsProductContext value={value}>{children}</KidsProductContext>
  );
}

export default KidsProductProvider;