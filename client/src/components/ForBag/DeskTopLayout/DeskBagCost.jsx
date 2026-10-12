import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import {UIContext} from '../../../context/UIContext';

function DeskBagCost() {
  
  const {userId} = useParams();

  const {bagProducts, totalPrice} = useContext(UIContext);
  const bagSubmitPath = userId ? `/bagSubmit/${userId}` : '/bagSubmit';
return (
<>
  {bagProducts.length !== 0 && (
  <div className="proceed-outer user-select-none d-none d-lg-flex justify-content-end align-items-end p-5">
  <div className=" bg-body p-3 w-50">
  <div className="sub-total-outer d-flex flex-column">
  <h4 className="text-uppercase price-info">subtotal <span className="price-num">₹{Number(totalPrice)}</span></h4>
  <h4 className="text-uppercase  price-info">estimated total <span className="price-num">₹{Number(totalPrice)}</span>
  </h4>
  </div>
  <Link to={bagSubmitPath} style={{textDecoration:"none"}}>
  <div className="proceed-btn text-uppercase text-white text-center">proceed to checkout</div>
  </Link>
  </div>
  </div>
  )}
</>
  )
}

export default DeskBagCost
