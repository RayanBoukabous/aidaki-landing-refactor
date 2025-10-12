import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Intercepteur pour ajouter le token JWT à chaque requête
// Cette fonction s'exécute côté client uniquement
const setupInterceptors = () => {
  if (typeof window !== 'undefined') {
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
};

// Appeler setupInterceptors immédiatement
setupInterceptors();

export default api;