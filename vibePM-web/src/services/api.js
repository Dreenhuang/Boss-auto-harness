import { perfMonitor } from './performanceMonitor.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

function extractEndpoint(url) {
  const match = url.match(/\/api\/([^?]+)/)
  return match ? match[1] : url
}

async function request(url, options = {}) {
  const token = localStorage.getItem('vibe-pm-token')
  const startTime = Date.now()
  const endpoint = extractEndpoint(url)

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers
    })

    const latency = Date.now() - startTime
    const result = await response.json()

    if (response.ok && result.code === 200) {
      perfMonitor.recordApiRequest(endpoint, latency, true)
      return result
    }

    if (result.code === 401) {
      localStorage.removeItem('vibe-pm-token')
      localStorage.removeItem('vibe-pm-user')
    }

    perfMonitor.recordApiRequest(endpoint, latency, false)
    return result
  } catch (error) {
    const latency = Date.now() - startTime
    console.error(`API Error [${url}]:`, error)
    perfMonitor.recordApiRequest(endpoint, latency, false)
    return { code: 500, message: error.message || 'Network error', data: null }
  }
}

export const postApi = {
  getPosts: (tab = 'recommend', page = 1, pageSize = 10) =>
    request(`/posts?tab=${tab}&page=${page}&pageSize=${pageSize}`),
  getPostById: (id) => request(`/posts/${id}`),
  likePost: (id) => request(`/posts/${id}/like`, { method: 'POST' })
}

export const favoriteApi = {
  addFavorite: (cardId) => request('/favorites', { method: 'POST', body: JSON.stringify({ cardId }) }),
  removeFavorite: (id) => request(`/favorites/${id}`, { method: 'DELETE' }),
  getFavorites: (page = 1, pageSize = 20) =>
    request(`/favorites/list?page=${page}&pageSize=${pageSize}`)
}

export const searchApi = {
  search: (q, limit = 20) => request(`/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  getHotSearches: () => request('/search/hot')
}

export const userApi = {
  getProfile: () => request('/user/profile'),
  updateProfile: (data) => request('/user/profile', { method: 'POST', body: JSON.stringify(data) })
}

export const pathApi = {
  getPaths: (status) => {
    const query = status ? `?status=${status}` : ''
    return request(`/paths/list${query}`)
  },
  getPathById: (id) => request(`/paths/${id}`),
  getPathProgress: () => request('/paths/progress')
}

export const messageApi = {
  getMessages: (type, unreadOnly) => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (unreadOnly) params.set('unreadOnly', unreadOnly)
    return request(`/messages?${params.toString()}`)
  },
  markAsRead: (id) => request(`/messages/${id}/read`, { method: 'PUT' }),
  clearAllUnread: () => request('/messages/clear-unread', { method: 'PUT' })
}

export const authApi = {
  register: (phone, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  login: (phone, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  guestLogin: () => request('/auth/guest', { method: 'POST' })
}

export const exportApi = {
  exportContent: (format, ids, settings) =>
    request('/export', { method: 'POST', body: JSON.stringify({ format, ids, settings }) })
}

export const knowledgeApi = {
  getStats: () => request('/knowledge/stats'),
  getRecent: (limit = 10) => request(`/knowledge/recent?limit=${limit}`)
}

// AI生成API（优化版 - 支持多种内容类型）
export const aiApi = {
  // 生成单张图片
  generateImage: (prompt, techName, cardId, options = {}) =>
    request('/ai/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt, techName, cardId, ...options })
    }),

  // 生成深度技术文章
  generateDeepArticle: (topic, options = {}) =>
    request('/ai/generate-deep-article', {
      method: 'POST',
      body: JSON.stringify({ topic, options })
    }),

  // 生成速查卡
  generateQuickReference: (topic) =>
    request('/ai/generate-quick-reference', {
      method: 'POST',
      body: JSON.stringify({ topic })
    }),

  // 生成面试题
  generateInterviewQuestions: (topic) =>
    request('/ai/generate-interview-questions', {
      method: 'POST',
      body: JSON.stringify({ topic })
    }),

  // 生成实战项目教程
  generateProjectTutorial: (topic) =>
    request('/ai/generate-project-tutorial', {
      method: 'POST',
      body: JSON.stringify({ topic })
    }),

  // 批量生成内容（支持多种类型）
  batchGenerateContent: (topics, options = {}) =>
    request('/ai/batch-generate-content', {
      method: 'POST',
      body: JSON.stringify({ topics, options })
    }),

  // 批量生成图片
  batchGenerateImages: (topics, options = {}) =>
    request('/ai/batch-generate-images', {
      method: 'POST',
      body: JSON.stringify({ topics, options })
    }),

  // 生成内容并配图
  generateContentWithImage: (topic, options = {}) =>
    request('/ai/generate-content-with-image', {
      method: 'POST',
      body: JSON.stringify({ topic, options })
    }),

  // 获取配额
  getQuota: () => request('/ai/quota'),

  // 匹配图片
  matchImage: (cardId, cardTags) =>
    request('/ai/match-image', { method: 'POST', body: JSON.stringify({ cardId, cardTags }) }),

  // 获取性能指标
  getMetrics: () => request('/ai/metrics'),

  // 重置性能指标
  resetMetrics: () => request('/ai/metrics/reset', { method: 'POST' })
}

export const recommendApi = {
  getRecommendations: (limit = 10) => request(`/recommend?limit=${limit}`)
}

export default request
