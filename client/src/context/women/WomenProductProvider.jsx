import { useState,useContext} from "react";
import { UIContext } from "../UIContext";
import { WomenProductContext } from "./WomenProductContext";
import api from '../../api/api'

function WomenProductProvider({children}) {

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
        `/products/filter/women/${kind}`,
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
  const typeForShirts = [
    'Relaxed Fit',
    'Slim Fit',
    'Oversized Fit',
    'Classic Fit',
    'Straight Fit'
  ];

  const typeForJumpers = [
    'Crewneck',
    'V-Neck',
    'Cable-Knit',
    'Turtleneck',
    'Cardigan',
    'Quarter-Zip'
  ];

  const typeForDresses = [
    'Shirtdress',
    'Wrap',
    'Maxi',
    'Midi',
    'Cocktail',
    'Knit'
  ];

  const typeForTrousers = [
    'Wide-Leg',
    'Straight Fit',
    'Tailored Fit',
    'Slim Fit',
    'Pleated',
    'Cropped'
  ];

  const typeForBags = [
    'Totes',
    'Shoulder Bags',
    'Crossbody',
    'Clutches',
    'Backpacks',
    'Top-Handle'
  ];

  const typeForJackets = [
    'Blazer',
    'Leather',
    'Quilted',
    'Trench',
    'Field',
    'Down'
  ];

const value = {
  hoveredProductId, setHoveredProductId,
  setAddedToFav, addedToFav,
  carouselPrevIconHovered, setCarouselPrevIconHovered 
  ,carouselNextIconHovered, setCarouselNextIconHovered,
  productData, setProductData,isLoading, setIsLoading,
  typeForShirts,
  typeForJumpers,
  typeForDresses,
  typeForTrousers,
  typeForBags,
  typeForJackets,
  handleCloseFilterPop,
  handleFilterByCat,
  filterBtn
}
  return (
    <WomenProductContext value={value}>{children}</WomenProductContext>
  )
}

export default WomenProductProvider