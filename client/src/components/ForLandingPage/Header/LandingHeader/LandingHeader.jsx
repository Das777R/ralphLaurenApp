import HeaderBanner from "./Header/HeaderBanner/HeaderBanner"
import HeaderMain from "../HeaderMain/HeaderMain"

function LandingHeader() {

  return (
      <div className="header-banner-container position-relative">
       <HeaderBanner/>
       <HeaderMain/>
      </div>
  
  )
}

export default LandingHeader
