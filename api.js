import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentification
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  createClasseCode: (data) => api.post('/api/auth/create-classe-code', data),
};

// Documents
export const documentsAPI = {
  list: (categorie) => api.get('/api/documents/list', { params: { categorie } }),
  get: (id) => api.get(`/api/documents/${id}`),
  upload: (data) => api.post('/api/documents/upload', data),
  uploadPDF: (formData) => api.post('/api/documents/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/documents/${id}`),
};

// Lecture
export const readingAPI = {
  translate: (data) => api.post('/api/reading/translate', data),
  explain: (data) => api.post('/api/reading/explain', data),
  updateProgress: (data) => api.post('/api/reading/progress', data),
  getProgress: (documentId) => api.get(`/api/reading/progress/${documentId}`),
};

// Admin
export const adminAPI = {
  getStudents: () => api.get('/api/admin/students'),
  getClasses: () => api.get('/api/admin/classes'),
  getStats: () => api.get('/api/admin/stats'),
  getStudentProgress: (studentId) => api.get(`/api/admin/student/${studentId}/progress`),
};

export default api;
