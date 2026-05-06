<template>
  <div class="home-container">
    <div class="home-header">
      <div class="search-box" @click="goToSearch">
        <Icon icon="ri:search-line" class="search-icon" />
        <span class="search-placeholder">技术概念 / 工具 / 场景</span>
      </div>
      <div class="notification-wrapper" @click="goToMessage">
        <Icon icon="ri:notification-3-line" class="notification-icon" />
        <div v-if="hasUnread" class="notification-dot"></div>
      </div>
    </div>

    <div class="category-bar">
      <div
        class="category-item"
        :class="{ active: postStore.activeTab === tab.value }"
        v-for="tab in postStore.tabs"
        :key="tab.value"
        @click="postStore.switchTab(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>

    <PullRefresh
      ref="pullRefreshRef"
      @refresh="handleRefresh"
    >
      <WaterfallGrid
        ref="waterfallRef"
        :items="postStore.posts"
        :loading="postStore.loading"
        :has-more="postStore.hasMore"
        :min-column-width="170"
        :max-columns="2"
        :column-gap="10"
        :item-gap="10"
        @load-more="handleLoadMore"
        class="waterfall-section"
      >
        <template #default="{ item }">
          <div
            class="app-card"
            @click="goToDetail(item)"
          >
            <div class="card-image" :style="{ height: item.height }">
              <LazyImage
                :src="item.image"
                :alt="item.title"
                :height="parseHeight(item.height)"
                object-fit="cover"
                @error="handleImgError"
              />
              <div class="category-badge">{{ item.category }}</div>
            </div>

            <div class="card-body">
              <h3 class="card-title">{{ item.title }}</h3>

              <div class="card-footer">
                <div class="author-info">
                  <img :src="item.avatar" alt="" class="author-avatar" @error="handleAvatarError" />
                  <span class="author-name">{{ item.author }}</span>
                </div>

                <div class="like-btn" @click.stop="handleLike(item.id)">
                  <Icon
                    :icon="postStore.likedPosts.has(item.id) ? 'ri:heart-3-fill' : 'ri:heart-3-line'"
                    :class="{ liked: postStore.likedPosts.has(item.id) }"
                  />
                  <span class="like-count">{{ formatCount(item.likes) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #empty>
          <EmptyState
            type="search"
            title="暂无学习内容"
            description="下拉刷新试试，或切换其他分类查看"
            :show-retry="true"
            retry-text="重新加载"
            @retry="handleRefresh"
          />
        </template>

        <template #no-more>
          <EmptyState
            type="default"
            title="已经到底啦"
            description="所有内容都已加载完毕"
            tip="新内容会自动更新到顶部"
          />
        </template>
      </WaterfallGrid>
    </PullRefresh>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { usePostStore } from '../stores/postStore.js'
import { useMessageStore } from '../stores/messageStore.js'
import { postApi } from '../services/api.js'
import { useWebSocket } from '../services/websocket.js'
import WaterfallGrid from '../components/WaterfallGrid.vue'
import PullRefresh from '../components/PullRefresh.vue'
import EmptyState from '../components/EmptyState.vue'
import LazyImage from '../components/LazyImage.vue'

const router = useRouter()
const postStore = usePostStore()
const messageStore = useMessageStore()
const waterfallRef = ref(null)
const pullRefreshRef = ref(null)

// WebSocket连接
const {
  connect: wsConnect,
  disconnect: wsDisconnect,
  onNewPost,
  isConnected: isWsConnected
} = useWebSocket()

// 自动刷新定时器（作为后备方案）
let autoRefreshTimer = null
const AUTO_REFRESH_INTERVAL = 30000 // 30秒自动刷新一次（仅当WebSocket不可用时）

// 检查是否有未读消息
const hasUnread = computed(() => messageStore.unreadCount > 0)

onMounted(() => {
  // 初始加载
  postStore.loadPosts(true)

  // 尝试建立WebSocket连接
  try {
    // 使用环境变量中的WS URL，或根据当前环境自动选择
    const wsUrl = import.meta.env.VITE_WS_URL ||
                  (window.location.hostname === 'localhost'
                    ? 'ws://localhost:3001/ws'
                    : `ws://${window.location.hostname}:3001/ws`)
    console.log('[Home] Connecting to WebSocket:', wsUrl)
    wsConnect(wsUrl)

    // 监听新文章推送
    onNewPost((data) => {
      console.log('[Home] Received new post via WebSocket:', data)
      if (data.data) {
        // 将新文章插入到列表顶部
        postStore.posts = [data.data, ...postStore.posts]
      }
    })
  } catch (error) {
    console.warn('[Home] WebSocket connection failed, falling back to polling:', error)
    startPollingFallback()
  }
})

onUnmounted(() => {
  // 清理定时器
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }

  // 断开WebSocket连接
  try {
    wsDisconnect()
  } catch (error) {
    console.warn('[Home] Error disconnecting WebSocket:', error)
  }
})

// 后备轮询方案（当WebSocket不可用时）
function startPollingFallback() {
  autoRefreshTimer = setInterval(() => {
    if (!postStore.loading && postStore.posts.length > 0) {
      refreshPostsSilently()
    }
  }, AUTO_REFRESH_INTERVAL)
}

// 静默刷新（后台更新数据，不重置列表）
async function refreshPostsSilently() {
  try {
    const result = await postApi.getPosts(postStore.activeTab, 1, 10)
    if (result.code === 200 && result.data?.list?.length > 0) {
      const newPosts = result.data.list
      const currentTopId = postStore.posts[0]?.id
      const newTopId = newPosts[0]?.id
      if (newTopId && newTopId !== currentTopId) {
        const existingIds = new Set(postStore.posts.map(p => p.id))
        const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id))
        if (uniqueNewPosts.length > 0) {
          postStore.posts = [...uniqueNewPosts, ...postStore.posts]
          postStore.newPostsCount = uniqueNewPosts.length
          console.log(`[Home] Found ${uniqueNewPosts.length} new posts`)
        }
      }
    }
  } catch (error) {
    console.warn('[Home] Silent refresh failed:', error.message)
  }
}

