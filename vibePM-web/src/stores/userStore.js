import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi, authApi } from '../services/api.js'

// DiceBear Adventurer 风格头像 - 精美卡通风格
const AVATAR_SEEDS = [
  'Aneka', 'Bella', 'Cara', 'Diana', 'Elena',
  'Fiona', 'Gina', 'Hana', 'Iris', 'Jade',
  'Kara', 'Luna', 'Maya', 'Nina', 'Olivia',
  'Pia', 'Quinn', 'Rosa', 'Sara', 'Tina'
]

function getRandomAvatar() {
  const seed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)]
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

function ensureCartoonAvatar(user) {
  if (!user) return user
  if (!user.avatar || user.avatar.includes('picsum') || user.avatar === '') {
    user.avatar = getRandomAvatar()
  }
  return user
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('vibe-pm-token') || '')
  const isGuest = ref(false)

  async function login(phone, password) {
    const result = await authApi.login(phone, password)
    if (result.code === 200 && result.data) {
      token.value = result.data.token
      userInfo.value = ensureCartoonAvatar(result.data.user)
      isGuest.value = false
      localStorage.setItem('vibe-pm-token', result.data.token)
      localStorage.setItem('vibe-pm-user', JSON.stringify(userInfo.value))
    }
    return result
  }

  async function register(phone, password) {
    const result = await authApi.register(phone, password)
    if (result.code === 200 && result.data) {
      token.value = result.data.token
      userInfo.value = ensureCartoonAvatar(result.data.user)
      isGuest.value = false
      localStorage.setItem('vibe-pm-token', result.data.token)
      localStorage.setItem('vibe-pm-user', JSON.stringify(userInfo.value))
    }
    return result
  }

  async function guestLogin() {
    const result = await authApi.guestLogin()
    if (result.code === 200 && result.data) {
      token.value = result.data.token
      userInfo.value = ensureCartoonAvatar(result.data.user)
      isGuest.value = true
      localStorage.setItem('vibe-pm-token', result.data.token)
      localStorage.setItem('vibe-pm-user', JSON.stringify(userInfo.value))
    }
    return result
  }

  function guestLoginLocal() {
    const guestToken = 'guest-' + Date.now()
    const guestUser = {
      id: 'guest-' + Date.now(),
      nickname: '游客用户',
      name: '游客用户',
      avatar: getRandomAvatar(),
      isGuest: true,
      level: 1,
      studyDays: 0,
      favoritesCount: 0,
      pathCount: 0
    }
    token.value = guestToken
    userInfo.value = guestUser
    isGuest.value = true
    localStorage.setItem('vibe-pm-token', guestToken)
    localStorage.setItem('vibe-pm-user', JSON.stringify(guestUser))
    return true
  }

  async function loadProfile() {
    const result = await userApi.getProfile()
    if (result.code === 200 && result.data) {
      userInfo.value = ensureCartoonAvatar(result.data)
    }
    return result
  }

  async function updateProfile(data) {
    const result = await userApi.updateProfile(data)
    if (result.code === 200 && result.data) {
      userInfo.value = { ...userInfo.value, ...data }
    }
    return result
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    isGuest.value = false
    localStorage.removeItem('vibe-pm-token')
    localStorage.removeItem('vibe-pm-user')
  }

  function initFromStorage() {
    const savedUser = localStorage.getItem('vibe-pm-user')
    if (savedUser) {
      try {
        userInfo.value = ensureCartoonAvatar(JSON.parse(savedUser))
        isGuest.value = userInfo.value?.isGuest || false
      } catch {
        userInfo.value = null
      }
    }
  }

  initFromStorage()

  return {
    userInfo,
    token,
    isGuest,
    login,
    register,
    guestLogin,
    guestLoginLocal,
    loadProfile,
    updateProfile,
    logout
  }
})
