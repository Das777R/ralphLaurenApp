import './App.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import WomenNavPage from './pages/WomenNavPage';
import MenNavPage from './pages/MenNavPage';
import ProductLook from './pages/ProductLookOutPage';
import AuthPage from './pages/AuthPage';
import Bag from './pages/BagPage';
import FavPage from './pages/FavPage';
import BagSubmit from './pages/BagOrderPage';
import PrivateBagRoute from './routes/PrivateBagRoute';
import KidsPage from './pages/KidsNavPage';
import HomeNavPage from './pages/HomeNavPage';
import SearchedPage from './pages/SeachedPage';
import LandingPage from './pages/LandingPage';
import KidsProductsPage from './pages/KidsProductsPage';
import WomenProductsPage from './pages/WomenProductsPage';
import MenProductsPage from './pages/MenProductsPage';
import HomeProductsPage from './pages/HomeProductsPage';
import DiscoverNavPage from './pages/DiscoverNavPage';
import AdminLayout from './pages/AdminLayout';
import { refreshSession } from './api/api';
import Dashboard from './components/ForAdmin/Dashboard/Dashboard';
import Products from './components/ForAdmin/Products/Products';
import Orders from './components/ForAdmin/Orders/Orders';
import Customers from './components/ForAdmin/Customers/Customer';
import Analytics from './components/ForAdmin/Analytics/Analytics';
import WebBanners from './components/ForAdmin/Webbanners/Webbanners';
import ProductMedia from './components/ForAdmin/ProductMedia/ProductMedia';
import ScrollToTop from './ScrollToTop';


function App() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  // Restore the *user* session on first load.
  //  Admin pages manage their own session.
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    let cancelled = false;

    refreshSession('user')
      .then((data) => {
        if (cancelled) return;
        const userId = data?.role === 'user' && data.userId;

        if (userId && (pathname === '/' || pathname.startsWith('/auth'))) {
          nav(`/${userId}`, { replace: true });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <ScrollToTop />
        <Routes>
      <Route path="/:userId?" element={<LandingPage />} />
      <Route path="/women-section/:userId?" element={<WomenNavPage />} />
      <Route path="/men-section/:userId?" element={<MenNavPage />} />
      <Route path="/kids-section/:userId?" element={<KidsPage />} />
      <Route path="/home-section/:userId?" element={<HomeNavPage />} />
      <Route path="/discover-section/:userId?" element={<DiscoverNavPage />} />

      {/* Category Routes */}
      <Route path="/men-section/category/:category/:userId?" element={<MenProductsPage />} />
      <Route path="/women-section/category/:category/:userId?" element={<WomenProductsPage />} />
      <Route path="/kids-section/category/:category/:userId?" element={<KidsProductsPage />} />
      <Route path="/home-section/category/:category/:userId?" element={<HomeProductsPage />} />

      <Route path="/lookup/:productId/:userId?" element={<ProductLook />} />
      <Route path="/search/:userId?" element={<SearchedPage />} />
      <Route path="/auth/:userId?" element={<AuthPage />} />
      <Route path="/bag/:userId?" element={<Bag />} />
      <Route path="/fav/:userId?" element={<FavPage />} />

      <Route element={<PrivateBagRoute />}>
        <Route path="/bagSubmit/:userId" element={<BagSubmit />} />
      </Route>

      {/* ---------- Admin ----------
          AdminLayout is the only gate: guests get the login screen and the
          nested pages (<Outlet />) are never rendered for them. */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="auth" element={<Navigate to="/admin" replace />} />
        <Route path="dashboard/:adminId?" element={<Dashboard />} />
        <Route path="products/:adminId?" element={<Products />} />
        <Route path="orders/:adminId?" element={<Orders />} />
        <Route path="customers/:adminId?" element={<Customers />} />
        <Route path="analytics/:adminId?" element={<Analytics />} />
        <Route path="media/web-content/:adminId?" element={<WebBanners />} />
        <Route path="media/products/:adminId?" element={<ProductMedia />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
     
    </Routes>
    </>

  );
}

export default App;