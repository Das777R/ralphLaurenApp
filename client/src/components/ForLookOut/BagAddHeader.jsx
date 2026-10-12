import './BagAddHead.css'

function BagAddHeader() {
  return (
    <div className="mt-5">
     <div className="d-flex gap-3">
       <div className="bag-head-img bg-primary">
        lorem100
        <img src="" alt="" className="w-100 h-100 object-fit-cover"/>
       </div>
       <div className="bag-head-info">
        <h3 className="bag-head-pn">lorem</h3>
        <p className="bag-head-price">$123</p>
       </div>
     </div>
    </div>
  )
}

export default BagAddHeader
