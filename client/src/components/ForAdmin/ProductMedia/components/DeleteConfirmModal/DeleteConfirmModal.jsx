import { Modal, Button } from "react-bootstrap";
import { useProductMedia } from "../../../../../context/admin/ProductMediaContext";

export default function DeleteConfirmModal() {
  const { confirmIds, setConfirmIds, removeItems } = useProductMedia();

  return (
    <Modal show={!!confirmIds} onHide={() => setConfirmIds(null)} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-5">Delete product?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="small">
        {confirmIds?.length === 1 ? "This variant" : `These ${confirmIds?.length} variants`} will be
        removed. This can&apos;t be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setConfirmIds(null)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => removeItems(confirmIds)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}