import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Backend JWT payload is { foundUser: { _id, name, email, role, ... } }
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.foundUser || payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(() => {
    const t = localStorage.getItem('token');
    if (t) return decodeToken(t);
    return null;
  });
  const [cartCount, setCartCount] = useState(0);

  const loginUser = useCallback((newToken) => {
    const decoded = decodeToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(decoded));
    setToken(newToken);
    setUser(decoded);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCartCount(0);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, loginUser, logout, cartCount, setCartCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
