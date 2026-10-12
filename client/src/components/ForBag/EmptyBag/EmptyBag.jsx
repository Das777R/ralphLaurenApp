import { useParams,Link  } from "react-router-dom";

function EmptyBag() {
  const {userId} = useParams();
  const homePath = userId ? `/${userId}`: '/';

return (
<div className="d-flex  justify-content-center align-items-center vw-100 vh-100 user-select-none">
  <div className="shop-cart-title text-uppercase text-center user-select-none">
    Your shopping cart is empty
    <Link to={homePath} style={{textDecoration: "inherit"}}>
    <span className="d-block continue-shopping-link">&#60;&#60; continue shopping</span>
    </Link>
  </div>
</div>
  )
}

export default EmptyBag
