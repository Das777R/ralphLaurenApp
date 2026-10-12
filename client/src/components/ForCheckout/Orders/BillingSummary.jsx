function BillingSummary({ totalPrice, shippingPrice }) {
  return (
    <div className="w-lg-50 w-100 user-select-none">
      <div className="billing-order-title user-select-none">Billing Summary</div>
      <div className="d-flex justify-content-between item-total-order-billing">
        Items total: <span>₹ {Number(totalPrice)}</span>
      </div>
      <div className="d-flex justify-content-between shipping-order-billing">
        Shipping: <span>₹ {shippingPrice}</span>
      </div>
      <div className="d-flex justify-content-between fw-semibold total-order-billing">
        Total For Your Order: <span>₹ {Number(totalPrice) + shippingPrice}</span>
      </div>
      <div className="text-duties-taxes">
        The total amount you pay includes all applicable customs duties & taxes. We guarantee no additional charges on delivery.
      </div>
    </div>
  );
}

export default BillingSummary;