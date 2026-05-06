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
    if (loading.value) {
      console.log('[PostStore] Blocked: already loading')
      return
    }

    if (reset) {
      const previousPage = currentPage.value
      currentPage.value = 1
      posts.value = []
      hasMore.value = true
      newPostsCount.value = 0
      syncStatus.value = 'syncing'
      console.log('[PostStore] Fresh load started, reset from page', previousPage)
    }

    loading.value = true
    try {
      const result = await postApi.getPosts(activeTab.value, currentPage.value, 10)
      
      console.log('[PostStore] API Response:', {
        code: result.code,
        listLength: result.data?.list?.length || 0,
        total: result.data?.total || 0,
        page: currentPage.value,
        reset: reset
      })
      if (result.code === 200 && result.data?.list?.length > 0) {
        useLocalData.value = false
        const serverTotal = result.data.total || 0
        console.log('[PostStore] Server total for current tab:', serverTotal)

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
        
        // 确保 serverTotal > 0 才计算 hasMore
        // 如果 serverTotal 为 0（未知总数），保守地设置为 true（可能有更多）
        const totalLoaded = reset ? result.data.list.length : posts.value.length
        hasMore.value = serverTotal > 0 ? (totalLoaded < serverTotal) : (result.data.list.length === 10)
        console.log('[PostStore] Pagination decision:', {
          totalLoaded,
          serverTotal,
          hasMore: hasMore.value,
          postsCount: posts.value.length,
          nextPage: currentPage.value + 1
        })
        currentPage.value++
        lastRefreshTime.value = Date.now()
        syncStatus.value = 'synced'
      } else {
        console.log('[PostStore] Empty result or API error, checking fallback')
        if (!useLocalData.value && posts.value.length === 0) {
          useLocalData.value = true
          const localPosts = getLocalPosts(activeTab.value)
          posts.value = localPosts
          hasMore.value = localPosts.length > 0
          syncStatus.value = 'using_local'
          console.log('[PostStore] Using local data:', localPosts.length, 'posts')
        } else if (posts.value.length > 0) {
          // 如果有现有数据，保守地保留 hasMore 为 true，以防这只是临时错误
          // 用户可以继续尝试加载更多
          hasMore.value = true
          syncStatus.value = 'error_with_data'
          console.log('[PostStore] Error but keeping existing data, hasMore:', hasMore.value)
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
        hasMore.value = localPosts.length > 0
        syncStatus.value = 'fallback_local'
        console.log('[PostStore] Error, using local data:', localPosts.length, 'posts')
      } else if (posts.value.length > 0) {
        // 有现有数据时不设为 false，保留加载更多的能力
        hasMore.value = true
        syncStatus.value = 'error_with_existing_data'
        console.log('[PostStore] Error but keeping existing data, hasMore:', hasMore.value)
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
