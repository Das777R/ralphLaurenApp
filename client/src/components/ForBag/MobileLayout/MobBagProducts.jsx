import { useParams, Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import api from "../../../api/api";
import { UIContext } from "../../../context/UIContext";

function MobBagProducts() {
  const { userId } = useParams();
  const { bagProducts, setBagProducts } = useContext(UIContext);

  const mergeBagItems = (items) => {
    const map = new Map();
    items.forEach((item) => {
      const key = `${item?.productId}-${item?.size}`;
      const qty = Number(item?.qty) || 1;
      if (map.has(key)) {
        const existing = map.get(key);
        existing.qty = Number(existing.qty) + qty;
      } else {
        map.set(key, { ...item, qty });
      }
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    const setItemForUserBag = async () => {
      const lsBag = JSON.parse(localStorage.getItem("bag")) || [];
      if (!userId) {
        setBagProducts(mergeBagItems(lsBag));
      } else {
        try {
          const res = await api.get(`/auth/${userId}`);
          const serverBag = res?.data?.data?.bag || [];
          setBagProducts(mergeBagItems(serverBag));
          localStorage.removeItem("bag");
        } catch (err) {
          console.log(err);
        }
      }
    };

    setItemForUserBag();
  }, [userId, setBagProducts]);

  const removeProductFromBag = async (productId, size) => {
    if (!userId) {
      const lsBag = JSON.parse(localStorage.getItem("bag")) || [];
      const filtLsBag = lsBag.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
      localStorage.setItem("bag", JSON.stringify(filtLsBag));
      setBagProducts(mergeBagItems(filtLsBag));
    } else {
      try {
        const res = await api.delete(`/auth/${userId}/bag/${productId}`, {
          data: { size },
        });
        const serverBag = res?.data?.data?.bag || [];
        setBagProducts(mergeBagItems(serverBag));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleQtyChange = async (pId, size, newQty) => {
    const numericQty = Number(newQty);

    setBagProducts((prevBag) =>
      prevBag.map((item) =>
        item.productId === pId && item.size === size
          ? { ...item, qty: numericQty }
          : item
      )
    );

    if (!userId) {
      const lsBag = JSON.parse(localStorage.getItem("bag")) || [];
      const updatedLsBag = lsBag.map((item) =>
        item.productId === pId && item.size === size
          ? { ...item, qty: numericQty }
          : item
      );
      localStorage.setItem("bag", JSON.stringify(updatedLsBag));
    } else {
      try {
        await api.put(`/auth/${userId}/${pId}`, {
          updatedQty: numericQty,
          size,
        });
      } catch (err) {
        console.log("Failed to update quantity on server", err);
      }
    }
  };

  if (!Array.isArray(bagProducts)) {
    return null;
  }

  return (
    <table className="table mt-5 user-select-none d-block d-lg-none">
      <thead>
        <tr className="text-uppercase head-bag-title">
          <th scope="col" className="text-nowrap">
            <p className="hb-title">shopping bag ({bagProducts.length})</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {bagProducts.map((bagProd) => {
          const lookPath = userId
            ? `/lookup/${bagProd?.productId}/${userId}`
            : `/lookup/${bagProd?.productId}`;
          const uniqueKey = `${bagProd?.productId}-${bagProd?.size}`;
          const price = Number(bagProd?.price) || 0;
          const qty = Number(bagProd?.qty) || 1;

          return (
            <tr key={uniqueKey}>
              <th scope="row">
                <div className="d-flex flex-column gap-4">
                  <div className="bag-product-img-con-mobile">
                    <Link to={lookPath} style={{ textDecoration: "inherit" }}>
                      <img
                        src={encodeURI(bagProd?.lookImage || "")}
                        alt={bagProd?.productName || ""}
                        className="w-100 h-100"
                      />
                    </Link>
                  </div>
                  <div className="d-flex flex-column">
                    <Link to={lookPath} style={{ textDecoration: "inherit" }}>
                      <h5 className="text-uppercase bg-product-title">
                        {bagProd?.productName}
                      </h5>
                    </Link>
                    <div className="text-capitalize d-flex flex-column gap-2 bag-features">
                      <div className="user-select-none">
                        Color: {bagProd?.colorName}
                      </div>
                      <div className="user-select-none">
                        Size: {bagProd?.size?.toUpperCase()}
                      </div>
                      <div className="user-select-none">Qty: {qty}</div>
                    </div>
                  </div>
                </div>

                <div className="fw-light mt-3 d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-3 fw-light">
                    <select
                      className="form-select select-qty"
                      aria-label="Select quantity"
                      value={qty}
                      onChange={(e) =>
                        handleQtyChange(
                          bagProd?.productId,
                          bagProd?.size,
                          e.target.value
                        )
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option value={num} key={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <span
                      className="w-25 d-flex justify-content-center align-items-center d-inline-block fs-4 user-select-none remove-product-from-bag"
                      onClick={() =>
                        removeProductFromBag(bagProd?.productId, bagProd?.size)
                      }
                    >
                      ✕
                    </span>
                  </div>
                  <div className="text-end">
                    <div>₹{price}</div>
                    {qty > 1 && (
                      <small className="text-secondary">Total ₹{price * qty}</small>
                    )}
                  </div>
                </div>
              </th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default MobBagProducts;