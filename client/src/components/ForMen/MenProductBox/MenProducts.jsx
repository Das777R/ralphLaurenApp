import { useContext, useState,useEffect } from "react";
import { UIContext } from "../../../context/UIContext";
import { useParams} from "react-router-dom"; 
import api from "../../../api/api";
import ProductCard from "../../Shared/ProductCard/ProductCard";

function MenProducts() {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const { setAddedToFav, addedToFav} = useContext(UIContext);
  const [productData, setProductData] = useState([]);



  useEffect(() => {
    const getItemForGuestFav = async () => {
      if (addedToFav.length === 0) {
        setProductData([]);
        setIsLoading(false);
        return;
      }

      try {
        const result = await api.get("/products/guestBag", {
          params: { products: addedToFav },
          paramsSerializer: { indexes: null },
        });

        const uniqueProducts = Array.from(
          result.data.data
            .reduce((map, item) => {
              const productName = item.productName;

              if (!map.has(productName)) {
                map.set(productName, {
                  ...item,
                  availableColors: item.colorImage ? [item.colorImage] : [],
                });
              } else {
                const existing = map.get(productName);
                if (
                  item.colorImage &&
                  !existing.availableColors.includes(item.colorImage)
                ) {
                  existing.availableColors.push(item.colorImage);
                }
              }
              return map;
            }, new Map())
            .values()
        );

        setProductData(uniqueProducts);
      } catch (err) {
        console.error("Failed to fetch guest favorites:", err);
        setProductData([]);
      } finally {
        setIsLoading(false);
      }
    };
    getItemForGuestFav();
  }, [addedToFav, setProductData]);

  const selectVariant = async (clrImg, product) => {
    try {
      const res = await api.get("/products/productByColor", {
        params: { clrImg, product },
      });

      const newItem = res.data.data;

      setProductData((prev) =>
        prev.map((item) =>
          item.productName === newItem.productName
            ? { ...newItem, availableColors: item.availableColors }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to change variant:", err);
    }
  };

  const addToFav = (product) => {
    setAddedToFav((prev) => [...prev, product]);

    if (!userId) {
      const current = JSON.parse(localStorage.getItem("fav")) || [];
      localStorage.setItem("fav", JSON.stringify([...current, product]));
    }
  };

  const removeFromFav = (product) => {
    const current = JSON.parse(localStorage.getItem("fav")) || [];
    const updated = current.filter((x) => x !== product);
    localStorage.setItem("fav", JSON.stringify(updated));
    setAddedToFav(updated);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex w-100 justify-content-center align-items-center"
        style={{ height: "20rem" }}
      >
        <div
          className="spinner-grow text-dark"
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        />
      </div>
    );
  }

  if (productData.length === 0) {
    return (
      <div className="d-flex w-100 justify-content-center py-5">
        <p className="text-uppercase">No favourites yet</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap justify-content-center fav-products-container">
      {productData.map((data, index) => (
        <ProductCard
          key={data._id || index}
          data={data}
          userId={userId}
          addedToFav={() => addedToFav(data?.product)}
          selectVariant={() => selectVariant(data.clrImg, data.product)}
          addToFav={() => addToFav(data._id)}
          removeFromFav={() => removeFromFav(data?.product)}
        />
      ))}
    </div>
  );
}

export default MenProducts;