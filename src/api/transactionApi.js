import api from './axiosConfig';

export const getTransactions = async (page = 0, size = 10) => {
  const response = await api.get('/transactions', {
    params: { page, size }
  });
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const getTransactionsByDateRange = async (startDate, endDate) => {
  const response = await api.get('/transactions/date-range', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getTransactionsByAccount = async (accountId) => {
  const response = await api.get(`/transactions/account/${accountId}`);
  return response.data;
};

export const getTransactionsByCategory = async (categoryId) => {
  const response = await api.get(`/transactions/category/${categoryId}`);
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};