import { useState, useEffect, useCallback } from 'react';
import * as api from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Products.css';

export default function ProductsPage({ onProductClick, onCartUpdate }) {
  const { token } = useAuth();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [addingId, setAddingId]     = useState(null);
  const [toast, setToast]           = useState('');
  const [search, setSearch]         = useState('');
  const [catId, setCatId]           = useState('');
  const [brandId, setBrandId]       = useState('');
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [sort, setSort]             = useState('-createdAt');
  const [page, setPage]             = useState(1);
  const LIMIT = 12;

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams();
    p.set('limit', LIMIT);
    p.set('page', page);
    p.set('sort', sort);
    if (catId)    p.set('category', catId);
    if (brandId)  p.set('brand', brandId);
    if (minPrice) p.set('price[gte]', minPrice);
    if (maxPrice) p.set('price[lte]', maxPrice);
    return '?' + p.toString();
  }, [catId, brandId, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    api.getCategories().then(d => setCategories(d.data?.categories || [])).catch(() => {});
    api.getBrands().then(d => setBrands(d.data?.brands || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getProducts(buildQuery())
      .then(d => setProducts(d.data?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [buildQuery]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const addToCart = async (e, product) => {
    e.stopPropagation();
    if (!token) return showToast('Please log in first');
    setAddingId(product._id);
    try {
      await api.addToCart({ productID: product._id, quantity: 1, color: product.color });
      onCartUpdate?.();
      showToast(`EGP{product.title} added to cart`);
    } catch (err) {
      showToast(err.message);
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-wrap">
      {toast && <div className="toast">{toast}</div>}

      {/* Sidebar */}
      <aside className="products-sidebar">
        <h3 className="products-sidebar__title">Filters</h3>

        <div className="filter-section">
          <label className="filter-section__label">Category</label>
          <select className="filter-select" value={catId}
            onChange={e => { setCatId(e.target.value); setPage(1); }}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-section__label">Brand</label>
          <select className="filter-select" value={brandId}
            onChange={e => { setBrandId(e.target.value); setPage(1); }}>
            <option value="">All brands</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-section__label">Price range</label>
          <div className="price-row">
            <input className="price-input" placeholder="Min" type="number"
              value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            <input className="price-input" placeholder="Max" type="number"
              value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
        </div>

        <button className="filter-btn" onClick={() => setPage(1)}>Apply filters</button>
        <button className="clear-btn" onClick={() => { setCatId(''); setBrandId(''); setMinPrice(''); setMaxPrice(''); setPage(1); }}>
          Clear all
        </button>
      </aside>

      {/* Main */}
      <main className="products-main">
        <div className="products-topbar">
          <input className="products-search" placeholder="Search products…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="products-sort" value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}>
            <option value="-createdAt">Newest</option>
            <option value="price">Price: low → high</option>
            <option value="-price">Price: high → low</option>
            <option value="-rating">Top rated</option>
          </select>
        </div>

        {loading ? (
          <div className="products-loading">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No products found.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                onClick={() => onProductClick?.(p._id)}
                onAdd={(e) => addToCart(e, p)}
                adding={addingId === p._id}
              />
            ))}
          </div>
        )}

        <div className="products-pagination">
          <button className="products-pagination__btn" disabled={page === 1}
            onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="products-pagination__info">Page {page}</span>
          <button className="products-pagination__btn" disabled={filtered.length < LIMIT}
            onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      </main>
    </div>
  );
}

function ProductCard({ product: p, onClick, onAdd, adding }) {
  const price      = p.discountPrice || p.price;
  const hasDiscount = p.discountPrice && p.discountPrice < p.price;
  const discPct    = hasDiscount ? Math.round((1 - p.discountPrice / p.price) * 100) : null;
  const stars      = '★'.repeat(Math.round(p.ratingAverage || p.rating || 0)) +
                     '☆'.repeat(5 - Math.round(p.ratingAverage || p.rating || 0));

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-card__img">
        {p.coverPhoto
          ? <img src={p.coverPhoto?.startsWith('http')
  ? p.coverPhoto
  : `http://localhost:4000/uploads/${p.coverPhoto}`} alt={p.title}
              onError={e => e.target.style.display = 'none'} />
          : <span className="product-card__img-placeholder">🖼️</span>
        }
        {discPct && <span className="product-card__discount">{discPct}% off</span>}
      </div>

      <div className="product-card__body">
        <p className="product-card__brand">{p.brand?.name || ''}</p>
        <h3 className="product-card__name">{p.title}</h3>
        <div className="product-card__stars">
          {stars} <span className="product-card__rating-count">({p.ratingQuantity || 0})</span>
        </div>
        <div className="product-card__price-row">
          <span className="product-card__price">EGP{price}</span>
          {hasDiscount && <span className="product-card__old-price">EGP{p.price}</span>}
        </div>
        {p.color && (
          <div className="product-card__color">
            <span className="product-card__color-dot"
              style={{ background: p.color.toLowerCase() }} />
            <span className="product-card__color-name">{p.color}</span>
          </div>
        )}
        <button
          className="product-card__add-btn"
          onClick={onAdd}
          disabled={adding}
        >
          {adding ? 'Adding…' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
