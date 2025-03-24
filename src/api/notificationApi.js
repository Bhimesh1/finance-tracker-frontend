import api from './axiosConfig';

export const getAllNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const getUnreadNotifications = async () => {
  const response = await api.get('/notifications/unread');
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/count');
  return response.data.count;
};

export const markAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};