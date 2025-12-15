import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = async (username, password) => {
    if (username === 'admin' && password === '123') { 
       const u = { username, token: 'fake-jwt-token' };
       setUser(u);
       localStorage.setItem('user', JSON.stringify(u));
       navigate('/');
       return true;
    }
    return false;
  };

  const register = async (username, password, email) => {
    return true; 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);