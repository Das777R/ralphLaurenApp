import { useParams } from 'react-router-dom'
import HomePageFooter from '../../ForLandingPage/HomePageFooter/HomePageFooter';
import AuthForCheckOut from '../AuthForCheckout/AuthForCheckout';
import AuthHeader from '../../Shared/AuthHeader/AuthHeader'

function EmptyCheckout() {

const {userId} = useParams();

return (
  <div className={userId ? 'd-none' : 'd-block'}>
    <AuthHeader/>
    <AuthForCheckOut/>
    <HomePageFooter/>
  </div>
)
}

export default EmptyCheckout