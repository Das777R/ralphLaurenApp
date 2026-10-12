import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { UIContext } from "../UIContext";
import { formatImgSrc, normalizeSizes } from "./LookHelpers";
import { LookProductContext } from "./LookProductContext";

function LookProductProvider({ children }) {
  const [addedToBag, setAddedToBag] = useState(false);
  const [canvasData, setCanvasData] = useState({});
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [offCanavasRecommendData, setOffCanvasRecommendData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sizeNotSelectForLook, setsizeNotSelectForLookForLook] = useState(false);
  
  const [lookSize, setLookSize] = useState(null);
  const [recommendSize, setRecommendSize] = useState(null);

  const [availableColor, setAvailableColor] = useState([]);
  const { setBagLength, bagLength } = useContext(UIContext);

  const [compleProductsData, setCompleteProductsData] = useState([]);

  const { productId, userId } = useParams();

  const [productLook, setProductsLook] = useState({
    section: "",
    category: "",
    brand: "Polo Ralph Lauren",
    productName: "",
    qty: 1,
    price: "",
    sizesAvailable: [],
    description: "",
    trending: false,
    slideImage: [],
    lookImage: "",
    colorImage: "",
    color: "",
  });



  useEffect(() => {
    const setItemForUserBag = async () => {
      if (!userId) {
        const lsbag = JSON.parse(localStorage.getItem("bag")) || [];
        setBagLength(lsbag.length);
      } else {
        try {
          const res = await api.get(`/auth/${userId}`);
          const serverBag = res.data?.data?.bag || [];
          setBagLength(serverBag.length);
          localStorage.removeItem("bag");
        } catch (err) {
          console.error("Failed to fetch user bag:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    setItemForUserBag();
  }, [userId, setBagLength]);

  useEffect(() => {
    const getAvailableColors = async () => {
      
      if (!productLook.productName) return;

      try {
        const res = await api.get(`/products/getproductByName`, {
          params: { productName: productLook.productName },
        });

        const colors = (res.data?.data || [])
          .map((item) => item.colorImage)
          .filter(Boolean);

        setAvailableColor([...new Set(colors)]);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getAvailableColors();
  }, [productLook.productName]);

  useEffect(() => {
    async function getSimilarProducts() {
      try {
        const res = await api.get(
          `/products/${productLook.category}/${productLook.kind}`
        );
        const load = res?.data?.data || [];
        const randomTen = [...load].sort(() => 0.5 - Math.random()).slice(0, 10);
        setRecommendProducts(randomTen);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (productLook.category && productLook.kind) {
      getSimilarProducts();
    }
  }, [productLook.category, productLook.kind]);

  useEffect(() => {
    async function getDataForMatch() {
      try {
        const matchValues =
          productLook.kind === "Casual Shirts"
            ? ["Polo Shirts", "Casual Shirts"]
            : ["Accessories", "Jackets&Coats"];
        const res = await api.get(
          `/products/lookup/match/${productLook.category}`,
          { params: { match: matchValues.join(",") } }
        );

        const load = res.data.data || [];
        const randomThree = [...load].sort(() => 0.5 - Math.random()).slice(0, 3);
        setCompleteProductsData(randomThree);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    getDataForMatch();
  }, [productLook.category, productLook.kind]);

  const selectSizeForLook = (size) => setLookSize(size);
  const selectSizeForCanvas = (size) => setRecommendSize(size);




  const getProductByName = async (name) => {
    if (!name) return;
    try {
      const res = await api.get(`/products/getproductByName`, {
        params: { productName: name },
      });
      const data = res.data?.data || [];

      if (data.length > 0) {
        const uniqueColors = [
          ...new Set(data.map((item) => item.colorImage).filter(Boolean)),
        ];
        const aggregatedProduct = {
          ...data[0],
          availableColors: uniqueColors,
          sizesAvailable: [
            ...new Set(data.flatMap((item) => normalizeSizes(item.sizesAvailable))),
          ],
        };

        setOffCanvasRecommendData(aggregatedProduct);
      }
    } catch (err) {
      console.error("Error Message:", err.message);
    }
  };

  const getProductByColor = async (clr) => {
    try {
      const res = await api.get(`/products/getProductByClr`, {
        params: {
          colorImg: clr,
          product: productLook.productName,
        },
      });

      if (res.data?.data) {
        setProductsLook(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const availableSizes = normalizeSizes(productLook.sizesAvailable);
  const recommendAvailableSizes = normalizeSizes(
    offCanavasRecommendData?.sizesAvailable
  );

  

  
  const handleAddToBag = async (id, size) => {
    try {
      if (!size) {
        window.scrollTo({top: 0, behavior:"smooth"});
        return setsizeNotSelectForLookForLook(true);
      } 



      setsizeNotSelectForLookForLook(false);
      
      const res = await api.get(`/products/${id}`);
      const productInfo = res.data.data;

      const newItem = {
        productId: productInfo._id,
        lookImage: productInfo.lookImage,
        productName: productInfo.productName,
        qty: 1,
        brand: productInfo.brand,
        colorImage: productInfo?.colorImage,
        colorName: productInfo.colorName,
        size,
        price: productInfo.price,
      };

      if (!userId) {
        const existingBag = JSON.parse(localStorage.getItem("bag")) || [];
        const existingIndex = existingBag.findIndex(
          (item) =>
            item.productId === newItem.productId && item.size === newItem.size
        );

        let updatedBag;
        if (existingIndex > -1) {
          updatedBag = [...existingBag];
          updatedBag[existingIndex].qty =
            Number(updatedBag[existingIndex].qty || 1) + 1;
        } else {
          updatedBag = [...existingBag, newItem];
        }

        setBagLength(updatedBag.length);
        localStorage.setItem("bag", JSON.stringify(updatedBag));
        setCanvasData(newItem);
        setAddedToBag(true);
        setTimeout(() => setAddedToBag(false), 1000);
      } else {
        const resUser = await api.get(`/auth/${userId}`);
        const serverBag = resUser.data?.data?.bag || [];

        const existingIndex = serverBag.findIndex(
          (item) =>
            item.productId === newItem.productId && item.size === newItem.size
        );

        let updatedUserBag;
        if (existingIndex > -1) {
          updatedUserBag = [...serverBag];
          updatedUserBag[existingIndex].qty =
            Number(updatedUserBag[existingIndex].qty || 1) + 1;
        } else {
          updatedUserBag = [newItem, ...serverBag];
        }

        await api.put(`/auth/${userId}`, { userBag: updatedUserBag });
        setBagLength(updatedUserBag.length);
        setCanvasData(newItem);
        setAddedToBag(true);
        setTimeout(() => setAddedToBag(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const bag = userId ? `/bag/${userId}` : "/bag";
  const homePath = userId ? `/${userId}` : "/";

  const value = {
    userId,
    bag,
    homePath,
    productLook,
    availableColor,
    recommendProducts,
    offCanavasRecommendData,
    compleProductsData,
    canvasData,
    isLoading,
    addedToBag,
    availableSizes,
    recommendAvailableSizes,
    lookSize,
    recommendSize,
    getProductByColor,
    getProductByName,
    handleAddToBag,
    bagLength,
    productId,
    selectSizeForCanvas,
    selectSizeForLook,
    setProductsLook,
    setIsLoading,
    formatImgSrc,
    sizeNotSelectForLook,
    
  };

  return <LookProductContext value={value}>{children}</LookProductContext>;
}

export default LookProductProvider;