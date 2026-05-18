import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import './Auth.css';

export default function AuthPage() {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]     = useState('');
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser }         = useAuth();
  const navigate              = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await api.login({ email: form.email, password: form.password });
        loginUser(data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const loggedUser = payload.foundUser || payload;
        if (loggedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else if (mode === 'signup') {
        await api.signup({
          name: form.name, email: form.email,
          password: form.password, confirmPassword: form.confirmPassword,
        });
        setMsg('Account created! Please log in.');
        setMode('login');
      } else {
        await api.forgotPassword({ email: form.email });
        setMsg('Reset link sent to your email.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login:  { title: 'Welcome back',   subtitle: 'Sign in to your account' },
    signup: { title: 'Create account', subtitle: 'Join us today' },
    forgot: { title: 'Reset password', subtitle: "We'll send a link to your email" },
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-card__top">
          <div className="auth-card__icon">🍽️</div>
          <h2 className="auth-card__title">{titles[mode].title}</h2>
          <p className="auth-card__subtitle">{titles[mode].subtitle}</p>
        </div>

        {error && <div className="error-box">{error}</div>}
        {msg   && <div className="success-box">{msg}</div>}

        <form className="auth-card__form" onSubmit={submit}>
          {mode === 'signup' && (
            <div className="auth-card__field">
              <label>Full name</label>
              <input className="field-input" placeholder="Your name" value={form.name} onChange={set('name')} required />
            </div>
          )}
          <div className="auth-card__field">
            <label>Email</label>
            <input className="field-input" placeholder="you@email.com" type="email" value={form.email} onChange={set('email')} required />
          </div>
          {mode !== 'forgot' && (
            <div className="auth-card__field">
              <label>Password</label>
              <input className="field-input" placeholder="••••••••" type="password" value={form.password} onChange={set('password')} required />
            </div>
          )}
          {mode === 'signup' && (
            <div className="auth-card__field">
              <label>Confirm password</label>
              <input className="field-input" placeholder="••••••••" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>
          )}
          <button className="primary-btn" type="submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Sign up' : 'Send reset link'}
          </button>
        </form>

        <div className="auth-card__links">
          {mode === 'login' && (
            <>
              <button className="auth-card__link" onClick={() => setMode('signup')}>Create account</button>
              <button className="auth-card__link" onClick={() => setMode('forgot')}>Forgot password?</button>
            </>
          )}
          {mode !== 'login' && (
            <button className="auth-card__link" onClick={() => setMode('login')}>← Back to login</button>
          )}
        </div>
      </div>
    </div>
  );
}
