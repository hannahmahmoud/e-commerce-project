import { useState, useEffect } from 'react';
import * as api from '../../api';
import { useAuth } from '../../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetailPage({ productId, onBack, onCartUpdate }) {
  const { token } = useAuth();
  const [product, setProduct]     = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [qty, setQty]             = useState(1);
  const [adding, setAdding]       = useState(false);
  const [toast, setToast]         = useState('');
  const [reviewTitle, setReviewTitle]   = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting]     = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getProduct(productId),
      api.getProductReviews(productId),
    ])
      .then(([pRes, rRes]) => {
        setProduct(pRes.data?.product);
        setReviews(rRes.data?.reviews || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const addToCart = async () => {
    if (!token) return showToast('Please log in first');
    setAdding(true);
    try {
      await api.addToCart({ productID: productId, quantity: qty, color: product.color });
      onCartUpdate?.();
      showToast('Added to cart!');
    } catch (err) {
      showToast(err.message);
    } finally {
      setAdding(false);
    }
  };

  const addToWishlist = async () => {
    if (!token) return showToast('Please log in first');
    try {
      await api.addToWishlist({ productID: productId });
      showToast('Added to wishlist!');
    } catch (err) {
      showToast(err.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return showToast('Please log in to review');
    setSubmitting(true);
    try {
      const r = await api.createReview(productId, {
        title: reviewTitle,
        rating: reviewRating,
        product: productId,
      });
      setReviews(prev => [r.newRiview, ...prev]);
      setReviewTitle('');
      setReviewRating(5);
      showToast('Review submitted!');
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="detail-loading">Loading…</div>;
  if (!product) return <div className="detail-loading">Product not found.</div>;

  const price      = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discPct    = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : null;
  const stars      = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
  const avgRating  = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="detail-wrap">
      {toast && <div className="toast">{toast}</div>}

      <button className="detail-wrap__back" onClick={onBack}>← Back</button>

      <div className="detail-grid">
        {/* Image */}
        <div className="detail-img">
          {product.coverPhoto
            ? <img src={product.coverPhoto?.startsWith('http')
  ? product.coverPhoto
  : `http://localhost:4000/uploads/${product.coverPhoto}`} alt={product.title}
                onError={e => e.target.style.display = 'none'} />
            : <span className="detail-img__placeholder">🖼️</span>
          }
        </div>

        {/* Info */}
        <div className="detail-info">
          <p className="detail-info__brand">{product.brand?.name} · {product.category?.name}</p>
          <h1 className="detail-info__title">{product.title}</h1>
          <p className="detail-info__category">
            {product.subCategory?.map(s => s.name).join(', ')}
          </p>

          <div className="detail-info__rating">
            <span className="detail-info__stars">
              {stars(Math.round(product.ratingAverage || product.rating || 0))}
            </span>
            <span className="detail-info__rating-count">
              {avgRating} ({reviews.length} reviews)
            </span>
          </div>

          <div className="detail-info__price-row">
            <span className="detail-info__price">EGP{price}</span>
            {hasDiscount && <span className="detail-info__old-price">${product.price}</span>}
            {discPct && <span className="detail-info__disc-badge">{discPct}% off</span>}
          </div>

          <p className="detail-info__desc">{product.description}</p>

          <div className="detail-info__meta">
            <span className="detail-info__chip">Color: {product.color}</span>
            <span className="detail-info__chip">In stock: {product.quantity}</span>
            <span className="detail-info__chip">Sold: {product.quantityOfSoldProduct}</span>
          </div>

          <div className="detail-actions">
            <div className="detail-qty">
              <button className="detail-qty__btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="detail-qty__num">{qty}</span>
              <button className="detail-qty__btn" onClick={() => setQty(q => Math.min(product.quantity, q + 1))}>+</button>
            </div>
            <button className="detail-cart-btn" onClick={addToCart} disabled={adding}>
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
            <button className="detail-wish-btn" onClick={addToWishlist} title="Wishlist">♡</button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="review-section">
        <h2 className="review-section__title">Reviews ({reviews.length})</h2>

        {token && (
          <form className="review-form" onSubmit={submitReview}>
            <p className="review-form__title">Write a review</p>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  className={`star-pick ${n <= reviewRating ? 'on' : ''}`}
                  onClick={() => setReviewRating(n)}
                >★</span>
              ))}
            </div>
            <input
              className="field-input"
              placeholder="Review title…"
              value={reviewTitle}
              onChange={e => setReviewTitle(e.target.value)}
              required
            />
            <button className="review-submit" type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        )}

        <div className="review-list">
          {reviews.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No reviews yet.</p>
          )}
          {reviews.map(r => (
            <div key={r._id} className="review-card">
              <div className="review-card__top">
                <span className="review-card__user">{r.user?.name || 'User'}</span>
                <span className="review-card__stars">{stars(r.rating)}</span>
              </div>
              <p className="review-card__title">{r.title}</p>
              <p className="review-card__date">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
