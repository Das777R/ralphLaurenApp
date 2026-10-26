import { Button, Modal } from "react-bootstrap";
import { useBanners } from "../../../../context/admin/webbanner/BannerContext";

export default function DeleteConfirmModal() {
  const { deleting, setDeleting, confirmDelete } = useBanners();

  return (
    <Modal show={!!deleting} onHide={() => setDeleting(null)} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-5">Delete banner?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="small">
        <strong>{deleting?.title}</strong> will be removed from your storefront. This can&apos;t be
        undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setDeleting(null)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirmDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}