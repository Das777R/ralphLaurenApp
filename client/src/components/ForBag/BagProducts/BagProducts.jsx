import { useParams } from "react-router-dom";
import { useEffect, useContext } from "react";
import api from "../../../api/api.js";
import { UIContext } from "../../../context/UIContext.jsx";
import EmptyBag from '../EmptyBag/EmptyBag.jsx'
import DeskBagProducts from '../DeskTopLayout/DeskBagProducts.jsx'
import DeskBagCost from "../DeskTopLayout/DeskBagCost.jsx";
import MobBagProducts from '../MobileLayout/MobBagProducts.jsx';
import MobBagCost from '../MobileLayout/MobBagCost.jsx';
import BagHero from "../BagHero/BagHero.jsx";


function BagProducts() {
  const { userId } = useParams();
  const { bagProducts, setBagProducts,setBagLength } = useContext(UIContext);

  useEffect(() => {
    const setItemForUserBag = async () => {
      const lsBag = JSON.parse(localStorage.getItem("bag")) || [];

      if (!userId) {
        setBagProducts(lsBag.map((p) => ({ ...p, qty: p.qty})));
      } else {
        try {
          const res = await api.get(`/auth/${userId}`);
          const serverBag = res.data?.data?.bag || [];
        
          setBagProducts(serverBag);
          setBagLength(serverBag.length);
          localStorage.removeItem("bag");
        } catch (err) {
          console.error("Failed to fetch user bag:", err);
        }
      }
    };

    setItemForUserBag();
  }, [userId, setBagProducts]);

  return (
    <div className="w-100">
      {bagProducts.length === 0 ? (
        <EmptyBag />
      ) : (
        <div className="bag-outer p-2 p-lg-5 user-select-none">
          <BagHero />
          <DeskBagProducts />
          <MobBagProducts />
        </div>
      )}
      <MobBagCost />
      <DeskBagCost />
    </div>
  );
}

export default BagProducts;