import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postApi, favoriteApi } from '../services/api.js'
import { getLocalPosts, getLocalPostById } from '../services/localData.js'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const currentPage = ref(1)
  const hasMore = ref(true)
  const activeTab = ref('recommend')
  const likedPosts = ref(new Set())
  const useLocalData = ref(false)

  const tabs = [
    { label: '推荐', value: 'recommend' },
    { label: '实战方案', value: 'practice' },
    { label: '技术模型', value: 'tech' },
    { label: 'AI 指标', value: 'ai' },
    { label: '入门指南', value: 'guide' }
  ]

  async function loadPosts(reset = false) {
    if (loading.value) return

    if (reset) {
      currentPage.value = 1
      posts.value = []
      hasMore.value = true
    }

    loading.value = true
    try {
      const result = await postApi.getPosts(activeTab.value, currentPage.value, 10)
      if (result.code === 200 && result.data?.list?.length > 0) {
        useLocalData.value = false
        if (reset) {
          posts.value = result.data.list
        } else {
          posts.value = [...posts.value, ...result.data.list]
        }
        hasMore.value = result.data.list.length === 10
        currentPage.value++
      } else {
        // API返回空数据，尝试使用本地数据
        if (!useLocalData.value && posts.value.length === 0) {
          useLocalData.value = true
          const localPosts = getLocalPosts(activeTab.value)
          posts.value = localPosts
          // 本地数据支持分页模拟
          hasMore.value = false
        } else {
          hasMore.value = false
        }
      }
    } catch (error) {
      console.error('[PostStore] Load posts error:', error)
      // API调用失败，使用本地数据作为后备
      if (!useLocalData.value && posts.value.length === 0) {
        useLocalData.value = true
        const localPosts = getLocalPosts(activeTab.value)
        posts.value = localPosts
        hasMore.value = false
      } else {
        hasMore.value = false
      }
    } finally {
      loading.value = false
    }
  }

  async function loadPostDetail(id) {
    loading.value = true
    try {
      const result = await postApi.getPostById(id)
      if (result.code === 200 && result.data) {
        currentPost.value = result.data
      } else {
        currentPost.value = getLocalPostById(id)
      }
      return result
    } catch {
      currentPost.value = getLocalPostById(id)
    } finally {
      loading.value = false
    }
  }

  async function toggleLike(postId) {
    if (likedPosts.value.has(postId)) {
      if (!useLocalData.value) {
        await favoriteApi.removeFavorite(postId)
      }
      likedPosts.value.delete(postId)
    } else {
      if (!useLocalData.value) {
        await favoriteApi.addFavorite(postId)
      }
      likedPosts.value.add(postId)
    }
    return likedPosts.value.has(postId)
  }

  function switchTab(tab) {
    activeTab.value = tab
    loadPosts(true)
  }

  return {
    posts,
    currentPost,
    loading,
    currentPage,
    hasMore,
    activeTab,
    likedPosts,
    tabs,
    loadPosts,
    loadPostDetail,
    toggleLike,
    switchTab
  }
})
