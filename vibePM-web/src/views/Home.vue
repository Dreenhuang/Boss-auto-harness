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

    <div class="waterfall-container" ref="scrollContainer" @scroll="handleScroll">
      <div class="waterfall-grid">
        <div class="waterfall-column" ref="leftColumn">
          <div 
            class="app-card" 
            v-for="post in leftPosts" 
            :key="post.id"
            @click="goToDetail(post)"
          >
            <div class="card-image" :style="{ height: post.height }">
              <img :src="post.image" alt="" class="cover-img" loading="lazy" @error="handleImgError" />
              <div class="category-badge">{{ post.category }}</div>
            </div>

            <div class="card-body">
              <h3 class="card-title">{{ post.title }}</h3>
              
              <div class="card-footer">
                <div class="author-info">
                  <img :src="post.avatar" alt="" class="author-avatar" />
                  <span class="author-name">{{ post.author }}</span>
                </div>
                
                <div class="like-btn" @click.stop="handleLike(post.id)">
                  <Icon 
                    :icon="postStore.likedPosts.has(post.id) ? 'ri:heart-3-fill' : 'ri:heart-3-line'" 
                    :class="{ liked: postStore.likedPosts.has(post.id) }"
                  />
                  <span class="like-count">{{ formatCount(post.likes) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="waterfall-column" ref="rightColumn">
          <div 
            class="app-card" 
            v-for="post in rightPosts" 
            :key="post.id"
            @click="goToDetail(post)"
          >
            <div class="card-image" :style="{ height: post.height }">
              <img :src="post.image" alt="" class="cover-img" loading="lazy" @error="handleImgError" />
              <div class="category-badge">{{ post.category }}</div>
            </div>

            <div class="card-body">
              <h3 class="card-title">{{ post.title }}</h3>
              
              <div class="card-footer">
                <div class="author-info">
                  <img :src="post.avatar" alt="" class="author-avatar" />
                  <span class="author-name">{{ post.author }}</span>
                </div>
                
                <div class="like-btn" @click.stop="handleLike(post.id)">
                  <Icon 
                    :icon="postStore.likedPosts.has(post.id) ? 'ri:heart-3-fill' : 'ri:heart-3-line'" 
                    :class="{ liked: postStore.likedPosts.has(post.id) }"
                  />
                  <span class="like-count">{{ formatCount(post.likes) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="postStore.loading" class="load-more-tip">加载中...</div>
      <div v-else-if="!postStore.hasMore && postStore.posts.length > 0" class="load-more-tip">没有更多内容了</div>
      <div v-else-if="!postStore.loading && postStore.posts.length === 0" class="empty-state">
        <Icon icon="ri:inbox-line" class="empty-icon" />
        <p class="empty-text">暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { usePostStore } from '../stores/postStore.js'
import { useMessageStore } from '../stores/messageStore.js'

const router = useRouter()
const postStore = usePostStore()
const messageStore = useMessageStore()
const scrollContainer = ref(null)

// 检查是否有未读消息
const hasUnread = computed(() => messageStore.unreadCount > 0)

// 瀑布流双列分配 - 交替分配到左右列
const leftPosts = computed(() => {
  return postStore.posts.filter((_, index) => index % 2 === 0)
})

const rightPosts = computed(() => {
  return postStore.posts.filter((_, index) => index % 2 === 1)
})

onMounted(() => {
  postStore.loadPosts(true)
})

const handleScroll = () => {
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  if (scrollHeight - scrollTop - clientHeight < 200 && postStore.hasMore && !postStore.loading) {
    postStore.loadPosts()
  }
}

const goToSearch = () => router.push('/search')
const goToMessage = () => router.push('/main/message')
const goToDetail = (post) => router.push(`/card-detail/${post.id}`)

const handleLike = async (id) => {
  await postStore.toggleLike(id)
}

const handleImgError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0Y1RjVGNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjQ0NDQ0NDIiBmb250LXNpemU9IjE0Ij7lm77niYc8L3RleHQ+PC9zdmc+'
}

const formatCount = (num) => {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
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

.waterfall-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.waterfall-container::-webkit-scrollbar {
  display: none;
}

.waterfall-grid {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.app-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
  break-inside: avoid;
}

.app-card:active {
  transform: scale(0.98);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-image {
  position: relative;
  background: #E5E5E5;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.load-more-tip {
  text-align: center;
  font-size: 12px;
  color: #DDDDDD;
  padding: 40px 0 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

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
