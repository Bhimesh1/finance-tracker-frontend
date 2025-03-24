import api from './axiosConfig';

export const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategoriesByType = async (type) => {
  const response = await api.get(`/categories/type/${type}`);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};