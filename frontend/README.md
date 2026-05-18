# E-Commerce Frontend

React frontend built specifically for the Node.js/Express/MongoDB backend from `e-commerce-project-main`.

## Quick Start

```bash
# 1. Make sure your backend is running on port 4000
cd e-commerce-project-main
node Server/server.js

# 2. Install and start the frontend
cd ecommerce-frontend
npm install
npm run dev

# 3. Open http://localhost:5173
```

## Pages & Features

### Products page (`/`)
- Browse all products with category, brand, price range filters
- Sort by newest / price / rating
- Pagination (12 per page)
- Search by title (client-side)
- "Add to cart" directly from the list
- Click any product to see the full detail page

### Product detail page
- Full product info: description, color, stock, ratings
- Quantity selector before adding to cart
- Add to wishlist button
- Read and write reviews (login required)

### Cart page
- View all items, update quantity, remove items
- Apply coupon code
- Adjust shipping and tax amounts
- **Pay with cash** → creates order instantly
- **Pay with card** → redirects to Stripe checkout

### Profile page (login required)
- **My Order** tab: see your latest order with paid/delivered status
- **Wishlist** tab: view and remove wishlisted products
- **Addresses** tab: add / remove shipping addresses
- **Account** tab: update name/email, change password

### Admin panel (admin role only)
- View all orders
- Mark orders as paid or delivered

## Exact API Endpoints Used

All endpoints match the backend exactly — including the typo `/servics/` vs `/services/`:

| Feature | Endpoint |
|---------|----------|
| Signup | POST `/services/users/signup` |
| Login | POST `/services/users/login` |
| Forgot password | POST `/services/users/forgetPassword` |
| Get products | GET `/services/products?...` |
| Get categories | GET `/services/categoryServices` |
| Get brands | GET `/services/brandServices` |
| Get cart | GET `/servics/cart/getCart` |
| Add to cart | POST `/servics/cart/addProduct` |
| Update qty | PATCH `/servics/cart/updateQuantity/:productID` |
| Remove item | DELETE `/servics/cart/deleteProduct/:id` |
| Apply coupon | PATCH `/servics/cart/applyCoupon` |
| Cash order | POST `/servics/order/createOrder/:cartID` |
| Stripe session | POST `/servics/order/checkout-session/:cartID` |
| My order | GET `/servics/order/getorders` |
| Wishlist | GET/POST/DELETE `/servics/wishList/...` |
| Addresses | GET/POST/DELETE `/servics/users/address/...` |
| Reviews | GET/POST `/services/products/:id/reviews/...` |

## Auth

After login the JWT is saved to `localStorage` under the key `token`.
Every protected request sends it as: `Authorization: Bearer <token>`

## Project Structure

```
src/
├── api/index.js          ← all fetch calls in one file
├── context/AuthContext.jsx ← token, user, cartCount state
├── components/
│   └── Navbar.jsx
├── pages/
│   ├── AuthPage.jsx       ← login / signup / forgot password
│   ├── ProductsPage.jsx   ← listing with filters
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── ProfilePage.jsx
│   └── AdminPage.jsx
└── App.jsx                ← routing + theme toggle
```
