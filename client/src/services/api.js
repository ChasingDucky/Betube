import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
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

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除认证信息
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户认证相关API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// 视频相关API
export const videoAPI = {
  getVideos: (params) => api.get('/videos', { params }),
  getVideoById: (id) => api.get(`/videos/${id}`),
  uploadVideo: (formData, onProgress) =>
    api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  updateVideo: (id, data) => api.put(`/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  incrementViews: (id) => api.post(`/videos/${id}/view`),
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  unlikeVideo: (id) => api.delete(`/videos/${id}/like`),
  getRecommended: (params) => api.get('/videos/recommended', { params }),
  getTrending: (params) => api.get('/videos/trending', { params }),
  search: (query, params) => api.get('/videos/search', { params: { q: query, ...params } }),
};

// 评论相关API
export const commentAPI = {
  getComments: (videoId, params) => api.get(`/videos/${videoId}/comments`, { params }),
  addComment: (videoId, data) => api.post(`/videos/${videoId}/comments`, data),
  updateComment: (commentId, data) => api.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  likeComment: (commentId) => api.post(`/comments/${commentId}/like`),
  unlikeComment: (commentId) => api.delete(`/comments/${commentId}/like`),
};

// 弹幕相关API
export const danmakuAPI = {
  getDanmaku: (videoId) => api.get(`/videos/${videoId}/danmaku`),
  sendDanmaku: (videoId, data) => api.post(`/videos/${videoId}/danmaku`, data),
};

// 用户相关API
export const userAPI = {
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  getUserVideos: (userId, params) => api.get(`/users/${userId}/videos`, { params }),
  subscribe: (userId) => api.post(`/users/${userId}/subscribe`),
  unsubscribe: (userId) => api.delete(`/users/${userId}/subscribe`),
  getSubscriptions: () => api.get('/users/subscriptions'),
  getHistory: (params) => api.get('/users/history', { params }),
  addToHistory: (videoId) => api.post('/users/history', { videoId }),
};

export default api;
