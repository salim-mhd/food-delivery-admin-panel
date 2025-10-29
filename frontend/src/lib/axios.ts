import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic error propagation; extend for auth handling, toasts, etc.
    return Promise.reject(error);
  }
);

export default api;


