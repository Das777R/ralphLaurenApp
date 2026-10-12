
import api, {setAccessToken} from '../../../api/api'
import './Auth.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Auth() {
  const [newuser, setNewUser] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const nav = useNavigate();

  const resetAccount = {
    email: '',
    confirmEmail: '',
    password: '',
    reEnterPassword: '',
    name: '',
    surname: ''
  };

  const resetLogin = {
    email: '',
    password: ''
  };

  const [newAccount, setNewAccount] = useState(resetAccount);
  const [customerAccount, setCustomerAccount] = useState(resetLogin);

  const handleCreateNewAccount = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  const handleLogin = (e) => {
    const { name, value } = e.target;
    setCustomerAccount({ ...customerAccount, [name]: value });
  };

  const switchTab = (isNew) => {
    setNewUser(isNew);
    setError('');
    setInfo('');
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    try {
      const res = await api.post('/admin/auth/login', customerAccount);
      const { user, accessToken } = res.data.data;

    
      if (user.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
       const adminId = user.id;
      setAccessToken(accessToken);
      setCustomerAccount(resetLogin);
      nav(`/admin/products/${adminId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const isEmailValid = newAccount.email === newAccount.confirmEmail;
    const isPasswordValid = newAccount.password === newAccount.reEnterPassword;
    const isNameValid =
      newAccount.name.trim().length > 0 && newAccount.surname.trim().length > 0;

    if (!(isEmailValid && isPasswordValid && isNameValid)) {
      setError('Please check that emails and passwords match and all fields are filled.');
      return;
    }

  
    const userData = {
      name: `${newAccount.name} ${newAccount.surname}`,
      email: newAccount.email,
      password: newAccount.password
    };

    try {
     const res =  await api.post('/admin/auth/signup', userData);
     console.log(res);
      setNewAccount(resetAccount);
      
      setInfo('Admin Acccount created!!');
      setNewUser(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className='d-flex align-item-center justify-content-center'>
      <div className="auth-container mt-2">
        <div className="auth-option-con text-capitalize d-flex">
          <div className={`signin-div ${!newuser ? 'bg-body' : 'current-active-auth'}`} onClick={() => switchTab(false)}>sign in</div>
          <div className={`create-div ${newuser ? 'bg-body' : 'current-active-auth'}`} onClick={() => switchTab(true)}>create account</div>
        </div>

        {error && <div className="text-danger text-center mt-3" style={{ fontSize: '14px' }}>{error}</div>}
        {info && <div className="text-success text-center mt-3" style={{ fontSize: '14px' }}>{info}</div>}

        {newuser ? (
          <div className="sign-in-form mx-4">
            <div className="auth-with-con text-uppercase d-flex justify-content-around mt-4">
              <div className="fb-con d-flex mx-auto">
                <img src="/icons/fb-favi.webp" alt="fb-favi" />
                facebook
              </div>
              <div className="google-con">
                <img src="/icons/google-favi.webp" alt="google-favi" />
                google
              </div>
              <div className="apple-con">
                <img src="/icons/apple-favi.webp" alt="apple-favi" />
                apple
              </div>
            </div>
            <div className="text-center mt-3 text-dark user-select-none" style={{ fontSize: "14px" }}>or</div>
            <form onSubmit={handleSubmitForm} className='mt-4 d-flex flex-column gap-5'>
              <div className="d-flex w-100  email-div">
                <input type="email" placeholder='EMAIL ADDRESS *' className='user-select-none' name='email' value={newAccount.email} onChange={handleCreateNewAccount} />
              </div>
              <div className="d-flex w-100  email-div">
                <input type="email" placeholder='CONFIRM EMAIL ADDRESS *' className='user-select-none' name='confirmEmail' value={newAccount.confirmEmail} onChange={handleCreateNewAccount} />
              </div>
              <div className="d-flex w-100 pass-div">
                <input type="password" placeholder='PASSWORD *' className='user-select-none' name='password' value={newAccount.password} onChange={handleCreateNewAccount} />
              </div>
              <div className="d-flex w-100 pass-div">
                <input type="password" placeholder='RE-ENTER PASSWORD *' className='user-select-none' name='reEnterPassword' value={newAccount.reEnterPassword} onChange={handleCreateNewAccount} />
              </div>
              <div className="d-flex w-100  pass-div">
                <input type="text" placeholder='NAME *' className='user-select-none' name='name' value={newAccount.name} onChange={handleCreateNewAccount} />
              </div>
              <div className="d-flex w-100  pass-div">
                <input type="text" placeholder='SURNAME *' className='user-select-none' name='surname' value={newAccount.surname} onChange={handleCreateNewAccount} />
              </div>
              <div className="forgot-pass-con d-flex justify-content-between">
                <div className="text-capitalize forgot-pass-text">forgot password?</div>
                <div className="required-text text-uppercase">* required</div>
              </div>
              <button className="border-0 signin-btn text-center text-uppercase d-flex justify-content-center align-content-center" type='submit'>
                create account
              </button>
            </form>
          </div>
        ) : (
          <div className="sign-in-form mx-4">
            <div className="auth-with-con text-uppercase d-flex justify-content-around mt-4">
              <div className="fb-con">
                <img src="/icons/fb-favi.webp" alt="fb-favi" />
                facebook
              </div>
              <div className="google-con">
                <img src="/icons/google-favi.webp" alt="google-favi" />
                google
              </div>
              <div className="apple-con">
                <img src="/icons/apple-favi.webp" alt="apple-favi" />
                apple
              </div>
            </div>
            <div className="text-center mt-3 text-dark user-select-none" style={{ fontSize: "14px" }}>or</div>
            <form onSubmit={handleUserLogin} className='mt-4 d-flex flex-column gap-5'>
              <div className="d-flex w-100  email-div">
                <input type="email" placeholder='EMAIL ADDRESS *' className='user-select-none' name='email' value={customerAccount.email} onChange={handleLogin} />
              </div>
              <div className="d-flex w-100  pass-div">
                <input type="password" placeholder='PASSWORD *' className='user-select-none' name='password' value={customerAccount.password} onChange={handleLogin} />
              </div>
              <div className="forgot-pass-con d-flex justify-content-between">
                <div className="text-capitalize forgot-pass-text">forgot password?</div>
                <div className="required-text text-uppercase">* required</div>
              </div>
              <button className="border-0 signin-btn text-center text-uppercase d-flex justify-content-center align-content-center" type='submit'>
                sign in
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;