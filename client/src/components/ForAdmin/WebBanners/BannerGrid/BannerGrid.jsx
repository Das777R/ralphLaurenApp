import { Row, Col } from "react-bootstrap";
import { useBanners } from "../../../../context/admin/webbanner/BannerContext";
import BannerCard from "../BannerCard/BannerCard";

export default function BannerGrid() {
  const { visible } = useBanners();

  if (visible.length === 0) {
    return <div className="ui-card text-center text-muted py-5">No banners match your filters.</div>;
  }

  return (
    <Row className="g-3">
      {visible.map((b) => (
        <Col key={b.id} xs={12} md={6} xl={4}>
          <BannerCard banner={b} />
        </Col>
      ))}
    </Row>
  );
}