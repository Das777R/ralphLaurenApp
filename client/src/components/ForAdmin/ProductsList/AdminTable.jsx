import { useContext, useEffect } from "react";
import "./AdminTable.css";
import api from "../../../api/api";
import { UIContext } from "../../../context/UIContext";

function AdminTable() {
  const { productsData, setProductsData } = useContext(UIContext);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await api.get("/products");
        setProductsData(res.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    getProducts();
  }, []);

  return (
    <div className="table-responsive">
      <table className="table table-body align-middle mb-0 products-table">
        <thead>
          <tr>
            <th className="col-name ">
              Product Name <i className="bi bi-chevron-down"></i>
            </th>
            <th className="">
              Category <i className="bi bi-chevron-down"></i>
            </th>
            <th className="">Kind</th>
            <th className="">
              Price <i className="bi bi-chevron-down"></i>
            </th>
            <th className="">
              Stock <i className="bi bi-chevron-down"></i>
            </th>
            <th className="">Image</th>
          </tr>
        </thead>
        <tbody>
          {productsData?.map((product, index) => (
            <tr key={product._id || index}>
              <td className="col-name">
                <div className="d-flex align-items-center gap-2">

                  <span className="text-body">{product.productName}</span>
                </div>
              </td>
              <td>{product.category}</td>
              <td>{product.kind}</td>
              <td>₹ {product.price}</td>
              <td>{product.stock}</td>
              <td>
                <img
                  src={`/${encodeURI(product.lookImage)}`}
                  className="product-thumb"
                  alt=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;