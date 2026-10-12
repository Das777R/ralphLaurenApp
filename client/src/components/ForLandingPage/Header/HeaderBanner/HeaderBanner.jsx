import { useParams, Link } from 'react-router-dom';
import './HeaderBanner.css'
import { GiWorld } from "react-icons/gi";
import { IoMdPin } from "react-icons/io";

function HeaderBanner() {

    const {userId} = useParams();
    const homePath = userId ? `/${userId}` : '/';
    
return (
  <div className="header-banner d-flex text-white position-relative w-100 user-select-none">
      <div className="header-promotion">
        <div className="rlc-ticker-wrapper">
          <section className="rlc-slide d-flex gap-1">
            <p className="summer-sale-p text-capitalize">Free standard Delivery</p>
              |
            <p className="shop-now-a text-capitalize">
              <Link to={homePath}>
              <span className="d-block link-underline-white text-white">details</span>
              </Link>
            </p>
          </section>
        </div>
      </div>

      <div className="utility-nav d-none d-lg-flex">
        <div className="country-selector-wrapper desktop-only d-flex">
      
        <GiWorld className='mt-0 fs-6'/>
        <p className="english-country">IN English</p>
        </div>
        <div className="stores desktop-only d-flex">
       
        <IoMdPin className='mt-0 fs-6'/>

        <p className="find-a-store-p">Find a store</p>
      </div>
    </div>
  </div>
  )
}

export default HeaderBanner
