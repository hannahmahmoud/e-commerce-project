import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ cartCount }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__logo">
        Cloud<span>Kitchen</span>
      </NavLink>

      <div className="navbar__links">
        <NavLink to="/" end className={({ isActive }) => `navbar__btn ${isActive ? 'active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `navbar__btn ${isActive ? 'active' : ''}`}>
          Products
        </NavLink>
        {user && (
          <NavLink to="/cart" className={({ isActive }) => `navbar__btn ${isActive ? 'active' : ''}`}>
            Cart
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </NavLink>
        )}
        {user && (
          <NavLink to="/profile" className={({ isActive }) => `navbar__btn ${isActive ? 'active' : ''}`}>
            Profile
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `navbar__btn ${isActive ? 'active' : ''}`}>
            Admin
          </NavLink>
        )}
      </div>

      <div className="navbar__right">
        {user ? (
          <>
            <div className="navbar__avatar">
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <span className="navbar__user-label">
              Hi, {user.name?.split(' ')[0] || 'User'}
            </span>
            <button className="navbar__logout" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="navbar__login">
            Log in
          </NavLink>
        )}
      </div>
    </nav>
  );
}
