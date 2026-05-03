import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pathApi } from '../services/api.js'

export const usePathStore = defineStore('paths', () => {
  const paths = ref([])
  const currentPath = ref(null)
  const progressList = ref([])
  const loading = ref(false)

  async function loadPaths() {
    loading.value = true
    try {
      const result = await pathApi.getPaths()
      if (result.code === 200 && result.data) {
        paths.value = result.data
      }
    } catch (error) {
      console.error('Load paths failed:', error)
    } finally {
      loading.value = false
    }
  }

  async function loadPathDetail(id) {
    loading.value = true
    try {
      const result = await pathApi.getPathById(id)
      if (result.code === 200) {
        currentPath.value = result.data
      }
      return result
    } catch (error) {
      console.error('Load path detail failed:', error)
    } finally {
      loading.value = false
    }
  }

  async function loadProgress() {
    try {
      const result = await pathApi.getPathProgress()
      if (result.code === 200 && result.data) {
        progressList.value = result.data
      }
    } catch (error) {
      console.error('Load progress failed:', error)
    }
  }

  return {
    paths,
    currentPath,
    progressList,
    loading,
    loadPaths,
    loadPathDetail,
    loadProgress
  }
})
