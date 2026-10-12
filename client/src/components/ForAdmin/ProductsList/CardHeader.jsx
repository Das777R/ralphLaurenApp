
import UploadProduct from '../UploadProductModel/UploadProduct'

function CardHeader() {
  return (
    <div className="card-header bg-body border-0 d-flex flex-wrap align-items-center justify-content-between gap-3 p-3">
    <h2 className=" fs-4 fw-medium mb-0 text-uppercase fw-bold admin-ralph-logo font-monospace text-body">Products list</h2>
    <div className="d-flex align-items-center gap-2">

    <button className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    <i className="fa-solid fa-plus"></i>Add Product
    </button>
    <UploadProduct/>
    </div>
    </div>
  )
}

export default CardHeader
