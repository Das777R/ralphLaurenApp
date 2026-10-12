import { useParams,Link } from "react-router-dom";

function BagHero() {

  
  const {userId} = useParams();

  const bagSubmitPath = userId ? `/bagSubmit/${userId}` : '/bagSubmit';
  const homePath = userId ? `/${userId}`: '/';
  
  return (
  <div className="checkout-outer w-100 d-flex justify-content-between">
    <div className="checkout-btn-outer w-100">
      <Link to={bagSubmitPath} style={{textDecoration: "none"}}>
      <div className="checkout-btn text-uppercase text-white text-nowrap d-flex justify-content-center align-items-center d-none d-lg-block">proceed to checkout</div>
      </Link>

        <Link to={bagSubmitPath} style={{textDecoration: "none"}}>
      <div className="checkout-btn text-uppercase text-white text-nowrap d-flex justify-content-center align-items-center d-lg-none d-block w-100">proceed to checkout</div>
      </Link>
      <Link to={homePath}>
      <div className="text-uppercase font-monospace text-decoration-underline continue-shop-text mt-3 d-flex d-lg-block w-100 justify-content-center">
        continue shopping
      </div>
      </Link>
    </div>

    <div className="bag-policy-outer text-uppercase d-none d-lg-block">
      <h4>need assistance? <span className="bag-email-us-text">email us</span></h4>
      <h4>all transactions are safe and secure. <span className="bag-security-text">security policy</span></h4>
    </div>
  </div>
  )
}

export default BagHero
