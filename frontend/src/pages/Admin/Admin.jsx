import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const BASE = 'http://localhost:4000';
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const jsonHeader = () => ({ ...authHeader(), 'Content-Type': 'application/json' });

async function apiFetch(method, path, body) {
  const isFormData = body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: isFormData ? authHeader() : jsonHeader(),
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });
  if (res.status === 204) return {};
  const data = await res.json();
  if (!res.ok) throw new Error(data.Message || data.message || 'Request failed');
  return data;
}

function useToast() {
  const [toast, setToast] = useState({ msg: '', type: 'ok' });
  const show = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'ok' }), 3500);
  };
  return { toast, show };
}

function Confirm({ msg, onYes, onNo }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="confirm-msg">{msg}</p>
        <div className="confirm-actions">
          <button className="confirm-yes" onClick={onYes}>Yes, delete</button>
          <button className="confirm-no" onClick={onNo}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const { toast, show } = useToast();

  if (!isAdmin) return <Navigate to="/" replace />;

  const TABS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products',  label: '📦 Products'  },
    { id: 'categories',label: '🗂 Categories' },
    { id: 'brands',    label: '🏷 Brands'     },
    { id: 'coupons',   label: '🎟 Coupons'    },
    { id: 'orders',    label: '🧾 Orders'     },
    { id: 'reviews',   label: '⭐ Reviews'    },
  ];

  return (
    <div className="admin-wrap">
      {toast.msg && <div className={`admin-toast admin-toast--${toast.type}`}>{toast.msg}</div>}

      <div className="admin-sidebar">
        <div className="admin-sidebar__title">Admin Panel</div>
        {TABS.map(t => (
          <button key={t.id}
            className={`admin-sidebar__btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'dashboard'  && <DashboardTab  show={show} />}
        {tab === 'products'   && <ProductsTab   show={show} />}
        {tab === 'categories' && <CategoriesTab show={show} />}
        {tab === 'brands'     && <BrandsTab     show={show} />}
        {tab === 'coupons'    && <CouponsTab    show={show} />}
        {tab === 'orders'     && <OrdersTab     show={show} />}
        {tab === 'reviews'    && <ReviewsTab    show={show} />}
      </div>
    </div>
  );
}

function DashboardTab({ show }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      apiFetch('GET', '/servics/order/getAllorders'),
      apiFetch('GET', '/services/products?limit=1000'),
      apiFetch('GET', '/services/categoryServices'),
      apiFetch('GET', '/services/brandServices'),
    ]).then(([orders, products, cats, brands]) => {
      const allOrders   = orders.orders  || [];
      const allProducts = products.data?.products || [];
      const revenue = allOrders.filter(o => o.isPaid).reduce((s, o) => s + (o.totalPrice || 0), 0);
      const sold    = allProducts.reduce((s, p) => s + (p.quantityOfSoldProduct || 0), 0);
      setStats({
        totalOrders:     allOrders.length,
        paidOrders:      allOrders.filter(o => o.isPaid).length,
        unpaidOrders:    allOrders.filter(o => !o.isPaid).length,
        deliveredOrders: allOrders.filter(o => o.isDelivered).length,
        revenue,
        totalProducts:   allProducts.length,
        totalSold:       sold,
        lowStock:        allProducts.filter(p => p.quantity < 5).length,
        categories:      cats.data?.category?.length || 0,
        brands:          brands.data?.brands?.length || 0,
        recentOrders:    allOrders.slice(0, 5),
      });
    }).catch(() => show('Failed to load dashboard', 'err'));
  }, []);

  if (!stats) return <div className="admin-loading">Loading dashboard…</div>;

  const cards = [
    { label: 'Total Revenue',  value: `EGP ${stats.revenue.toFixed(2)}`, color: '#4ade80' },
    { label: 'Total Orders',   value: stats.totalOrders,                  color: '#60a5fa' },
    { label: 'Paid Orders',    value: stats.paidOrders,                   color: '#4ade80' },
    { label: 'Unpaid Orders',  value: stats.unpaidOrders,                 color: '#f87171' },
    { label: 'Delivered',      value: stats.deliveredOrders,              color: '#a78bfa' },
    { label: 'Total Products', value: stats.totalProducts,                color: '#60a5fa' },
    { label: 'Units Sold',     value: stats.totalSold,                    color: '#4ade80' },
    { label: 'Low Stock (<5)', value: stats.lowStock,                     color: '#fb923c' },
    { label: 'Categories',     value: stats.categories,                   color: '#60a5fa' },
    { label: 'Brands',         value: stats.brands,                       color: '#a78bfa' },
  ];

  return (
    <div>
      <h2 className="admin-content__title">Dashboard</h2>
      <div className="dash-grid">
        {cards.map(c => (
          <div key={c.label} className="dash-card">
            <div className="dash-card__value" style={{ color: c.color }}>{c.value}</div>
            <div className="dash-card__label">{c.label}</div>
          </div>
        ))}
      </div>

      <h3 className="admin-content__subtitle">Recent Orders</h3>
      <table className="admin-table">
        <thead><tr>
          <th>Order ID</th><th>Customer</th><th>Total</th><th>Paid</th><th>Delivered</th><th>Date</th>
        </tr></thead>
        <tbody>
          {stats.recentOrders.map(o => (
            <tr key={o._id}>
              <td style={{ fontFamily:'monospace', fontSize:12 }}>#{o._id?.slice(-8)}</td>
              <td>{o.user?.name || '—'}</td>
              <td>EGP {o.totalPrice}</td>
              <td><span className={`status-pill ${o.isPaid ? 'paid' : 'unpaid'}`}>{o.isPaid ? 'Yes' : 'No'}</span></td>
              <td><span className={`status-pill ${o.isDelivered ? 'delivered' : 'pending'}`}>{o.isDelivered ? 'Yes' : 'No'}</span></td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsTab({ show }) {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [subCats,    setSubCats]    = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [confirm,    setConfirm]    = useState(null);
  const [search,     setSearch]     = useState('');

  const empty = { title:'', description:'', price:'', discountPrice:'',
    quantity:'', color:'', coverPhoto:'', rating:'4', category:'', brand:'', subCategory:'' };
  const [form, setForm] = useState(empty);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    const [p, c, b, s] = await Promise.all([
      apiFetch('GET', '/services/products?limit=1000'),
      apiFetch('GET', '/services/categoryServices'),
      apiFetch('GET', '/services/brandServices'),
      apiFetch('GET', '/services/subCategoryServices'),
    ]);
    setProducts(p.data?.products || []);
    setCategories(c.data?.category || []);
    setBrands(b.data?.brands || []);
    setSubCats(s.data?.subCategories || []);
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditItem(null); setShowForm(true); };
  const openEdit = p => {
    setForm({
      title: p.title, description: p.description, price: p.price,
      discountPrice: p.discountPrice || '', quantity: p.quantity,
      color: p.color, coverPhoto: p.coverPhoto, rating: p.rating,
      category: p.category?._id || '', brand: p.brand?._id || '',
      subCategory: p.subCategory?.[0]?._id || '',
    });
    setEditItem(p); setShowForm(true);
  };

  const submit = async e => {
    e.preventDefault();
    try {
      const body = {
        ...form,
        price: Number(form.price), quantity: Number(form.quantity),
        rating: Number(form.rating),
        ratingAvgerage: Number(form.rating),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        subCategory: form.subCategory ? form.subCategory : undefined,
      };
      if (editItem) {
        await apiFetch('DELETE', `/services/products/${editItem._id}`);
        await apiFetch('POST', '/services/products', body);
        show('Product updated!');
      } else {
        await apiFetch('POST', '/services/products', body);
        show('Product created!');
      }
      setShowForm(false); load();
    } catch (err) { show(err.message, 'err'); }
  };

  const del = id => setConfirm({
    msg: 'Delete this product?',
    onYes: async () => {
      try { await apiFetch('DELETE', `/services/products/${id}`); show('Deleted.'); load(); }
      catch(err) { show(err.message, 'err'); }
      setConfirm(null);
    },
    onNo: () => setConfirm(null),
  });

  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {confirm && <Confirm {...confirm} />}
      <div className="admin-section-header">
        <h2 className="admin-content__title">Products ({products.length})</h2>
        <div style={{ display:'flex', gap:10 }}>
          <input className="admin-search" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="admin-add-btn" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={submit}>
          <h3 className="admin-form__title">{editItem ? 'Edit Product' : 'New Product'}</h3>
          <div className="admin-form__row">
            <Field label="Title *"><input className="admin-input" value={form.title} onChange={set('title')} required /></Field>
            <Field label="Color *"><input className="admin-input" value={form.color} onChange={set('color')} required placeholder="e.g. black" /></Field>
          </div>
          <Field label="Description *">
            <textarea className="admin-input admin-textarea" value={form.description} onChange={set('description')} required rows={3} />
          </Field>
          <div className="admin-form__row">
            <Field label="Price *"><input className="admin-input" type="number" value={form.price} onChange={set('price')} required /></Field>
            <Field label="Discount Price"><input className="admin-input" type="number" value={form.discountPrice} onChange={set('discountPrice')} /></Field>
            <Field label="Quantity *"><input className="admin-input" type="number" value={form.quantity} onChange={set('quantity')} required /></Field>
            <Field label="Rating (1–5) *"><input className="admin-input" type="number" min="1" max="5" value={form.rating} onChange={set('rating')} required /></Field>
          </div>
          <Field label="Cover Photo URL or filename *">
            <input className="admin-input" value={form.coverPhoto} onChange={set('coverPhoto')} required placeholder="https://... or filename.jpg" />
          </Field>
          <div className="admin-form__row">
            <Field label="Category *">
              <select className="admin-input" value={form.category} onChange={set('category')} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Brand *">
              <select className="admin-input" value={form.brand} onChange={set('brand')} required>
                <option value="">Select brand</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </Field>
            <Field label="Subcategory">
              <select className="admin-input" value={form.subCategory} onChange={set('subCategory')}>
                <option value="">None</option>
                {subCats.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </Field>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="admin-save-btn">{editItem ? 'Save Changes' : 'Create Product'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Price</th><th>Qty</th><th>Sold</th><th>Category</th><th>Brand</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="admin-empty-row">No products found.</td></tr>}
            {filtered.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>EGP {p.discountPrice || p.price}{p.discountPrice && <span className="old-price"> EGP {p.price}</span>}</td>
                <td><span className={p.quantity < 5 ? 'stock-low' : ''}>{p.quantity}</span></td>
                <td>{p.quantityOfSoldProduct || 0}</td>
                <td>{p.category?.name || '—'}</td>
                <td>{p.brand?.name || '—'}</td>
                <td><div className="admin-table__actions">
                  <button className="admin-edit-btn" onClick={() => openEdit(p)}>Edit</button>
                  <button className="admin-del-btn"  onClick={() => del(p._id)}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesTab({ show }) {
  const [categories, setCategories] = useState([]);
  const [name, setName]             = useState('');
  const [confirm, setConfirm]       = useState(null);

  const load = () => apiFetch('GET', '/services/categoryServices').then(d => setCategories(d.data?.category || []));
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', name);
      await apiFetch('POST', '/services/categoryServices', fd);
      show('Category created!'); setName(''); load();
    } catch(err) { show(err.message, 'err'); }
  };

  const del = (id, n) => setConfirm({
    msg: `Delete category "${n}"?`,
    onYes: async () => {
      try { await apiFetch('DELETE', `/services/categoryServices/${id}`); show('Deleted.'); load(); }
      catch(err) { show(err.message, 'err'); }
      setConfirm(null);
    },
    onNo: () => setConfirm(null),
  });

  return (
    <div>
      {confirm && <Confirm {...confirm} />}
      <h2 className="admin-content__title">Categories ({categories.length})</h2>
      <form className="admin-inline-form" onSubmit={submit}>
        <input className="admin-input" placeholder="Category name" value={name} onChange={e => setName(e.target.value)} required />
        <button type="submit" className="admin-save-btn">Add Category</button>
      </form>
      <div className="admin-chip-list">
        {categories.map(c => (
          <div key={c._id} className="admin-chip">
            <span>{c.name}</span>
            <button onClick={() => del(c._id, c.name)} title="Delete">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandsTab({ show }) {
  const [brands,  setBrands]  = useState([]);
  const [name,    setName]    = useState('');
  const [confirm, setConfirm] = useState(null);

  const load = () => apiFetch('GET', '/services/brandServices').then(d => setBrands(d.data?.brands || []));
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', name);
      await apiFetch('POST', '/services/brandServices', fd);
      show('Brand created!'); setName(''); load();
    } catch(err) { show(err.message, 'err'); }
  };

  const del = (id, n) => setConfirm({
    msg: `Delete brand "${n}"?`,
    onYes: async () => {
      try { await apiFetch('DELETE', `/services/brandServices/${id}`); show('Deleted.'); load(); }
      catch(err) { show(err.message, 'err'); }
      setConfirm(null);
    },
    onNo: () => setConfirm(null),
  });

  return (
    <div>
      {confirm && <Confirm {...confirm} />}
      <h2 className="admin-content__title">Brands ({brands.length})</h2>
      <form className="admin-inline-form" onSubmit={submit}>
        <input className="admin-input" placeholder="Brand name" value={name} onChange={e => setName(e.target.value)} required />
        <button type="submit" className="admin-save-btn">Add Brand</button>
      </form>
      <div className="admin-chip-list">
        {brands.map(b => (
          <div key={b._id} className="admin-chip">
            <span>{b.name}</span>
            <button onClick={() => del(b._id, b.name)} title="Delete">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CouponsTab({ show }) {
  const [coupons,  setCoupons]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirm,  setConfirm]  = useState(null);

  const empty = { name:'', discount:'', expire:'' };
  const [form, setForm] = useState(empty);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = () => apiFetch('GET', '/servics/coupons').then(d => setCoupons(d.data?.coupons || []));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditItem(null); setShowForm(true); };
  const openEdit = c => {
    setForm({ name: c.name, discount: c.discount, expire: c.expire?.slice(0,10) || '' });
    setEditItem(c); setShowForm(true);
  };

  const submit = async e => {
    e.preventDefault();
    try {
      const body = { ...form, discount: Number(form.discount) };
      if (editItem) {
        await apiFetch('PATCH', `/servics/coupons/updateCoupon/${editItem._id}`, body);
        show('Coupon updated!');
      } else {
        await apiFetch('POST', '/servics/coupons/createCoupon', body);
        show('Coupon created!');
      }
      setShowForm(false); load();
    } catch(err) { show(err.message, 'err'); }
  };

  const del = (id, n) => setConfirm({
    msg: `Delete coupon "${n}"?`,
    onYes: async () => {
      try { await apiFetch('DELETE', `/servics/coupons/deleteCoupon/${id}`); show('Deleted.'); load(); }
      catch(err) { show(err.message, 'err'); }
      setConfirm(null);
    },
    onNo: () => setConfirm(null),
  });

  return (
    <div>
      {confirm && <Confirm {...confirm} />}
      <div className="admin-section-header">
        <h2 className="admin-content__title">Coupons ({coupons.length})</h2>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Coupon</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={submit}>
          <h3 className="admin-form__title">{editItem ? 'Edit Coupon' : 'New Coupon'}</h3>
          <div className="admin-form__row">
            <Field label="Coupon Code *"><input className="admin-input" value={form.name} onChange={set('name')} required placeholder="e.g. SAVE20" /></Field>
            <Field label="Discount % *"><input className="admin-input" type="number" min="1" max="100" value={form.discount} onChange={set('discount')} required /></Field>
            <Field label="Expiry Date *"><input className="admin-input" type="date" value={form.expire} onChange={set('expire')} required /></Field>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="admin-save-btn">{editItem ? 'Save Changes' : 'Create Coupon'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Discount</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {coupons.length === 0 && <tr><td colSpan={5} className="admin-empty-row">No coupons found.</td></tr>}
            {coupons.map(c => {
              const expired = new Date(c.expire) < new Date();
              return (
                <tr key={c._id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.discount}% off</td>
                  <td>{new Date(c.expire).toLocaleDateString()}</td>
                  <td><span className={`status-pill ${expired ? 'unpaid' : 'paid'}`}>{expired ? 'Expired' : 'Active'}</span></td>
                  <td><div className="admin-table__actions">
                    <button className="admin-edit-btn" onClick={() => openEdit(c)}>Edit</button>
                    <button className="admin-del-btn"  onClick={() => del(c._id, c.name)}>Delete</button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab({ show }) {
  const [orders,  setOrders]  = useState([]);
  const [filter,  setFilter]  = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch('GET', '/servics/order/getAllorders')
      .then(d => setOrders(d.orders || []))
      .catch(() => show('Failed to load orders', 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    if (filter === 'unpaid')      return !o.isPaid;
    if (filter === 'paid')        return o.isPaid;
    if (filter === 'undelivered') return !o.isDelivered;
    if (filter === 'delivered')   return o.isDelivered;
    return true;
  });

  const markPaid = async (id) => {
    await apiFetch('PATCH', `/servics/order/isPaid/${id}`);
    setOrders(prev => prev.map(o => o._id === id ? { ...o, isPaid: true } : o));
    show('Marked as paid.');
  };

  const markDelivered = async (id) => {
    await apiFetch('PATCH', `/servics/order/isDelivered/${id}`);
    setOrders(prev => prev.map(o => o._id === id ? { ...o, isDelivered: true } : o));
    show('Marked as delivered.');
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-content__title">Orders ({orders.length})</h2>
        <div className="admin-filter-row">
          {['all','unpaid','paid','undelivered','delivered'].map(f => (
            <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="admin-loading">Loading orders…</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>
            <th>Order ID</th><th>Customer</th><th>Items</th>
            <th>Total</th><th>Method</th><th>Paid</th><th>Delivered</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={8} className="admin-empty-row">No orders found.</td></tr>}
            {filtered.map(o => (
              <tr key={o._id}>
                <td style={{ fontFamily:'monospace', fontSize:11 }}>#{o._id?.slice(-8)}</td>
                <td>{o.user?.name || '—'}</td>
                <td style={{ fontSize:12, color:'var(--muted)' }}>
                  {o.cartItems?.map(i => `${i.product?.title || '?'} ×${i.quantity}`).join(', ')}
                </td>
                <td><strong>EGP {o.totalPrice}</strong></td>
                <td><span className={`method-pill method-pill--${o.paymentMethod}`}>{o.paymentMethod}</span></td>
                <td><span className={`status-pill ${o.isPaid ? 'paid' : 'unpaid'}`}>
                  {o.isPaid ? `✓ ${o.paidAt ? new Date(o.paidAt).toLocaleDateString() : ''}` : 'Unpaid'}
                </span></td>
                <td><span className={`status-pill ${o.isDelivered ? 'delivered' : 'pending'}`}>
                  {o.isDelivered ? `✓` : 'Pending'}
                </span></td>
                <td><div className="admin-table__actions">
                  {!o.isPaid      && <button className="admin-edit-btn" onClick={() => markPaid(o._id)}>Mark Paid</button>}
                  {!o.isDelivered && <button className="admin-edit-btn" onClick={() => markDelivered(o._id)}>Mark Delivered</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsTab({ show }) {
  const [products, setProducts] = useState([]);
  const [selProd,  setSelProd]  = useState('');
  const [reviews,  setReviews]  = useState([]);
  const [confirm,  setConfirm]  = useState(null);

  useEffect(() => {
    apiFetch('GET', '/services/products?limit=1000')
      .then(d => setProducts(d.data?.products || []));
  }, []);

  useEffect(() => {
    if (!selProd) return;
    apiFetch('GET', `/services/products/${selProd}/reviews/getAllReviews`)
      .then(d => setReviews(d.reviews || d.data?.reviews || []))
      .catch(() => show('Failed to load reviews', 'err'));
  }, [selProd]);

  const del = (productId, reviewId) => setConfirm({
    msg: 'Delete this review?',
    onYes: async () => {
      try {
        await apiFetch('DELETE', `/services/products/${productId}/reviews/deleteRiview/${reviewId}`);
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        show('Review deleted.');
      } catch(err) { show(err.message, 'err'); }
      setConfirm(null);
    },
    onNo: () => setConfirm(null),
  });

  return (
    <div>
      {confirm && <Confirm {...confirm} />}
      <h2 className="admin-content__title">Reviews</h2>
      <div style={{ marginBottom: 24 }}>
        <select className="admin-input" value={selProd} onChange={e => setSelProd(e.target.value)}
          style={{ maxWidth: 340 }}>
          <option value="">Select a product to see its reviews</option>
          {products.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
      </div>

      {selProd && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Rating</th><th>Title</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {reviews.length === 0 && <tr><td colSpan={5} className="admin-empty-row">No reviews for this product.</td></tr>}
              {reviews.map(r => (
                <tr key={r._id}>
                  <td>{r.user?.name || '—'}</td>
                  <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td>{r.title}</td>
                  <td style={{ fontSize:12 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td><button className="admin-del-btn" onClick={() => del(selProd, r._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="admin-form__field">
      <label className="admin-form__label">{label}</label>
      {children}
    </div>
  );
}