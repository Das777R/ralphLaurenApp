import { useState,useContext} from "react";
import { UIContext } from "../UIContext";
import { MenProductContext } from "./MenProductContext";
import api from '../../api/api'

function MenProductProvider({children}) {

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
        `/products/filter/men/${kind}`,
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

  const typeForCasualShirts = [
    'Oxford',
    'Poplin',
    'Featherweight Mesh',
    'Corduroy',
    'Denim'
  ];

  const typeForPoloShirts = [
    'Classic Fit',
    'Custom Slim Fit',
    'Tailored Fit',
    'Oversized Fit',
    'Relaxed Fit',
    'Slim Fit'
  ];

  const typeForJumpers = [
    'Quarter-Zip',
    'Crewneck',
    'Cable-Knit',
    'Polo-Collar',
    'V-Neck',
    'Cardigan'
  ];

  const typeForjackets = [
    'Harrington',
    'Leather',
    'Field',
    'Quilted',
    'Down',
    'Water-Repellent'
  ];

  const typeShorts = [
    'Classic Fit',
    'Straight Fit',
    'Tailored Fit'
  ];

  const typeAccessories = [
    'Cap',
    'Socks',
    'Belts',
    'Bags',
    'Scarves',
    'Hats'
  ];

const value = {
  hoveredProductId, setHoveredProductId,
  setAddedToFav, addedToFav,carouselPrevIconHovered, setCarouselPrevIconHovered 
  ,carouselNextIconHovered, setCarouselNextIconHovered,productData, setProductData,isLoading, setIsLoading,
  typeForCasualShirts,
  typeForPoloShirts,
  typeForJumpers,
  typeForjackets,
  typeShorts,
  typeAccessories,
  handleCloseFilterPop,
  handleFilterByCat,
  filterBtn
}
  return (
    <MenProductContext value={value}>{children}</MenProductContext>
  )
}

export default MenProductProvider