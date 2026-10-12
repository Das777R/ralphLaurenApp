import './App.css';
import { Routes, Route } from 'react-router-dom';
import WomenNavPage from './pages/WomenNavPage';
import MenNavPage from './pages/MenNavPage';
import ProductLook from './pages/ProductLookOutPage';
import AuthPage from './pages/AuthPage';
import Bag from './pages/BagPage';
import FavPage from './pages/FavPage';
import BagSubmit from './pages/BagOrderPage';
import PrivateRoute from './routes/PrivateRoute';
import KidsPage from './pages/KidsNavPage';
import HomeNavPage from './pages/HomeNavPage';
import SearchedPage from './pages/SeachedPage';
import LandingPage from './pages/LandingPage';
import KidsProductsPage from './pages/KidsProductsPage';
import WomenProductsPage from './pages/WomenProductsPage';
import MenProductsPage from './pages/MenProductsPage';
import HomeProductsPage from './pages/HomeProductsPage'; 
import AdminProducts from './components/ForAdmin/Admin/AdminProducts';
import AdminCustomers from './components/ForAdmin/Admin/AdminCustomers';
import AdminMedia from './components/ForAdmin/Admin/AdminMedia';
import Auth from './components/ForAdmin/Auth/Auth';
import PrivateAdminRoute from './routes/PrivateAdminRoute';
import DiscoverNavPage from './pages/DiscoverNavPage';
import AdminLayout from "./pages/AdminLayout";

function App() {
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

        
        <Route path="/admin/auth/:adminId?" element={<Auth />} />
        <Route element={<PrivateAdminRoute />}>
         <Route path="/admin/auth/:adminId?" element={<Auth />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/customers/:adminId?" element={<AdminCustomers />} />
            <Route path="/admin/products/:adminId?" element={<AdminProducts />} />
            <Route path="/admin/media/:adminId?" element={<AdminMedia />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/bagSubmit/:userId" element={<BagSubmit />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;