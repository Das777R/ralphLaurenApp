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

  async function placeOrder() {
    if (submitting) {
      return;
    }

    if (bagProducts.length === 0) {
      setError('Your bag is empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 30);

      const orderData = {
        ...address,
        products: bagProducts,
        deliveryDate: deliveryDate.toISOString()
      };

      const res = await api.post('/admin/placeorder', orderData);
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
        <PaymentSection error={error} submitting={submitting} onPay={placeOrder} />
        <BillingSummary totalPrice={totalPrice} shippingPrice={shippingPrice} />
      </div>

      {orderPlaced && (
        <ThankYouModal deliveredOn={deliveredOn} onContinue={() => nav(homePath)} />
      )}
    </div>
  );
}

export default Orders;