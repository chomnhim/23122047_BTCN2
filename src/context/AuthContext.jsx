import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-app-token': appToken },
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) throw new Error('Login failed');

      const result = await res.json();
      const apiData = result.data || result;
      
      const userData = { ...apiData, username: username };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
      return true;
    } catch (e) {
      return false;
    }
  };

  const register = async (username, password, email) => {
    try {
      const res = await fetch('/api/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-app-token': appToken },
        body: JSON.stringify({ username, password, email })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    fetch('/api/api/users/logout', { 
        method: 'POST', 
        headers: { 'x-app-token': appToken } 
    }).finally(() => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);