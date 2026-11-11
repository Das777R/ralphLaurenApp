import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UIContext } from '../../../context/UIContext';
import api from '../../../api/api';
import OrderTable from './OrderTable';
import AddressForm from './AddressForm';
import DeliveryAddress from './DeliveryAddress';
import PaymentSection from './PaymentSection';
import BillingSummary from './BillingSummary';
import ThankYouModal from './ThankYouModal';

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

const emptyAddress = {
  addressName: '',
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  mobileNumber: ''
};

const requiredFields = [
  'addressName',
  'firstName',
  'lastName',
  'email',
  'country',
  'address1',
  'city',
  'postcode',
  'mobileNumber'
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Orders() {
  const { userId } = useParams();
  const { totalPrice, setBagProducts, bagProducts } = useContext(UIContext);
  const nav = useNavigate();

  const [address, setAddress] = useState(emptyAddress);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveredOn, setDeliveredOn] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shippingPrice = 0;

  let homePath = '/';
  if (userId) {
    homePath = '/' + userId;
  }

  useEffect(() => {
    async function loadBag() {
      if (!userId) {
        return;
      }
      try {
        const res = await api.get('/auth/' + userId);
        setBagProducts(res.data.data.bag);
      } catch (err) {
        console.log(err);
      }
    }

    loadBag();
  }, []);

  useEffect(() => {
    if (orderPlaced) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [orderPlaced]);

  function handleChange(e) {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setAddress({ ...address, [fieldName]: fieldValue });
  }

  // Step 1: validate, create the Razorpay order on the server, open the checkout
  async function createOrder() {
    if (submitting) {
      return;
    }

    if (bagProducts.length === 0) {
      setError('Your bag is empty.');
      return;
    }

    const missing = requiredFields.filter((f) => !address[f].trim());
    if (missing.length > 0) {
      setError('Please fill in all the required address fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Razorpay SDK failed to load. Check your internet connection.');
        setSubmitting(false);
        return;
      }

      const res = await api.post('/auth/create-order', { products: bagProducts });

      if (!res.data.success) {
        setError(res.data.message || 'Something went wrong');
        setSubmitting(false);
        return;
      }

      const order = res.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Ralph Lauren',
        description: 'Order payment',
        order_id: order.id,
        // Called by Razorpay after a successful payment
        handler: async function (response) {
          try {
            const verify = await api.post('/auth/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (!verify.data.success) {
              setError(verify.data.message || 'Payment verification failed');
              setSubmitting(false);
              return;
            }

            await placeOrder(response);
          } catch (err) {
            console.log(err);
            setError('Payment was taken but could not be verified. Please contact support.');
            setSubmitting(false);
          }
        },
        prefill: {
          name: address.firstName + ' ' + address.lastName,
          email: address.email,
          contact: address.mobileNumber
        },
        theme: { color: '#000000' },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error(response.error);
        setError(response.error.description || 'Payment failed');
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError('Could not start payment');
      setSubmitting(false);
    }
  }

  // Step 2: runs only after the payment signature has been verified
  async function placeOrder(paymentInfo) {
    try {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 30);

      const orderData = {
        ...address,
        products: bagProducts,
        deliveryDate: deliveryDate.toISOString(),
        razorpayOrderId: paymentInfo.razorpay_order_id,
        razorpayPaymentId: paymentInfo.razorpay_payment_id
      };

      const res = await api.post('/auth/placeorder', orderData);
      await api.delete('/auth/userBag/' + userId);

      setDeliveredOn(formatDate(res.data.data.deliveryDate));
      setAddress(emptyAddress);
      setBagProducts([]);
      setOrderPlaced(true);
    } catch (err) {
      console.log(err);

      let message = 'Could not place your order. Please check your details and try again.';
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message);
    }

    setSubmitting(false);
  }

  return (
    <div className={`w-100 user-select-none ${userId ? 'd-block' : 'd-none'}`}>
      <Link to={homePath} style={{ textDecoration: 'inherit' }}>
        <div className="text-uppercase text-center mt-4 order-logo-title">ralph lauren</div>
      </Link>

      <OrderTable products={bagProducts} userId={userId} />

      <div className="d-flex justify-content-end px-5 fw-semibold text-capitalize fs-5 user-select-none">
        Items Total : ₹ {totalPrice}
      </div>

      <div className="d-lg-flex gap-4 mt-5 flex-sm-column flex-lg-row justify-content-lg-between p-4">
        <AddressForm address={address} onChange={handleChange} />
        <DeliveryAddress />
      </div>

      <div className="d-md-flex d-flex flex-lg-row d-lg-flex flex-column-reverse my-5 justify-content-md-between w-100 px-5 gap-5">
        <PaymentSection error={error} submitting={submitting} onPay={createOrder} />
        <BillingSummary totalPrice={totalPrice} shippingPrice={shippingPrice} />
      </div>

      {orderPlaced && (
        <ThankYouModal deliveredOn={deliveredOn} onContinue={() => nav(homePath)} />
      )}
    </div>
  );
}

export default Orders;