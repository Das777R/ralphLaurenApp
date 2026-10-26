import { Row, Col, Button } from "react-bootstrap";
import { useProductMedia } from "../../../../../context/admin/ProductMediaContext";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductGrid() {
  const { filtered, openUpload } = useProductMedia();

  if (!filtered.length) {
    return (
      <div className="ui-card text-center text-muted py-5">
        <div className="mb-3">No products match your filters.</div>
        <Button className="btn-ink" onClick={openUpload}>
          Add product
        </Button>
      </div>
    );
  }

  return (
    <Row className="g-3">
      {filtered.map((item) => (
        <Col key={item.id} xs={6} md={4} xl={3} xxl={2}>
          <ProductCard item={item} />
        </Col>
      ))}
    </Row>
  );
}