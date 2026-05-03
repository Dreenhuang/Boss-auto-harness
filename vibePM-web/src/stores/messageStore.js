import { defineStore } from 'pinia'
import { ref } from 'vue'
import { messageApi } from '../services/api.js'

export const useMessageStore = defineStore('messages', () => {
  const messages = ref([])
  const currentTab = ref('all')
  const loading = ref(false)
  const unreadCount = ref(0)

  async function loadMessages() {
    loading.value = true
    try {
      const result = await messageApi.getMessages(currentTab.value)
      if (result.code === 200 && result.data) {
        messages.value = result.data
        unreadCount.value = result.data.filter(m => m.unread).length
      }
    } catch (error) {
      console.error('Load messages failed:', error)
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id) {
    const result = await messageApi.markAsRead(id)
    if (result.code === 200) {
      const msg = messages.value.find(m => m.id === id)
      if (msg) {
        msg.unread = false
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    }
  }

  async function clearAllUnread() {
    const result = await messageApi.clearAllUnread()
    if (result.code === 200) {
      messages.value.forEach(m => m.unread = false)
      unreadCount.value = 0
    }
  }

  function switchTab(tab) {
    currentTab.value = tab
    loadMessages()
  }

  return {
    messages,
    currentTab,
    loading,
    unreadCount,
    loadMessages,
    markAsRead,
    clearAllUnread,
    switchTab
  }
})
