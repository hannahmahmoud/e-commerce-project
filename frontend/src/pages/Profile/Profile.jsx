import { useState, useEffect } from 'react';
import * as api from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [tab, setTab]             = useState('orders');
  const [order, setOrder]         = useState(null);
  const [wishlist, setWishlist]   = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [toast, setToast]         = useState('');

  const [addrForm, setAddrForm] = useState({ details: '', city: '', postalCode: '', phone: '', streetName: '' });
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', NewPassword: '', confirmNewPassword: '' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (!token) return;
    if (tab === 'orders') api.getMyOrder().then(d => {
    const orders = d.orders;
    setOrder(Array.isArray(orders) ? orders : orders ? [orders] : []);
}).catch(() => setOrder([]));
   if (tab === 'wishlist') {
  api.getWishlist().then(async d => {
    const ids = d.products || [];
    // ids is an array of raw ObjectId strings — fetch each product
    const productDetails = await Promise.all(
      ids.map(id => api.getProduct(id).then(r => r.data?.product).catch(() => null))
    );
    setWishlist(productDetails.filter(Boolean));
  }).catch(() => {});
}
    if (tab === 'addresses') api.getAddresses().then(d => setAddresses(d.Address || [])).catch(() => {});
  }, [tab, token]);

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await api.addAddress(addrForm);
      const d = await api.getAddresses();
      setAddresses(d.Address || []);
      setAddrForm({ details: '', city: '', postalCode: '', phone: '', streetName: '' });
      showToast('Address saved!');
    } catch (err) { showToast(err.message); }
  };

  const removeAddress = async (id) => {
    try {
      await api.removeAddress(id);
      setAddresses(prev => prev.filter(a => a._id !== id));
      showToast('Address removed.');
    } catch (err) { showToast(err.message); }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(id => id !== productId && id?._id !== productId));
      showToast('Removed from wishlist.');
    } catch (err) { showToast(err.message); }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try { await api.updateUser(profileForm); showToast('Profile updated!'); }
    catch (err) { showToast(err.message); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.updatePassword(pwForm);
      showToast('Password changed!');
      setPwForm({ currentPassword: '', NewPassword: '', confirmNewPassword: '' });
    } catch (err) { showToast(err.message); }
  };

  const TABS = [
    { id: 'orders',    label: 'My Order' },
    { id: 'wishlist',  label: 'Wishlist' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'account',   label: 'Account' },
  ];

  return (
    <div className="profile-wrap">
      {toast && <div className="toast">{toast}</div>}

      <div className="profile-header">
        <div className="profile-header__avatar">
          {(user?.name || 'U')[0].toUpperCase()}
        </div>
        <div>
          <div className="profile-header__name">{user?.name || 'User'}</div>
          <div className="profile-header__email">{user?.email || ''}</div>
        </div>
      </div>

      <div className="profile-tabs">
        {TABS.map(t => (
          <button key={t.id}
            className={`profile-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === ORDERS === */}
      {tab === 'orders' && (
        <div>
          {!order
            ? <p className="profile-empty">No orders found.</p>
            : (
              <div className="order-card">
                <div className="order-card__header">
                  <span className="order-card__id">#{order._id?.slice(-8)}</span>
                  <span className={`status-pill status-pill--${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`status-pill status-pill--${order.isDelivered ? 'delivered' : 'processing'}`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                  <span className="order-card__total">${order.totalPrice}</span>
                </div>
                <div className="order-items">
                  {order.cartItems?.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <span>{item.product?.title || 'Product'} ×{item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span>Payment: <b>{order.paymentMethod}</b></span>
                  <span>Shipping: ${order.shippingPrice} · Tax: ${order.taxPrice}</span>
                </div>
              </div>
            )}
        </div>
      )}

      {/* === WISHLIST === */}
{tab === 'wishlist' && (
  <div className="wish-grid">
    {wishlist.length === 0 && <p className="profile-empty">Your wishlist is empty.</p>}
    {wishlist.map(product => (
      <div key={product._id} className="wish-card">
        <div style={{ display:'flex', flexDirection:'column', gap:3, flex:1 }}>
          <span className="wish-card__name">{product.title}</span>
          <span style={{ fontSize:12, color:'var(--muted)' }}>
            {product.category?.name || ''} · {product.color || ''}
          </span>
        </div>
        <span className="wish-card__price">
          ${product.discountPrice || product.price}
        </span>
        <button className="remove-btn" onClick={() => removeFromWishlist(product._id)}>
          Remove
        </button>
      </div>
    ))}
  </div>
)}

      {/* === ADDRESSES === */}
      {tab === 'addresses' && (
        <div>
          <div className="addr-list">
            {addresses.length === 0 && <p className="profile-empty">No addresses saved.</p>}
            {addresses.map(a => (
              <div key={a._id} className="addr-card">
                <div>
                  <div className="addr-card__main">{a.details}, {a.streetName}</div>
                  <div className="addr-card__sub">{a.city} · {a.postalCode} · {a.phone}</div>
                </div>
                <button className="remove-btn" onClick={() => removeAddress(a._id)}>Remove</button>
              </div>
            ))}
          </div>

          <form className="form-card" onSubmit={addAddress}>
            <div className="form-card__title">Add new address</div>
            {[['details', 'Street details'], ['streetName', 'Street name']].map(([k, ph]) => (
              <input key={k} className="field-input" placeholder={ph}
                value={addrForm[k]} onChange={e => setAddrForm(f => ({ ...f, [k]: e.target.value }))} />
            ))}
            <div className="form-card__row">
              <input className="field-input" placeholder="City" value={addrForm.city}
                onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} />
              <input className="field-input" placeholder="Postal code" value={addrForm.postalCode} required
                onChange={e => setAddrForm(f => ({ ...f, postalCode: e.target.value }))} />
            </div>
            <input className="field-input" placeholder="Phone" value={addrForm.phone} required
              onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} />
            <button type="submit" className="save-btn">Save address</button>
          </form>
        </div>
      )}

      {/* === ACCOUNT === */}
      {tab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <form className="form-card" onSubmit={updateProfile}>
            <div className="form-card__title">Update profile</div>
            <input className="field-input" placeholder="Name" value={profileForm.name}
              onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
            <input className="field-input" placeholder="Email" type="email" value={profileForm.email}
              onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} />
            <button type="submit" className="save-btn">Save changes</button>
          </form>

          <form className="form-card" onSubmit={changePassword}>
            <div className="form-card__title">Change password</div>
            <input className="field-input" type="password" placeholder="Current password"
              value={pwForm.currentPassword} required
              onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} />
            <input className="field-input" type="password" placeholder="New password"
              value={pwForm.NewPassword} required
              onChange={e => setPwForm(f => ({ ...f, NewPassword: e.target.value }))} />
            <input className="field-input" type="password" placeholder="Confirm new password"
              value={pwForm.confirmNewPassword} required
              onChange={e => setPwForm(f => ({ ...f, confirmNewPassword: e.target.value }))} />
            <button type="submit" className="save-btn">Update password</button>
          </form>
        </div>
      )}
    </div>
  );
}
