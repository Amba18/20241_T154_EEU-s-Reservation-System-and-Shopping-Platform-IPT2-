import axios from 'axios';

export const getUser = () =>
  localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

export const login = async (email, password, captchaToken) => {
  try {
    const { data } = await axios.post('/api/users/login', { email, password, captchaToken });
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message); // Improved logging
    throw error;
  }
};

export const register = async (registerData) => {
  try {
    const { data } = await axios.post('/api/users/register', registerData);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message); // Improved logging
    throw error;
  }
};

export const loginWithGoogle = async (tokenId) => {
  try {
    const { data } = await axios.post('/api/users/google-login', { tokenId });
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Google login error:', error.response?.data || error.message); // Improved logging
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const updateProfile = async (user) => {
  try {
    const { data } = await axios.put('/api/users/updateProfile', user);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error.message); // Improved logging
    throw error;
  }
};

export const changePassword = async (passwords) => {
  try {
    await axios.put('/api/users/changePassword', passwords);
  } catch (error) {
    console.error('Change password error:', error.response?.data || error.message); // Improved logging
    throw error;
  }
};

export const getAll = async (searchTerm) => {
  const { data } = await axios.get('/api/users/getAll/' + (searchTerm ?? ''));
  return data;
};

export const toggleBlock = async (userId) => {
  const { data } = await axios.put('/api/users/toggleBlock/' + userId);
  return data;
};

export const getById = async (userId) => {
  const { data } = await axios.get('/api/users/getById/' + userId);
  return data;
};

export const updateUser = async (userData) => {
  const { data } = await axios.put('/api/users/update', userData);
  return data;
};

