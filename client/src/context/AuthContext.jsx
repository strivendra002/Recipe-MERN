import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user when app loads
  const fetchUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('https://recipe-mern-noa1.onrender.com/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (error) {
      console.error('❌ Error fetching user:', error);

      if (error.response?.status === 401) {
        logout(); // 🔹 Auto logout on invalid token
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login function (Stores JWT token)
  const login = async (email, password) => {
    try {
      const res = await axios.post('https://recipe-mern-noa1.onrender.com/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  // 🔹 Logout function (Removes JWT token)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
