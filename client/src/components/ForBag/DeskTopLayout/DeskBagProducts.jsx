import { useParams, Link } from "react-router-dom";
import { useEffect, useContext} from "react";
import api from "../../../api/api";
import { UIContext } from '../../../context/UIContext';

function DeskBagProducts() {
const { userId } = useParams();

const { bagProducts, setBagProducts } = useContext(UIContext);


const mergeBagItems = (items) => {
const map = new Map();
items.forEach(item => {
const key = `${item.productId}-${item?.size}`;
if (map.has(key)) {
const existing = map.get(key);
existing.qty = Number(existing?.qty) + Number(item?.qty);
} else {
map.set(key, { ...item, qty: Number(item?.qty) });
}
});
return Array.from(map.values());
};

useEffect(() => {
const setItemForUserBag = async () => {
const lsBag = JSON.parse(localStorage.getItem('bag')) || [];
if (!userId) {
setBagProducts(mergeBagItems(lsBag));
} else {
try {
  const res = await api.get(`/auth/${userId}`);
  const serverBag = res.data.data.bag || [];
  setBagProducts(mergeBagItems(serverBag));
  localStorage.removeItem('bag');
} catch (err) {
  console.log(err);
}
}
};

setItemForUserBag();
}, [userId, setBagProducts]);


const removeProductFromBag = async (productId, size) => {
if (!userId) {
const lsBag = JSON.parse(localStorage.getItem('bag')) || [];
const filtLsBag = lsBag.filter(
(item) => !(item.productId === productId && item.size === size)
);
localStorage.setItem('bag', JSON.stringify(filtLsBag));
setBagProducts(filtLsBag);
} else {
try {
const res = await api.delete(`/auth/${userId}/bag/${productId}`, { data: { size } });
const serverBag = res.data.data.bag || [];
setBagProducts(mergeBagItems(serverBag));
} catch (err) {
console.log(err);
}
}
};


const handleQtyChange = async (pId, size, newQty) => {
const numericQty = Number(newQty);

setBagProducts(prevBag => 
prevBag.map(item => 
item.productId === pId && item.size === size 
  ? { ...item, qty: numericQty } 
  : item
)
);

if (!userId) {
const lsBag = JSON.parse(localStorage.getItem('bag')) || [];
const updatedLsBag = lsBag.map(item => 
item.productId === pId && item.size === size 
  ? { ...item, qty: numericQty } 
  : item
);
localStorage.setItem("bag", JSON.stringify(updatedLsBag));
} else {
try {
await api.put(`/auth/${userId}/${pId}`, { updatedQty: numericQty, size });

} catch (err) {
console.log("Failed to update quantity on server", err);
}
}
};

if (!Array.isArray(bagProducts)) {
return null; 
}

return (
<table className="table mt-5 user-select-none d-none d-lg-table p-2">
<thead>
<tr className="text-uppercase head-bag-title">
  <th scope="col" className="text-nowrap">
    <p className="hb-title">shopping bag ({bagProducts.length})</p>
  </th>
  <th scope="col" className="text-nowrap text-secondary hb-title">
    <p className="hb-title">qty</p>
  </th>
  <th scope="col" className="text-nowrap hb-title">
    <p className="hb-title">price</p>
  </th>
  <th scope="col" className="text-nowrap hb-title">
    <p className="hb-title">total</p>
  </th>
</tr>
</thead>
<tbody>
{bagProducts.map((bagProd) => {
  const lookPath = userId ? `/lookup/${bagProd?.productId}/${userId}` : `/lookup/${bagProd?.productId}`;
  const uniqueKey = `${bagProd?.productId}-${bagProd?.size}`;

  return (
    <tr className="bg-primary" key={uniqueKey}>
      <th scope="row">
        <div className="d-flex gap-4">
          <div className="bag-product-img-con">
            <Link to={lookPath} style={{ textDecoration: 'inherit' }}>
              <img src={`/${encodeURI(bagProd?.lookImage || '')}`} alt="" className="w-100 h-100" />
            </Link>
          </div>
          <div className="d-flex flex-column">
            <Link to={lookPath} style={{ textDecoration: 'inherit' }}>
              <h5 className="text-uppercase bg-product-title">{bagProd?.productName}</h5>
            </Link>
            <div className="text-capitalize d-flex flex-column gap-2 bag-features">
              <div className="user-select-none">
                Color: {bagProd?.colorName}
              </div>
              <div className="user-select-none">
                size: {bagProd?.size?.toUpperCase()} 
              </div>
              <div className="user-select-none">
                qty: {bagProd?.qty}
              </div>
            </div>
          </div>
        </div>
      </th>
      <td>
        <div className="d-flex flex-column">
          <select 
            className="form-select select-qty" 
            aria-label="select example"
            value={bagProd.qty}
            onChange={(e) => handleQtyChange(bagProd?.productId, bagProd?.size, e.target.value)}
          >
            {[1,2,3,4,5,6,7,8,9,10].map((num, idx) => (
              <option value={num} key={idx}>{num}</option>  
            ))}
          </select>
          <span 
            className="w-25 d-flex justify-content-center align-items-center mt-3 d-inline-block fs-4 user-select-none remove-product-from-bag" 
            onClick={() => removeProductFromBag(bagProd?.productId, bagProd?.size)}
          >
            ✕
          </span>  
        </div>
      </td>
      <td>
        <div>₹{Number(bagProd?.price)}</div>
      </td>
      <td>₹{Number(bagProd?.qty) * Number(bagProd?.price)}</td>
    </tr>
  );
})}
</tbody>
</table>
);
}

export default DeskBagProducts;