import { useState } from 'react';
import api from '../../../api/api';


export default function Checkout() {
  const [loading, setLoading] = useState(false);

  // Load Razorpay script dynamically helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/create-order', {
        amount: 500 // ₹500
      });

      if (!data.success) {
        alert('Something went wrong while creating order.');
        setLoading(false);
        return;
      }

      const { id: order_id, amount, currency } = data.order;

      // 2. Configure Razorpay checkout options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Public Key ID
        amount: amount,
        currency: currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: order_id,
        handler: async function (response) {
          // 3. Send payment details back to backend for signature validation
          try {
            const verifyRes = await axios.post('http://localhost:5000/api/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              alert('Payment Successful & Verified!');
              // Redirect user to a success page or update UI state
            }
          } catch (err) {
            alert('Payment verification failed on server.');
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      // 4. Open Razorpay modal window
      const paymentModal = new window.Razorpay(options);
      paymentModal.open();
    } catch (error) {
      console.error(error);
      alert('Payment initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Complete Your Purchase</h2>
      <button onClick={handlePayment} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Processing...' : 'Pay ₹500'}
      </button>
    </div>
  );
}