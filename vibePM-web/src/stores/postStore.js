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
  const lastKnownPostId = ref(null)
  const lastRefreshTime = ref(null)
  const newPostsCount = ref(0)

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
      newPostsCount.value = 0
    }

    loading.value = true
    try {
      const result = await postApi.getPosts(activeTab.value, currentPage.value, 10)
      if (result.code === 200 && result.data?.list?.length > 0) {
        useLocalData.value = false
        
        if (reset) {
          const newList = result.data.list
          if (newList.length > 0) {
            const previousTopId = posts.value[0]?.id
            const newTopId = newList[0]?.id
            if (previousTopId && newTopId && previousTopId !== newTopId) {
              const newCount = newList.findIndex(p => p.id === previousTopId)
              newPostsCount.value = newCount >= 0 ? newCount : newList.length
            }
            lastKnownPostId.value = newList[0]?.id
          }
          posts.value = newList
        } else {
          posts.value = [...posts.value, ...result.data.list]
        }
        const totalLoaded = reset ? result.data.list.length : posts.value.length
        hasMore.value = totalLoaded < result.data.total
        currentPage.value++
        lastRefreshTime.value = Date.now()
      } else {
        if (!useLocalData.value && posts.value.length === 0) {
          useLocalData.value = true
          const localPosts = getLocalPosts(activeTab.value)
          posts.value = localPosts
          hasMore.value = false
        } else {
          hasMore.value = false
        }
      }
    } catch (error) {
      console.error('[PostStore] Load posts error:', error)
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
    switchTab,
    lastKnownPostId,
    lastRefreshTime,
    newPostsCount
  }
})
