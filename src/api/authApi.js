// src/api/authApi.js
import api from './axiosConfig';

export const login = async (email, password) => {
  const response = await api.post('/auth/signin', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.data.id,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email
    }));
  }
  return response.data;
};

export const register = async (firstName, lastName, email, password) => {
  return api.post('/auth/signup', { firstName, lastName, email, password });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};