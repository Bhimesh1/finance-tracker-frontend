import api from './axiosConfig';

export const getDashboardSummary = async () => {
  const response = await api.get('/analytics/dashboard-summary');
  return response.data;
};

export const getExpensesByCategory = async (startDate, endDate) => {
  const response = await api.get('/analytics/expenses-by-category', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getCashFlowForMonth = async (year, month) => {
  const response = await api.get(`/analytics/cash-flow/${year}/${month}`);
  return response.data;
};

export const getMonthlySummary = async (startYear, startMonth, endYear, endMonth) => {
  const response = await api.get('/analytics/monthly-summary', {
    params: { startYear, startMonth, endYear, endMonth }
  });
  return response.data;
};

export const getAccountBalanceHistory = async (accountId, startDate, endDate) => {
  const response = await api.get(`/analytics/account-balance-history/${accountId}`, {
    params: { startDate, endDate }
  });
  return response.data;
};