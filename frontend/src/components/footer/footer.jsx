import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">

        <div className="footer__brand">
          <div className="footer__logo">CloudKitchen</div>
          <p className="footer__tagline">
            Commercial kitchens built for delivery. Fast, fresh, and reliable.
          </p>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Navigate</h4>
          <Link to="/"         className="footer__link">Home</Link>
          <Link to="/products" className="footer__link">Products</Link>
          <Link to="/profile"  className="footer__link">Profile</Link>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Contact</h4>
          <p className="footer__text">📧 hello@cloudkitchen.com</p>
          <p className="footer__text">📞 +20 100 000 0000</p>
          <p className="footer__text">📍 Cairo, Egypt</p>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Follow Us</h4>
          <div className="footer__socials">
            <a className="footer__social-btn" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="footer__social-btn" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a className="footer__social-btn" href="https://twitter.com"  target="_blank" rel="noreferrer">X / Twitter</a>
          </div>
        </div>

      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} CloudKitchen. All rights reserved.</p>
      </div>
    </footer>
  );
}
