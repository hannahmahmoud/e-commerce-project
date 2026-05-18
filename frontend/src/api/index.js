const BASE = 'http://localhost:4000';

const getToken = () => localStorage.getItem('token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  // 204 No Content — backend returns empty body, don't try to parse JSON
  if (res.status === 204) return {};

  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.Message)
      ? data.Message.map(e => e.msg || e.message || e).join(', ')
      : data.Message || data.message || 'Something went wrong';
    throw new Error(msg);
  }
  return data;
};

// AUTH  — /services/users/*
export const signup   = (body) => req('POST', '/services/users/signup', body);
export const login    = (body) => req('POST', '/services/users/login', body);
export const forgotPassword = (body) => req('POST', '/services/users/forgetPassword', body);
export const resetPassword  = (token, body) => req('PATCH', `/services/users/resetPassword/${token}`, body);

// USER  — /servics/users/*
export const updateUser     = (body) => req('PATCH', '/servics/users/updateUser', body);
export const updatePassword = (body) => req('PATCH', '/servics/users/updatePassword', body);
export const deleteAccount  = ()     => req('DELETE', '/servics/users/deleteUser');

// PRODUCTS  — /services/products/*
export const getProducts  = (query = '') => req('GET', `/services/products${query}`);
export const getProduct   = (id)         => req('GET', `/services/products/${id}`);

// CATEGORIES  — /services/categoryServices/*
export const getCategories = () => req('GET', '/services/categoryServices');
export const getCategory   = (id) => req('GET', `/services/categoryServices/${id}`);

// SUBCATEGORIES  — /services/subCategoryServices/*
export const getSubCategories = (categoryId = '') =>
  req('GET', `/services/subCategoryServices${categoryId ? `?category=${categoryId}` : ''}`);

// BRANDS  — /services/brandServices/*
export const getBrands = () => req('GET', '/services/brandServices');

// REVIEWS  — /servics/reviews/*  &  nested /services/products/:id/reviews/*
export const getProductReviews = (productId) => req('GET', `/services/products/${productId}/reviews/getAllReviews`);
export const createReview      = (productId, body) => req('POST', `/services/products/${productId}/reviews`, body);
export const updateReview      = (productId, reviewId, body) => req('PATCH', `/services/products/${productId}/reviews/updateRiview/${reviewId}`, body);
export const deleteReview      = (productId, reviewId) => req('DELETE', `/services/products/${productId}/reviews/deleteRiview/${reviewId}`);
export const getReviewStats    = (productId) => req('GET', `/services/products/${productId}/reviews/stats/${productId}`);

// CART  — /servics/cart/*
export const getCart        = ()          => req('GET',    '/servics/cart/getCart');
export const addToCart      = (body)      => req('POST',   '/servics/cart/addProduct', body);
export const updateCartQty  = (productId, body) => req('PATCH', `/servics/cart/updateQuantity/${productId}`, body);
export const removeFromCart = (itemId)    => req('DELETE', `/servics/cart/deleteProduct/${itemId}`);
export const clearCart      = ()          => req('DELETE', '/servics/cart/deleteCart');
export const applyCoupon    = (body)      => req('PATCH',  '/servics/cart/applyCoupon', body);

// ORDERS  — /servics/order/*
export const createCashOrder    = (cartId, body) => req('POST',  `/servics/order/createOrder/${cartId}`, body);
export const getMyOrder         = ()              => req('GET',   '/servics/order/getorders');
export const createStripeSession = (cartId)       => req('POST',  `/servics/order/checkout-session/${cartId}`);

// WISHLIST  — /servics/wishList/*
export const getWishlist          = ()         => req('GET',    '/servics/wishList/getAllProductsfromWishList');
export const addToWishlist        = (body)     => req('POST',   '/servics/wishList/addProductToWishList', body);
export const removeFromWishlist   = (productId)=> req('DELETE', `/servics/wishList/removeProductfromWishList/${productId}`);

// ADDRESS  — /servics/users/address/*
export const getAddresses   = ()          => req('GET',    '/servics/users/address/getAllAddressOfUser');
export const addAddress     = (body)      => req('POST',   '/servics/users/address/addUserAddress', body);
export const removeAddress  = (addressId) => req('DELETE', `/servics/users/address/removeAddress/${addressId}`);
