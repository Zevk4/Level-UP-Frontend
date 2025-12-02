// 1. IMPORTANTE: Importamos 'AxiosRequestConfig' aquí arriba
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:8080/api'; 

export const apiService = axios.create({ 
  baseURL: API_BASE_URL, 
  headers: { 
    'Content-Type': 'application/json', 
  }, 
}); 


apiService.interceptors.request.use(
  (config) => { 
    const token = localStorage.getItem('token'); 
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config; 
  }, 
  (error) => {
    return Promise.reject(error);
  }
);