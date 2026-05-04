const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

async function request(url, options = {}) {
  const token = localStorage.getItem('vibe-pm-token')
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

    const result = await response.json()

    if (response.ok && result.code === 200) {
      return result
    }

    if (result.code === 401) {
      localStorage.removeItem('vibe-pm-token')
      localStorage.removeItem('vibe-pm-user')
    }

    return result
  } catch (error) {
    console.error(`API Error [${url}]:`, error)
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

export const aiApi = {
  generateImage: (prompt, techName, cardId) =>
    request('/ai/generate-image', { method: 'POST', body: JSON.stringify({ prompt, techName, cardId }) }),
  getQuota: () => request('/ai/quota'),
  matchImage: (cardId, cardTags) =>
    request('/ai/match-image', { method: 'POST', body: JSON.stringify({ cardId, cardTags }) })
}

export const recommendApi = {
  getRecommendations: (limit = 10) => request(`/recommend?limit=${limit}`)
}

export default request
