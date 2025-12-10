import axios from 'axios';
import storage from '../utils/storage';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' });

// Attach bearer token automatically
API.interceptors.request.use((config) => {
  const token = storage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: bounce to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      storage.removeItem('token');
      storage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;

export const getSlots = (date) => API.get(`/courts/slots?date=${date}`);
export const previewPrice = (payload) => API.post('/bookings/price', payload);
export const createBooking = (payload) => API.post('/bookings', payload);
export const getBookingHistory = (userId) => API.get(`/bookings/history/${userId}`);
export const cancelBooking = (bookingId) => API.put(`/bookings/${bookingId}/cancel`);
export const getCourts = () => API.get('/courts');
export const getCoaches = () => API.get('/coaches');
export const getEquipment = () => API.get('/equipment');

// Admin endpoints
export const adminGetCourts = () => API.get('/admin/courts');
export const adminCreateCourt = (data) => API.post('/admin/courts', data);
export const adminUpdateCourt = (id, data) => API.put(`/admin/courts/${id}`, data);
export const adminDeleteCourt = (id) => API.delete(`/admin/courts/${id}`);

export const adminGetCoaches = () => API.get('/admin/coaches');
export const adminCreateCoach = (data) => API.post('/admin/coaches', data);
export const adminUpdateCoach = (id, data) => API.put(`/admin/coaches/${id}`, data);
export const adminDeleteCoach = (id) => API.delete(`/admin/coaches/${id}`);

export const adminGetEquipment = () => API.get('/admin/equipment');
export const adminCreateEquipment = (data) => API.post('/admin/equipment', data);
export const adminUpdateEquipment = (id, data) => API.put(`/admin/equipment/${id}`, data);
export const adminDeleteEquipment = (id) => API.delete(`/admin/equipment/${id}`);

export const adminGetPricingRules = () => API.get('/admin/pricing-rules');
export const adminCreatePricingRule = (data) => API.post('/admin/pricing-rules', data);
export const adminUpdatePricingRule = (id, data) => API.put(`/admin/pricing-rules/${id}`, data);
export const adminDeletePricingRule = (id) => API.delete(`/admin/pricing-rules/${id}`);
export const adminGetBookings = () => API.get('/admin/bookings');

