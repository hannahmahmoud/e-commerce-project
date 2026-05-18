import { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/footer/footer';
import HomePage from './pages/Home/Home';
import AuthPage from './pages/Auth/Auth';
import ProductsPage from './pages/Products/Products';
import ProductDetailPage from './pages/ProductDetail/ProductDetail';
import CartPage from './pages/Cart/Cart';
import ProfilePage from './pages/Profile/Profile';
import AdminPage from './pages/Admin/Admin';
import * as api from './api';
import './styles/global.css';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { token, isAdmin } = useAuth();
  if (!token)   return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function ProductDetailWrapper({ onCartUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ProductDetailPage
      productId={id}
      onBack={() => navigate('/products')}
      onCartUpdate={onCartUpdate}
    />
  );
}

export default function App() {
  const { token, setCartCount, cartCount } = useAuth();
  const navigate = useNavigate();

  const refreshCart = useCallback(() => {
    if (!token) { setCartCount(0); return; }
    api.getCart()
      .then(d => setCartCount(d.data?.data?.cartItems?.length || 0))
      .catch(() => setCartCount(0));
  }, [token, setCartCount]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  return (
    <>
      <Navbar cartCount={cartCount} />

      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/login"        element={<AuthPage />} />
        <Route path="/products"     element={<ProductsPage onProductClick={(id) => navigate(`/products/${id}`)} onCartUpdate={refreshCart} />} />
        <Route path="/products/:id" element={<ProductDetailWrapper onCartUpdate={refreshCart} />} />
        <Route path="/cart"         element={<PrivateRoute><CartPage onCartUpdate={refreshCart} onOrderSuccess={() => navigate('/profile')} /></PrivateRoute>} />
        <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/admin"        element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}
