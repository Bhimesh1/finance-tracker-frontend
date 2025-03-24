import api from './axiosConfig';

export const getAllBudgets = async () => {
  const response = await api.get('/budgets');
  return response.data;
};

export const getBudgetsByPeriod = async (year, month) => {
  const response = await api.get(`/budgets/period/${year}/${month}`);
  return response.data;
};

export const getBudgetById = async (id) => {
  const response = await api.get(`/budgets/${id}`);
  return response.data;
};

export const createBudget = async (budgetData) => {
  const response = await api.post('/budgets', budgetData);
  return response.data;
};

export const updateBudget = async (id, budgetData) => {
  const response = await api.put(`/budgets/${id}`, budgetData);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};