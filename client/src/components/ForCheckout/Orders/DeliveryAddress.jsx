function DeliveryAddress() {
  return (
    <div className="w-lg-50 w-100">
      <div className="delivery-address-title text-start">Delivery Address</div>
      <div className="form-check user-select-none">
        <input className="form-check-input" type="checkbox" value="" id="checkDefault" />
        <label className="form-check-label default-ba-text" htmlFor="checkDefault">
          Default (same as billing address)
        </label>
      </div>
    </div>
  );
}

export default DeliveryAddress;