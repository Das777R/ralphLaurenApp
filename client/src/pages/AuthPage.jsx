import { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import '../styles/AuthPage.css';
import AuthHeader from '../components/Shared/AuthHeader/AuthHeader';
import HomePageFooter from '../components/ForLandingPage/HomePageFooter/HomePageFooter';
import api, { setAccessToken } from '../api/api';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [newuser, setNewUser] = useState(false);
  const [alert, setAlert] = useState(null); // { message, type }
  const nav = useNavigate();
  const navTimer = useRef(null);

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

  // Auto-hide the alert after 4 seconds
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 4000);
    return () => clearTimeout(timer);
  }, [alert]);

  // Clear the redirect timer if the page unmounts
  useEffect(() => {
    return () => clearTimeout(navTimer.current);
  }, []);

  const showAlert = (message, type) => setAlert({ message, type });

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
    setAlert(null);
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!customerAccount.email.trim() || !customerAccount.password) {
      showAlert('Please fill in your email and password.', 'danger');
      return;
    }

    try {
      let lsbag = [];
      try {
        lsbag = JSON.parse(localStorage.getItem('bag')) || [];
      } catch {
        lsbag = [];
      }

      const res = await api.post('/auth/login', { ...customerAccount, localBag: lsbag });
      const { user, accessToken } = res.data.data;

      setAccessToken(accessToken);
      localStorage.removeItem('bag');
      setCustomerAccount(resetLogin);
      showAlert('Logged in successfully!', 'success');

      // Short delay so the user can see the message before the redirect
      navTimer.current = setTimeout(() => nav(`/${user.id}`), 1200);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Login failed. Please try again.', 'danger');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setAlert(null);

    const isEmailValid = newAccount.email === newAccount.confirmEmail;
    const isPasswordValid = newAccount.password === newAccount.reEnterPassword;
    const isNameValid =
      newAccount.name.trim().length > 0 && newAccount.surname.trim().length > 0;

    if (!(isEmailValid && isPasswordValid && isNameValid)) {
      showAlert('Please check that emails and passwords match and all fields are filled.', 'success');
      return;
    }

    const userData = {
      name: `${newAccount.name} ${newAccount.surname}`,
      email: newAccount.email,
      password: newAccount.password
    };

    try {
      await api.post('/auth/signin', userData);
      setNewAccount(resetAccount);
      setNewUser(false);
      showAlert('Account created. Please sign in.', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Registration failed. Please try again.', 'danger');
    }
  };

  return (
    <>
      <AuthHeader />

      {alert && (
        <div
          className={`auth-alert alert alert-${alert.type} shadow`}
          role="alert"
        >
          <span className="auth-alert-message">{alert.message}</span>
          <IoClose
            className="alert-close-icon position-absolute end-0 border-1 border-black bottom-50 p-1 rounded-circle"
            size={22}
            role="button"
            tabIndex={0}
            aria-label="Close"
            onClick={() => setAlert(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setAlert(null);
            }}
          />
        </div>
      )}

      <div className="auth-outer-div d-flex w-100 h-100 justify-content-center">
        <div className="auth-container">
          <div className="auth-option-con text-capitalize d-flex">
            <div className={`signin-div ${!newuser ? 'bg-body' : 'current-active-auth'}`} onClick={() => switchTab(false)}>sign in</div>
            <div className={`create-div ${newuser ? 'bg-body' : 'current-active-auth'}`} onClick={() => switchTab(true)}>create account</div>
          </div>

          {newuser ? (
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
              <form onSubmit={handleSubmitForm} className="mt-4 d-flex flex-column gap-5">
                <div className="d-flex w-100 email-div">
                  <input type="email" placeholder="EMAIL ADDRESS *" className="user-select-none" name="email" value={newAccount.email} onChange={handleCreateNewAccount} />
                </div>
                <div className="d-flex w-100 email-div">
                  <input type="email" placeholder="CONFIRM EMAIL ADDRESS *" className="user-select-none" name="confirmEmail" value={newAccount.confirmEmail} onChange={handleCreateNewAccount} />
                </div>
                <div className="d-flex w-100 pass-div">
                  <input type="password" placeholder="PASSWORD *" className="user-select-none" name="password" value={newAccount.password} onChange={handleCreateNewAccount} />
                </div>
                <div className="d-flex w-100 pass-div">
                  <input type="password" placeholder="RE-ENTER PASSWORD *" className="user-select-none" name="reEnterPassword" value={newAccount.reEnterPassword} onChange={handleCreateNewAccount} />
                </div>
                <div className="d-flex w-100 pass-div">
                  <input type="text" placeholder="NAME *" className="user-select-none" name="name" value={newAccount.name} onChange={handleCreateNewAccount} />
                </div>
                <div className="d-flex w-100 pass-div">
                  <input type="text" placeholder="SURNAME *" className="user-select-none" name="surname" value={newAccount.surname} onChange={handleCreateNewAccount} />
                </div>
                <div className="forgot-pass-con d-flex justify-content-between">
                  <div className="text-capitalize forgot-pass-text">forgot password?</div>
                  <div className="required-text text-uppercase">* required</div>
                </div>
                <button className="border-0 signin-btn text-center text-uppercase d-flex justify-content-center align-content-center" type="submit">
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
              <form onSubmit={handleUserLogin} className="mt-4 d-flex flex-column gap-5">
                <div className="d-flex w-100 email-div">
                  <input type="email" placeholder="EMAIL ADDRESS *" className="user-select-none" name="email" value={customerAccount.email} onChange={handleLogin} />
                </div>
                <div className="d-flex w-100 pass-div">
                  <input type="password" placeholder="PASSWORD *" className="user-select-none" name="password" value={customerAccount.password} onChange={handleLogin} />
                </div>
                <div className="forgot-pass-con d-flex justify-content-between">
                  <div className="text-capitalize forgot-pass-text">forgot password?</div>
                  <div className="required-text text-uppercase">* required</div>
                </div>
                <button className="border-0 signin-btn text-center text-uppercase d-flex justify-content-center align-content-center" type="submit">
                  sign in
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <HomePageFooter />
    </>
  );
}

export default AuthPage;