import { BACKEND_URL } from '../api/auth/auth';
import axios from 'axios';
import { config } from 'process';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error)=>Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if (error.response?.status === 401){
            console.warn('Unauthorized! Redirecting or logging out...')
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;