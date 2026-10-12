import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import {UIContext} from '../../../context/UIContext';


function MobBagCost() {
  const {userId} = useParams();

  const {bagProducts, totalPrice} = useContext(UIContext);
  const bagSubmitPath = userId ? `/bagSubmit/${userId}` : '/bagSubmit';

  return (
    <div className={`proceed-outer user-select-none d-flex flex-column justify-content-end align-items-end p-0 ${bagProducts.length === 0 ? 'd-lg-none' : 'd-block'} d-block d-lg-none`}>
      <div className=" bg-body p-3 w-100 bg-dark">
        <div className="sub-total-outer d-flex flex-column">
        <h4 className="text-uppercase price-info">subtotal <span className="price-num">₹{Number(totalPrice)}</span></h4>
        <h4 className="text-uppercase  price-info">estimated total <span className="price-num">₹{Number(totalPrice)}</span>
        </h4>
        </div>
        <Link to={bagSubmitPath} style={{textDecoration:"none"}}>
        <div className="proceed-btn text-uppercase text-white text-center text-nowrap">proceed to checkout</div>
        </Link>
      </div>
    </div>
  )
}

export default MobBagCost
