import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { verifySession, setAuthToken, removeAuthToken } from '../utils/authUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('userRole');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await verifySession(token);
        setUser({
          ...userData,
          token,
          role: userData.role || storedRole // Ensure role is preserved
        });
      } catch (error) {
        console.warn('Auth verification failed:', error.message);
        // Clear all auth data on verification failure
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    if (!userData?.token) {
      console.error('Login failed: No token provided');
      return;
    }

    const userWithRole = {
      ...userData,
      role: userData.role // Ensure role is included
    };
    setUser(userWithRole);
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userRole', userData.role); // Store role separately
    setAuthToken(userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    removeAuthToken();
    navigate('/login');
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 