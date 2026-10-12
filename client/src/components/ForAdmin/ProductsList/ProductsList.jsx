import AdminTable from "./AdminTable"
import CardHeader from "./CardHeader"
import './ProductsList.css'



function ProductsList() {

  return (  
    <section className="p-4 bg-body vh-100 position-relative products-list-page">
    <div className="card border rounded-1">
      <CardHeader/>
     <AdminTable />
    </div>
    </section> 
  )
}

export default ProductsList