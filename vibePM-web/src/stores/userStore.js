import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi, authApi } from '../services/api.js'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('vibe-pm-token') || '')
  const isGuest = ref(false)

  async function login(phone, code) {
    const result = await authApi.login(phone, code)
    if (result.code === 200 && result.data) {
      token.value = result.data.token
      userInfo.value = result.data.user
      isGuest.value = false
      localStorage.setItem('vibe-pm-token', result.data.token)
      localStorage.setItem('vibe-pm-user', JSON.stringify(result.data.user))
    }
    return result
  }

  async function guestLogin() {
    const result = await authApi.guestLogin()
    if (result.code === 200 && result.data) {
      token.value = result.data.token
      userInfo.value = result.data.user
      isGuest.value = true
      localStorage.setItem('vibe-pm-token', result.data.token)
      localStorage.setItem('vibe-pm-user', JSON.stringify(result.data.user))
    }
    return result
  }

  async function loadProfile() {
    const result = await userApi.getProfile()
    if (result.code === 200 && result.data) {
      userInfo.value = result.data
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
        userInfo.value = JSON.parse(savedUser)
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
    guestLogin,
    loadProfile,
    updateProfile,
    logout
  }
})
