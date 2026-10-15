import { Table, Form } from "react-bootstrap";
import { useProductMedia } from "../ProductMediaContext";
import "./ProductList.css";

export default function ProductList() {
  const {
    filtered,
    selected,
    allSelected,
    toggleAll,
    toggleOne,
    setPreviewId,
  } = useProductMedia();

  return (
    <div className="ui-card">
      <div className="table-responsive">
        <Table hover className="ui-table" style={{ minWidth: 720 }}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Form.Check checked={allSelected} onChange={toggleAll} aria-label="Select all" />
              </th>
              <th>Product</th>
              <th>Color</th>
              <th className="d-none d-md-table-cell">Kind</th>
              <th className="d-none d-md-table-cell">Category</th>
              <th className="d-none d-lg-table-cell">Sizes</th>
              <th className="d-none d-sm-table-cell">Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id}>
                <td>
                  <Form.Check
                    checked={selected.has(i.id)}
                    onChange={() => toggleOne(i.id)}
                    aria-label={`Select ${i.productName}`}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none product-box-name-text"
                    onClick={() => setPreviewId(i.id)}
                  >
                    {i.productName}
                  </button>
                </td>
                <td className="product-color-label">{i.colorName}</td>
                <td className="d-none d-md-table-cell text-capitalize">{i.kind}</td>
                <td className="d-none d-md-table-cell text-capitalize">{i.category}</td>
                <td className="d-none d-lg-table-cell">{i.sizes?.join(", ")}</td>
                <td className="d-none d-sm-table-cell product-box-price">
                  {i.price ? `₹ ${i.price}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}