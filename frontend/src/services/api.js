import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    // #region agent log
    const logData = {url: config.url, hasToken: !!token, tokenLength: token ? token.length : 0};
    fetch('http://127.0.0.1:7243/ingest/66441fe7-28f3-4874-ab27-777c6beb2043',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:request_interceptor',message:'API request with token',data:logData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // #region agent log
    const logData = {status: error.response?.status, url: error.config?.url, hasToken: !!localStorage.getItem('token')};
    fetch('http://127.0.0.1:7243/ingest/66441fe7-28f3-4874-ab27-777c6beb2043',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:response_interceptor',message:'API error response',data:logData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (email, password) => api.post('/api/auth/register', { email, password }),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
}

export const entriesAPI = {
  getEntries: (from, to) => api.get('/api/entries', { params: { from, to } }),
  createEntry: (data) => api.post('/api/entries', data),
  updateEntry: (date, data) => api.put(`/api/entries/${date}`, data),
}

export const habitsAPI = {
  getTodayHabits: () => api.get('/api/habits/today'),
  completeHabit: (habitKey, data) => api.post(`/api/habits/${habitKey}/complete`, data),
}

export const remindersAPI = {
  getReminders: () => api.get('/api/reminders'),
  createReminder: (data) => api.post('/api/reminders', data),
  updateReminder: (id, data) => api.put(`/api/reminders/${id}`, data),
}

export const activitiesAPI = {
  startActivity: (activityType, data) => api.post(`/api/activities/${activityType}/start`, data),
  endActivity: (sessionId, data) => api.post(`/api/activities/${sessionId}/end`, data),
}

export const statsAPI = {
  getSummary: (period) => api.get('/api/stats/summary', { params: { period } }),
  getCorrelations: () => api.get('/api/stats/correlations'),
}

export default api

