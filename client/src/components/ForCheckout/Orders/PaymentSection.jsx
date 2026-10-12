function PaymentSection({ error, submitting, onPay }) {
  return (
    <div className="w-lg-50 w-100 d-flex flex-column gap-4">
      <div className="payment-order-title">Payment</div>
      <div className="paypal-logo-con user-select-none">
        <img src="/icons/PayPal_Logo.svg" alt="" className="w-100 h-100 object-fit-contain" />
      </div>

      <div className="paypal-payment-instruction-text user-select-none">
        After clicking "Pay with PayPal" a pop-up will appear asking you to log in to your PayPal account. Review your payment and shipping details to complete your purchase. You will be redirected to the "Ralph Lauren" Order Confirmation page afterwards.
      </div>

      <div className="order-payment-instruction-text user-select-none">
        By clicking on 'Pay and Place Order', you agree (i) to make your purchase from Global-e as merchant of record for this transaction, subject to Global-e's <span className="text-primary op-instruction-span"> Terms of Sale;</span> (ii) that your information will be handled by Global-e in accordance with the Global-e <span className="text-primary op-instruction-span">Privacy Policy;</span> and (iii) that Global-e will share your information (excluding the payment details) with Ralph Lauren.
      </div>

      {error && <div className="text-danger" style={{ fontSize: '14px' }}>{error}</div>}

      <button
        type="button"
        className="border-0 signin-btn text-center text-uppercase d-flex justify-content-center align-content-center p-3 w-100 mt-5"
        onClick={onPay}
        disabled={submitting}
      >
        {submitting ? 'placing order...' : 'pay with paypal'}
      </button>
    </div>
  );
}

export default PaymentSection;