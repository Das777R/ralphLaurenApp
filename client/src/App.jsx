import './App.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
// import PrivateAdminRoute from './routes/PrivateAdminRoute';
import DiscoverNavPage from './pages/DiscoverNavPage';
import AdminLayout from "./pages/AdminLayout";
import { useEffect } from 'react';
import { refreshSession } from './api/api';
import Dashboard from './components/ForAdmin/Dashboard/Dashboard';
import Products from './components/ForAdmin/Products/Products';
import Orders from './components/ForAdmin/Orders/Orders';
import Customers from './components/ForAdmin/Customers/Customer';
import Analytics from './components/ForAdmin/Analytics/Analytics';
import WebBanners from './components/ForAdmin/Webbanners/Webbanners';
import ProductMedia from './components/ForAdmin/ProductMedia/ProductMedia';

function App() {
  const nav = useNavigate();
  const { pathname } = useLocation();

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
  }, []);

  return (
    <>
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
        <Route path="/bagSubmit" element={<BagSubmit />} />

        {/* ---------- Admin ---------- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard/:adminId?" element={<Dashboard />} />
          <Route path="products/:adminId?" element={<Products />} />
          <Route path='orders/:adminId?' element={<Orders/>}/>
          <Route path='customers/:adminId?' element={<Customers/>}/>
          <Route path="analytics/:adminId?" element={<Analytics />} />
          <Route path="media/web-content/:adminId?" element={<WebBanners />} />
          <Route path="media/products/:adminId?" element={<ProductMedia />} />
        </Route>

        {/* </Route> */}
        <Route element={<PrivateBagRoute />}>
          <Route path="/bagSubmit/:userId" element={<BagSubmit />} />
        </Route>

        {/* <Route path="*" element={<Navigate to="/admin/auth" replace />} /> */}
      </Routes>
    </>
  );
}

export default App;