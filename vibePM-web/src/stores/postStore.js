import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postApi, favoriteApi } from '../services/api.js'
import { getLocalPosts, getLocalPostById } from '../services/localData.js'
import { perfMonitor } from '../services/performanceMonitor.js'

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
  const syncStatus = ref('idle')

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
      syncStatus.value = 'syncing'
    }

    loading.value = true
    try {
      const result = await postApi.getPosts(activeTab.value, currentPage.value, 10)
      if (result.code === 200 && result.data?.list?.length > 0) {
        useLocalData.value = false
        const serverTotal = result.data.total || 0

        if (reset) {
          const newList = result.data.list
          if (newList.length > 0) {
            const previousTopId = posts.value[0]?.id
            const newTopId = newList[0]?.id
            const hasNewData = previousTopId && newTopId && previousTopId !== newTopId

            if (hasNewData) {
              const newCount = newList.findIndex(p => p.id === previousTopId)
              newPostsCount.value = newCount >= 0 ? newCount : newList.length
            }
            lastKnownPostId.value = newList[0]?.id
            perfMonitor.updateDataFresness(newList[0]?.id, serverTotal)
          }
          posts.value = newList
          perfMonitor.recordSync(serverTotal, newList.length > 0)
        } else {
          posts.value = [...posts.value, ...result.data.list]
        }
        const totalLoaded = reset ? result.data.list.length : posts.value.length
        hasMore.value = totalLoaded < serverTotal
        currentPage.value++
        lastRefreshTime.value = Date.now()
        syncStatus.value = 'synced'
      } else {
        if (!useLocalData.value && posts.value.length === 0) {
          useLocalData.value = true
          const localPosts = getLocalPosts(activeTab.value)
          posts.value = localPosts
          hasMore.value = false
          syncStatus.value = 'using_local'
        } else {
          hasMore.value = false
          syncStatus.value = 'no_more'
        }
      }
    } catch (error) {
      console.error('[PostStore] Load posts error:', error)
      perfMonitor.recordSyncError()
      if (!useLocalData.value && posts.value.length === 0) {
        useLocalData.value = true
        const localPosts = getLocalPosts(activeTab.value)
        posts.value = localPosts
        hasMore.value = false
        syncStatus.value = 'fallback_local'
      } else {
        hasMore.value = false
        syncStatus.value = 'error'
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

  function getSyncStatus() {
    return {
      status: syncStatus.value,
      postsCount: posts.value.length,
      lastRefreshTime: lastRefreshTime.value,
      lastKnownPostId: lastKnownPostId.value,
      isUsingLocalData: useLocalData.value,
      ...perfMonitor.getSyncStats()
    }
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
    newPostsCount,
    syncStatus,
    getSyncStatus
  }
})
