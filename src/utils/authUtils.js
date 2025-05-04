import axios from 'axios';

export const verifySession = async (token) => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.get('http://localhost:30011/api/auth/session');
    return response.data;
  } catch (error) {
    console.error('Session verification failed:', error.response?.data || error.message);
    throw error;
  }
};

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const removeAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
}; 