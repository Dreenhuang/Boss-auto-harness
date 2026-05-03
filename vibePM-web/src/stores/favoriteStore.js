import { defineStore } from 'pinia'
import { ref } from 'vue'
import { favoriteApi } from '../services/api.js'

export const useFavoriteStore = defineStore('favorites', () => {
  const favorites = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const hasMore = ref(true)

  async function loadFavorites(reset = false) {
    if (loading.value) return

    if (reset) {
      currentPage.value = 1
      favorites.value = []
      hasMore.value = true
    }

    loading.value = true
    try {
      const result = await favoriteApi.getFavorites(currentPage.value, 20)
      if (result.code === 200 && result.data) {
        if (reset) {
          favorites.value = result.data.list
        } else {
          favorites.value = [...favorites.value, ...result.data.list]
        }
        hasMore.value = result.data.list.length === 20
        currentPage.value++
      }
    } catch (error) {
      console.error('Load favorites failed:', error)
    } finally {
      loading.value = false
    }
  }

  async function addFavorite(cardId) {
    const result = await favoriteApi.addFavorite(cardId)
    return result.code === 200
  }

  async function removeFavorite(id) {
    const result = await favoriteApi.removeFavorite(id)
    if (result.code === 200) {
      favorites.value = favorites.value.filter(f => f.id !== id)
    }
    return result.code === 200
  }

  return {
    favorites,
    loading,
    currentPage,
    hasMore,
    loadFavorites,
    addFavorite,
    removeFavorite
  }
})