// 下拉刷新处理函数
async function handleRefresh() {
  try {
    await postStore.loadPosts(true)
    return Promise.resolve()
  } catch (error) {
    console.error('[Home] 刷新失败:', error)
    return Promise.reject(error)
  }
}

const handleLoadMore = () => {
  if (postStore.hasMore && !postStore.loading) {
    postStore.loadPosts()
  }
}

const goToSearch = () => router.push('/search')
const goToMessage = () => router.push('/main/message')
const goToDetail = (post) => router.push(`/card-detail/${post.id}`)

const handleLike = async (id) => {
  await postStore.toggleLike(id)
}

const handleImgError = () => {
  // LazyImage 组件内部已处理错误
}

const handleAvatarError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNFNUU1RTUiLz48L3N2Zz4='
}

const formatCount = (num) => {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

// 解析高度值
const parseHeight = (height) => {
  if (!height) return 200
  if (typeof height === 'string') {
    return parseInt(height.replace('px', ''))
  }
  return height
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  background-color: #F9F9F9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-header {
  background: #ffffff;
  padding: 12px 16px;
  padding-top: max(48px, env(safe-area-inset-top, 48px));
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-box {
  flex: 1;
  background: #F5F5F5;
  border-radius: 999px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-box:active {
  transform: scale(0.98);
  background: #EEEEEE;
}

.search-icon {
  font-size: 18px;
  color: #CCCCCC;
}

.search-placeholder {
  font-size: 14px;
  color: #CCCCCC;
}

.notification-icon {
  font-size: 24px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-wrapper {
  position: relative;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-wrapper:active {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(0.96);
}

.notification-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #FF2442;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.category-bar {
  background: #ffffff;
  border-bottom: 1px solid #F0F0F0;
  padding: 0 16px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 24px;
  overflow-x: auto;
  white-space: nowrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.category-bar::-webkit-scrollbar {
  display: none;
}

.category-item {
  font-size: 14px;
  font-weight: 500;
  color: #999999;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.category-item.active {
  color: #333333;
  font-weight: 600;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #FF2442;
  border-radius: 1px;
}

.waterfall-section {
  flex: 1;
  overflow-y: auto;
}

/* 卡片样式 */
.app-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  break-inside: avoid;
}

.app-card:active {
  transform: scale(0.98);
}

.app-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  background: #E5E5E5;
  overflow: hidden;
}

.category-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
}

.card-body {
  padding: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #333333;
  line-height: 1.4;
  margin-bottom: 12px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  background: #F0F0F0;
}

.author-name {
  font-size: 10px;
  color: #666666;
  font-weight: 500;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.like-btn:active {
  transform: scale(0.96);
}

.like-btn .iconify {
  font-size: 14px;
  color: #CCCCCC;
  transition: color 0.2s ease;
}

.like-btn .iconify.liked {
  color: #FF2442;
}

.like-count {
  font-size: 10px;
  color: #999999;
  font-weight: 600;
}

/* 空状态 */
.empty-icon {
  font-size: 64px;
  color: #E5E5E5;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #CCCCCC;
}
</style>
