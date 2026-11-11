import '../styles/BagOrderPage.css'
import EmptyCheckout from '../components/ForCheckout/EmptyCheckout/EmptyCheckout'
import Order from '../components/ForCheckout/Orders/Orders'
import api from '../api/api';
import { useState, useEffect } from 'react';


function BagOrderPage() {
  const [showBagPage, setShowBagPage] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
    try{
      const res = await api.get('/product');
      console.log(res.data.success);
      if(res.data.success){
          setShowBagPage(true);
      }else{
          setShowBagPage(false);
      }
    }catch(err){
      console.log(err)
    }
    }

    fetchProducts()
  },[]);
return (
<>
{showBagPage ? (
<div>
  <EmptyCheckout/>
  <Order/>
</div>
) : null}
</>

)
}

export default BagOrderPage
