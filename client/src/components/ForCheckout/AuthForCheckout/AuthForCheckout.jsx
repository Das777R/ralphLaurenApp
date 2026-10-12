import { useContext, useState } from 'react';
import api from "../../../api/api";
import {UIContext} from '../../../context/UIContext';
import { Link, useNavigate  } from 'react-router-dom'


function AuthForCheckOut() {
const nav = useNavigate();

const {setBagProducts} = useContext(UIContext);

const authPath = `/auth`;

const resetLogin = {
email: '',
password: ''
}

const [customerAccount, setCustomerAccount] = useState(resetLogin);

const handleLogin = (e) => {
const {name, value} = e.target;

setCustomerAccount({
...customerAccount,
[name]: value
})
}

const handleUserLogin = async (e) => {
e.preventDefault();
const lsbag = JSON.parse(localStorage.getItem('bag')) || [];

try{
const res = await api.post('/auth/login', {
email: customerAccount.email,
password: customerAccount.password,
localBag: lsbag
});
const loggedInUser = res.data.data;
setBagProducts(loggedInUser.bag)

localStorage.removeItem('bag'); 

nav(`/bagSubmit/${loggedInUser._id}`)
setCustomerAccount(resetLogin);
}catch(err){
console.log(err)
}
}
  return (
    <div className="bag-submit-auth-con mb-5 d-flex flex-lg-row flex-column justify-content-between">
    <div className="w-100 d-flex flex-column align-items-center">
    <div className="guest-checkout-con w-lg-75 p-2  w-100">
    <h4 className='text-uppercase guest-checkout-title'>guest checkout</h4>
    <div className="flex-wrap guest-input-instruction">You can check out without having an account. You'll have a chance to create an account later.</div>
    <div className="w-100 d-flex mt-3 guest-email-input-div">
    <input type="text" placeholder='EMAIL ADDRESS *' className='flex-grow-1 guest-email-input'/>
    </div>
    <div className="form-check mt-4">
    <input className="form-check-input" type="checkbox" value="" id="checkChecked"/>
    <label className="form-check-label checkbox-instruction-submit-bag-text" htmlFor="checkChecked">
    Tick here if you would like to receive the latest news, special offers and/or exclusive events relating to Ralph Lauren products and services, by e-mail or targeted social media ads. By signing up, you consent to the use of tracking technologies for personalisation and analytics. You may unsubscribe at any time by clicking on the unsubscribe link in each e-mail. For more information, please read <span className='read-rlf-lauren-checkbox-text text-decoration-underline text-dark'> Ralph Lauren Europe Sàrl’s Privacy Notice
    </span>
    </label>
    </div>

    <div className="border-0 ckeckoutGuest-btn text-center text-uppercase d-flex justify-content-center align-content-center mt-5">checkout as guest</div>


    <div className="create-account-text-instruction-on-guest-checkout mt-5">
    Creating an account is quick and gives you access to exclusive offers, news, order history and faster checkout.
    </div>

    <Link to={authPath} style={{textDecoration: "none"}}>      
    <div className="border-0 ckeckoutGuest-btn text-center text-uppercase d-flex justify-content-center align-content-center my-5">create an account
    </div>
    </Link>   
    </div>
    </div>

    <div className="user-checkout-con w-100">
    <div className="w-lg-75 d-flex mx-lg-5 px-2 my-0">
    <div className="sign-in-form w-100">
    <h5 className='text-uppercase d-flex justify-content-between sign-in-title-bag-submit'>sign in <span className='required-signin-bag-submit text-capitalize'>*required</span></h5>
    <div className="auth-with-con text-uppercase d-flex flex-lg-row flex-column gap-3 justify-content-between mt-4">
    <div className="fb-con d-lg-flex d-lg-block justify-content-center">
    <img src="/icons/fb-favi.webp" alt="fb-favi" />
    facebook
    </div>
    <div className="google-con d-lg-flex d-lg-block justify-content-center align-items-center">
    <img src="/icons/google-favi.webp" alt="fb-favi" />
    google
    </div>
    <div className="apple-con d-lg-flex d-lg-block justify-content-center align-items-center">
    <img src="/icons/apple-favi.webp" alt="fb-favi" />
    apple
    </div>
    </div>

    <div className="text-center mt-3 text-dark user-select-none" style={{fontSize: "14px"}}>or</div>
    <form 
    onSubmit={handleUserLogin}
    className='mt-4 d-flex flex-column gap-5'>
    <div className="d-flex w-100 bg-danger email-div">
    <input 
    type="text"
    placeholder='EMAIL ADDRESS *'
    className='user-select-none'
    name='email'
    value={customerAccount.email} 
    onChange={handleLogin}
    />
    </div>
    <div className="d-flex w-100 bg-danger pass-div">
    <input 
    type="password"
    placeholder='PASSWORD *'
    className='user-select-none' 
    name='password'
    value={customerAccount.password} 
    onChange={handleLogin}
    />
    </div>
    <div className="forgot-pass-con d-flex justify-content-between">
    <div className="text-capitalize forgot-pass-text">forgot password?</div>
    <div className="required-text text-uppercase">* required</div>
    </div>

    <button type='submit' className="border-0 signin-btn text-center text-uppercase d-flex justify-content-center align-content-center p-3">
    sign in
    </button>
    </form>
    </div>
    </div>

    </div>
    </div>
  )
}

export default AuthForCheckOut
