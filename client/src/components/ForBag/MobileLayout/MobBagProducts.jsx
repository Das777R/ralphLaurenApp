import { useParams, Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import api from "../../../api/api";
import { UIContext } from '../../../context/UIContext';

function MobBagProducts() {
  const { userId } = useParams();
  
  const { bagProducts, setBagProducts } = useContext(UIContext);
  const [qtyChanged, setQtyChanged] = useState(1);
  const [itemId, setItemId] = useState('');

  useEffect(() => {
    const setItemForUserBag = async () => {
      const lsBag = JSON.parse(localStorage.getItem('bag')) || [];
      if (!userId) {
        setBagProducts(lsBag.map((p) => ({ ...p, qty: p.qty || 1 })));
      } else {
        try {
          const res = await api.get(`/auth/${userId}`);
          const serverBag = res.data.data.bag || [];
          setBagProducts(serverBag);
          localStorage.removeItem('bag');
        } catch (err) {
          console.log(err);
        }
      }
    };

    setItemForUserBag();
  }, [userId, setBagProducts]);

  useEffect(() => {
    const updateBagForQty = async () => {
      if (userId && itemId) {
        try {
          await api.put(`/auth/${userId}/${itemId}`, { updatedQty: qtyChanged });
          } catch (err) {
          console.log(err);
        }
      }
    };

    updateBagForQty();
  }, [qtyChanged, itemId, userId]);

  const removeProductFromBag = async (id) => {
    if (!userId) {
      const lsBag = JSON.parse(localStorage.getItem('bag')) || [];
      const filtLsBag = lsBag.filter((item) => item.productId !== id);
      localStorage.setItem('bag', JSON.stringify(filtLsBag));
      setBagProducts(filtLsBag);
    } else {
      try {
        const res = await api.delete(`/auth/${userId}/bag/${id}`);
        const serverBag = res.data.data.bag || [];
        setBagProducts(serverBag);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleQtyChange = (pId, newQty) => {
    setQtyChanged(newQty);
    setItemId(pId);

    setBagProducts(prevBag => 
      prevBag.map(item => 
        item.productId === pId ? { ...item, qty: Number(newQty) } : item
      )
    );
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
          <th scope="col" className="text-nowrap text-secondary hb-title d-none">
            <p className="hb-title">qty</p>
          </th>
          <th scope="col" className="text-nowrap hb-title d-none">
            <p className="hb-title">price</p>
          </th>
          <th scope="col" className="text-nowrap hb-title d-none">
            <p className="hb-title">total</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {bagProducts.map((bagProd, index) => {
          const lookPath = userId ? `/lookup/${bagProd.productId}/${userId}` : `/lookup/${bagProd.productId}`;
          const uniqueRowKey = `${bagProd.productId || 'item'}-${bagProd.size || 'nosize'}-${bagProd.color || 'nocolor'}-${index}`;

          return (
            <tr className="" key={uniqueRowKey}>
              <th scope="row">
                <div className="d-flex flex-column gap-4">
                  <div className="bag-product-img-con-mobile">
                    <Link to={lookPath} style={{ textDecoration: 'inherit' }}>
                      <img src={`/${encodeURI(bagProd.lookImage || '')}`} alt="" className="w-100 h-100" />
                    </Link>
                  </div>
                  <div className="d-flex flex-column">
                    <Link to={lookPath} style={{ textDecoration: 'inherit' }}>
                      <h5 className="text-uppercase bg-product-title">{bagProd.product}</h5>
                    </Link>
                    <div className="text-capitalize d-flex flex-column gap-2 bag-features">
                      <div className="user-select-none">
                        Color: {bagProd.color}
                      </div>
                      <div className="user-select-none">
                        Size: {bagProd?.size?.toUpperCase()}
                      </div>
                      <div className="user-select-none">
                        qty: {bagProd.qty}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fw-light mt-3 d-flex justify-content-between mb-4">
                  <div className="d-flex gap-3 fw-light">
                    <select 
                      className="form-select select-qty" 
                      aria-label="select example"
                      value={bagProd.qty}
                      onChange={(e) => handleQtyChange(bagProd.productId, e.target.value)}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map((num, idx) => (
                        <option value={num} key={idx}>{num}</option>  
                      ))}
                    </select>
                    <span 
                      className="w-25 d-flex justify-content-center align-items-center d-inline-block fs-4 user-select-none remove-product-from-bag" 
                      onClick={() => removeProductFromBag(bagProd.productId)}
                    >
                      ✕
                    </span>  
                  </div>
                  <div className="">₹{Number(bagProd.price || 0)}</div>
                </div>
              </th>
              <td className="d-none"></td>
              <td className="d-none"></td>
              <td className="d-none"></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default MobBagProducts;