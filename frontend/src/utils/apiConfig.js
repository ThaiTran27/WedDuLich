// API Configuration
const API_BASE_URL = 
  import.meta.env.VITE_API_URL ||
  'https://backend-v1-779k.onrender.com';

export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const socketURL = API_BASE_URL;

export default API_BASE_URL;
