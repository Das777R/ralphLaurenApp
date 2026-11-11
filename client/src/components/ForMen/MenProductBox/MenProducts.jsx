import { useContext, useState, useEffect } from "react";
import { UIContext } from "../../../context/UIContext";
import { useParams } from "react-router-dom";
import api from "../../../api/api";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import { useMenContext } from "../../../context/men/MenProductContext";

function MenProducts() {
  const { userId, category } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { setAddedToFav, addedToFav } = useContext(UIContext);
  // const [productData, setProductData] = useState([]);
  const {productData, setProductData} = useMenContext()
 
  useEffect(() => {
    const getProducts = async () => {
      try {
        const result = await api.get(
          `/product/men/${category}`
        );

        const uniqueProducts = Array.from(
          (result?.data?.data || [])
            .reduce((map, item) => {
              const productName = item?.productName;

              if (!map.has(productName)) {
                map.set(productName, {
                  ...item,
                  availableColors: item?.colorImage ? [item.colorImage] : [],
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
        console.error("Failed to fetch men's products:", err);
        setProductData([]);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);


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


  const addToFav = (productName) => {
    if (addedToFav?.includes(productName)) return;

    setAddedToFav((prev) => [...(prev || []), productName]);

    if (!userId) {
      const current = JSON.parse(localStorage.getItem("fav")) || [];
      if (!current.includes(productName)) {
        localStorage.setItem("fav", JSON.stringify([...current, productName]));
      }
    }
  };

  
  const removeFromFav = (productName) => {
    setAddedToFav((prev) => (prev || []).filter((x) => x !== productName));

    if (!userId) {
      const current = JSON.parse(localStorage.getItem("fav")) || [];
      localStorage.setItem(
        "fav",
        JSON.stringify(current.filter((x) => x !== productName))
      );
    }
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
        <p className="text-uppercase">Products are out of stock...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap justify-content-center fav-products-container">
      {productData.map((data) => (
        <ProductCard
          key={data.productName}
          data={data}
          userId={userId}
          addedToFav={addedToFav}
          selectVariant={selectVariant}
          addToFav={addToFav}
          removeFromFav={removeFromFav}
        />
      ))}
    </div>
  );
}

export default MenProducts;