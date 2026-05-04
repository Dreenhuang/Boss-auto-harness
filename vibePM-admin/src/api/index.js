import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    if (code !== 200) {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/#/login'
    }
    ElMessage.error(error.response?.data?.message || '网络异常')
    return Promise.reject(error)
  }
)

// 用户管理 API
export const userApi = {
  getList: (params) => api.get('/users', { params }),
  getDetail: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  batchDelete: (ids) => api.post('/users/batch-delete', { ids }),
  toggleStatus: (id, status) => api.post(`/users/${id}/toggle-status`, { status })
}

// 角色管理 API
export const roleApi = {
  getList: () => api.get('/roles'),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`)
}

// 内容管理 API
export const contentApi = {
  getList: (params) => api.get('/posts', { params }),
  getDetail: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  audit: (id, status, reason) => api.post(`/posts/${id}/audit`, { status, reason }),
  batchAudit: (ids, status) => api.post('/posts/batch-audit', { ids, status }),
  schedule: (id, scheduled_at) => api.post(`/posts/${id}/schedule`, { scheduled_at }),
  aiGenerate: (data) => api.post('/posts/ai-generate', data)
}

// 数据统计 API
export const statsApi = {
  getOverview: () => api.get('/stats/overview'),
  getUserStats: (params) => api.get('/stats/users', { params }),
  getContentStats: (params) => api.get('/stats/contents', { params }),
  getLearningStats: (params) => api.get('/stats/learning', { params }),
  export: (params) => api.post('/stats/export', params, { responseType: 'blob' })
}

// 系统设置 API
export const systemApi = {
  getConfig: () => api.get('/system/config'),
  updateConfig: (data) => api.put('/system/config', data)
}

// 操作日志 API
export const logApi = {
  getList: (params) => api.get('/logs', { params }),
  getDetail: (id) => api.get(`/logs/${id}`),
  clear: () => api.delete('/logs')
}

// 提示词管理 API
export const promptApi = {
  getList: (params) => api.get('/prompts', { params }),
  getDetail: (id) => api.get(`/prompts/${id}`),
  getByKey: (key) => api.get(`/prompts/key/${key}`),
  getCategories: () => api.get('/prompts/categories'),
  create: (data) => api.post('/prompts', data),
  update: (id, data) => api.put(`/prompts/${id}`, data),
  delete: (id) => api.delete(`/prompts/${id}`)
}

export default api
