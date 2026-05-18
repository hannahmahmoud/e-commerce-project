import { useState, useEffect } from 'react';
import * as api from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

export default function CartPage({ onCartUpdate, onOrderSuccess }) {
  const { token } = useAuth();
  const [cart, setCart]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [coupon, setCoupon]     = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
  const [shipping, setShipping] = useState(20);
  const [tax, setTax]           = useState(5);
  const [toast, setToast]       = useState('');
  const [placing, setPlacing]   = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchCart = () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    api.getCart()
      .then(d => setCart(d.data?.data))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCart, [token]);

  const updateQty = async (productId, qty) => {
    try {
      const d = await api.updateCartQty(productId, { quantity: qty });
      setCart(d.updatedCart);
      onCartUpdate?.();
    } catch (err) { showToast(err.message); }
  };

  const removeItem = async (itemId) => {
    try {
      await api.removeFromCart(itemId);
      fetchCart();
      onCartUpdate?.();
    } catch (err) { showToast(err.message); }
  };

  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const d = await api.applyCoupon({ name: coupon.trim() });
      setCart(d.updatedData);
      setCouponMsg({ text: 'Coupon applied!', type: 'success' });
    } catch (err) {
      setCouponMsg({ text: err.message, type: 'error' });
    }
  };

  const cashCheckout = async () => {
  if (!cart?._id) return;
  setPlacing(true);
  try {
    const d = await api.createCashOrder(cart._id, {
      shippingPrice: Number(shipping) || 0,
      taxPrice: Number(tax) || 0,
    });
    showToast('Order placed successfully!');
    setCart(null);
    onCartUpdate?.();
    onOrderSuccess?.(d.order);
  } catch (err) { showToast(err.message); }
  finally { setPlacing(false); }
};

  const stripeCheckout = async () => {
    if (!cart?._id) return;
    setPlacing(true);
    try {
      const d = await api.createStripeSession(cart._id);
      if (d.session?.url) window.location.href = d.session.url;
    } catch (err) { showToast(err.message); }
    finally { setPlacing(false); }
  };

  if (!token) return <div className="cart-login-gate">Please log in to view your cart.</div>;
  if (loading) return <div className="cart-login-gate">Loading cart…</div>;

  if (!cart || cart.cartItems?.length === 0) return (
    <div className="cart-wrap">
      <h1 className="cart-wrap__title">Your Cart</h1>
      <div className="cart-empty">
        <div className="cart-empty__icon">🛒</div>
        <p>Your cart is empty.</p>
      </div>
    </div>
  );

  const subtotal  = cart.totalPrice 
  || cart.cartItems?.reduce((s, i) => s + ((i.price || 0) * i.quantity), 0) 
  || 0;
const afterDisc = cart.totalPriceAfterDiscount || subtotal;
  const discount  = subtotal - afterDisc;
  const total     = afterDisc + Number(shipping) + Number(tax);

  return (
    <div className="cart-wrap">
      {toast && <div className="toast">{toast}</div>}
      <h1 className="cart-wrap__title">Your Cart</h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div style={{ flex: 1 }}>
                <p className="cart-item__name">{item.product?.title || 'Product'}</p>
                <p className="cart-item__meta">Color: {item.color} · EGP {item.price || item.product?.price || 0} each</p>
              </div>
              <div className="cart-item__controls">
                <div className="cart-qty">
                  <button className="cart-qty__btn"
                    onClick={() => item.quantity > 1 && updateQty(item.product?._id || item.product, item.quantity - 1)}>−</button>
                  <span className="cart-qty__num">{item.quantity}</span>
                  <button className="cart-qty__btn"
                    onClick={() => updateQty(item.product?._id || item.product, item.quantity + 1)}>+</button>
                </div>
                <p className="cart-item__meta">Color: {item.color} · EGP {item.price || item.product?.price || 0} each</p>
                <button className="cart-item__remove" onClick={() => removeItem(item._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3 className="cart-summary__title">Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>EGP{subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row summary-row--discount">
              <span>Discount</span>
              <span>−EGP{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping</span>
            <input className="summary-small-input" type="number" value={shipping}
              onChange={e => setShipping(e.target.value)} />
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <input className="summary-small-input" type="number" value={tax}
              onChange={e => setTax(e.target.value)} />
          </div>

          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span>EGP{total.toFixed(2)}</span>
          </div>

          <div className="coupon-row">
            <input className="coupon-input" placeholder="Coupon code"
              value={coupon} onChange={e => setCoupon(e.target.value)} />
            <button className="coupon-btn" onClick={handleCoupon}>Apply</button>
          </div>
          {couponMsg.text && (
            <p className={`coupon-msg coupon-msg--${couponMsg.type}`}>{couponMsg.text}</p>
          )}

          <button className="checkout-cash" onClick={cashCheckout} disabled={placing}>
            {placing ? 'Placing order…' : 'Pay with cash'}
          </button>
          <button className="checkout-stripe" onClick={stripeCheckout} disabled={placing}>
            Pay with card (Stripe)
          </button>
        </div>
      </div>
    </div>
  );
}
