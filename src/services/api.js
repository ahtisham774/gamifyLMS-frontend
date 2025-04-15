import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://vast-flicker-protoceratops.glitch.me/api', // Backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Remove token if it exists
      localStorage.removeItem('token');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  // Auth endpoints
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),

  // Courses endpoints
  getCourses: (params) => apiClient.get('/courses', { params }),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
  createCourse: (courseData) => apiClient.post('/courses', courseData),
  updateCourse: (id, courseData) => apiClient.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
  enrollCourse: (id) => apiClient.post(`/courses/${id}/enroll`),
  getMyCourses: () => apiClient.get('/courses/mycourses'),
  getEnrolledCourses: () => apiClient.get('/courses/enrolled'),

  // Quizzes endpoints
  getQuizzes: (params) => apiClient.get('/quizzes', { params }),
  getQuizById: (id) => apiClient.get(`/quizzes/${id}`),
  getQuizzesByCourse: (courseId) => apiClient.get(`/quizzes/course/${courseId}`),
  createQuiz: (quizData) => apiClient.post('/quizzes', quizData),
  updateQuiz: (id, quizData) => apiClient.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => apiClient.delete(`/quizzes/${id}`),

  // Attempts endpoints
  startQuizAttempt: (quizId) => apiClient.post('/attempts/start', { quizId }),
  submitQuizAttempt: (attemptId, answers) => apiClient.post(`/attempts/submit/${attemptId}`, { answers }),
  getUserAttempts: (params) => apiClient.get('/attempts', { params }),
  getAttemptById: (id) => apiClient.get(`/attempts/${id}`),
  getAttemptsByQuiz: (quizId) => apiClient.get(`/attempts/quiz/${quizId}`),

  // Rewards endpoints
  getRewards: (params) => apiClient.get('/rewards', { params }),
  getRewardById: (id) => apiClient.get(`/rewards/${id}`),
  createReward: (rewardData) => apiClient.post('/rewards', rewardData),
  updateReward: (id, rewardData) => apiClient.put(`/rewards/${id}`, rewardData),
  deleteReward: (id) => apiClient.delete(`/rewards/${id}`),
  awardReward: (rewardId, userId, reason) => apiClient.post(`/rewards/${rewardId}/award/${userId}`, { reason }),
  getUserRewards: (userId) => apiClient.get(`/rewards/user/${userId}`),

  // Utility methods for auth token
  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    }
  },

  removeAuthToken: () => {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  },

  // Generic request methods
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

export default api;
