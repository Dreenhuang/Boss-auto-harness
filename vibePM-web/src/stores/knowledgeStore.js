import { defineStore } from 'pinia'
import { ref } from 'vue'
import { knowledgeApi } from '../services/api.js'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const stats = ref({ favorites: 0, paths: 0 })
  const recentViews = ref([])
  const loading = ref(false)

  async function loadStats() {
    try {
      const result = await knowledgeApi.getStats()
      if (result.code === 200 && result.data) {
        stats.value = result.data
      }
    } catch (error) {
      console.error('Load knowledge stats failed:', error)
    }
  }

  async function loadRecentViews() {
    try {
      const result = await knowledgeApi.getRecent(10)
      if (result.code === 200 && result.data) {
        recentViews.value = result.data
      }
    } catch (error) {
      console.error('Load recent views failed:', error)
    }
  }

  return {
    stats,
    recentViews,
    loading,
    loadStats,
    loadRecentViews
  }
})
