function ThankYouModal({ deliveredOn, onContinue }) {
  return (
    <div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header justify-content-center">
              <h1 className="modal-title fs-5">Thank you for your order!</h1>
            </div>
            <div className="modal-body">
              Your order will be delivered on <strong>{deliveredOn}</strong>.
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-primary" onClick={onContinue}>
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
}

export default ThankYouModal;