<template>
  <div class="knowledge-container">
    <!-- 顶部区域 - 匹配原型 -->
    <div class="knowledge-header">
      <h1 class="header-title">我的知识库</h1>
      <Icon icon="ri:add-line" class="add-icon" />
    </div>

    <!-- 双卡片入口 - 完全匹配原型 -->
    <div class="entry-cards">
      <!-- 收藏笔记 -->
      <div class="entry-card" @click="goToFavorites">
        <Icon icon="ri:heart-3-line" class="entry-icon heart-icon" />
        <span class="entry-title">收藏笔记</span>
        <span class="entry-count">{{ knowledgeStore.stats.favorites || 0 }} 篇</span>
      </div>

      <!-- 学习路径 -->
      <div class="entry-card" @click="goToPaths">
        <Icon icon="ri:road-map-line" class="entry-icon path-icon" />
        <span class="entry-title">学习路径</span>
        <span class="entry-count">{{ knowledgeStore.stats.paths || 0 }} 条在练</span>
      </div>
    </div>

    <!-- 内容区域 - 可滚动 -->
    <div class="knowledge-content">
      <!-- 学习进度区域 -->
      <div class="section-header">
        <h2 class="section-title">学习进度</h2>
        <span class="manage-link">管理全部</span>
      </div>

      <!-- 进度列表 - 匹配原型 -->
      <div class="progress-list">
        <div 
          class="progress-item" 
          v-for="(item, index) in pathStore.progressList" 
          :key="index"
        >
          <div class="progress-item-header">
            <h3 class="progress-item-title">{{ item.title }}</h3>
            <span 
              class="status-badge" 
              :class="{ completed: item.progress === 100, active: item.progress < 100 && item.progress >= 60 }"
            >
              {{ item.status }}
            </span>
          </div>

          <!-- 进度条 - 匹配原型样式 -->
          <div class="progress-bar-wrapper">
            <div class="progress-bar-bg">
              <div 
                class="progress-bar-fill" 
                :style="{ width: item.progress + '%' }"
              ></div>
            </div>
          </div>

          <div class="progress-footer">
            <span class="progress-percent">{{ item.progress }}% 完成</span>
            <span class="progress-action">{{ item.action }}</span>
          </div>
        </div>
      </div>

      <!-- 最近浏览区域 -->
      <div class="section-header recent-section">
        <h2 class="section-title">最近浏览</h2>
      </div>

      <!-- 最近浏览列表 - 匹配原型 -->
      <div class="recent-list">
        <div 
          class="recent-item" 
          v-for="(item, index) in knowledgeStore.recentViews" 
          :key="index"
          @click="goToDetail"
        >
          <img :src="item.image" alt="" class="recent-thumb" />
          <div class="recent-info">
            <h4 class="recent-title">{{ item.title }}</h4>
            <p class="recent-time">{{ item.time }}</p>
          </div>
          <Icon icon="ri:more-2-line" class="more-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useKnowledgeStore } from '../stores/knowledgeStore.js'
import { usePathStore } from '../stores/pathStore.js'
import { useFavoriteStore } from '../stores/favoriteStore.js'
import { getLocalKnowledgeStats, getLocalProgress } from '../services/localData.js'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()
const pathStore = usePathStore()
const favoriteStore = useFavoriteStore()

// 页面加载时从 API 获取数据
onMounted(async () => {
  try {
    await Promise.all([
      knowledgeStore.loadStats(),
      knowledgeStore.loadRecentViews(),
      pathStore.loadProgress()
    ])
  } catch (error) {
    console.error('加载知识库数据失败，使用本地数据:', error)
  }

  // 如果API数据为空，使用本地数据回退
  if (!knowledgeStore.stats || (knowledgeStore.stats.favorites === 0 && knowledgeStore.stats.paths === 0)) {
    const localStats = getLocalKnowledgeStats()
    knowledgeStore.stats = localStats
  }

  if (!pathStore.progressList || pathStore.progressList.length === 0) {
    pathStore.progressList = getLocalProgress()
  }

  // 设置本地最近浏览数据作为回退
  if (!knowledgeStore.recentViews || knowledgeStore.recentViews.length === 0) {
    knowledgeStore.recentViews = [
      { id: 1, title: 'API 就像餐厅服务员', image: 'https://picsum.photos/seed/api1/100/100', time: '5分钟前' },
      { id: 2, title: 'React vs Vue 对比', image: 'https://picsum.photos/seed/rv3/100/100', time: '1小时前' },
      { id: 3, title: '电商网站选型指南', image: 'https://picsum.photos/seed/ec5/100/100', time: '3小时前' }
    ]
  }
})

const goToFavorites = () => router.push('/favorites')
const goToPaths = () => router.push('/path-list')
const goToDetail = () => router.push('/card-detail/1')
</script>

<style scoped>
/* 完全匹配原型的样式 */
.knowledge-container {
  height: 100vh;
  background-color: #F9F9F9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部标题栏 */
.knowledge-header {
  background: #ffffff;
  padding: 48px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
}

.add-icon {
  font-size: 24px;
  color: #666666;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.add-icon:active {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(0.96);
}

/* 双卡片入口 - 匹配原型 */
.entry-cards {
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
  background: #ffffff;
}

.entry-card {
  flex: 1;
  background: #ffffff;
  border: 1px solid #F0F0F0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.entry-card:active {
  background: #FAFAFA;
  transform: scale(0.98);
}

.entry-icon {
  font-size: 24px;
}

.heart-icon {
  color: #FF2442;
}

.path-icon {
  color: #3B82F6; /* blue-500 */
}

.entry-title {
  font-size: 14px;
  font-weight: 700;
  color: #333333;
}

.entry-count {
  font-size: 10px;
  color: #999999;
  font-weight: 500;
}

/* 内容滚动区域 */
.knowledge-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.knowledge-content::-webkit-scrollbar {
  display: none;
}

/* 区域标题 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #333333;
}

.manage-link {
  font-size: 12px;
  font-weight: 700;
  color: #3B82F6;
  cursor: pointer;
}

.recent-section {
  margin-top: 32px;
}

/* 进度列表 */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 单个进度项 - 匹配原型 */
.progress-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.progress-item:hover {
  border-color: #F0F0F0;
}

.progress-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.progress-item-title {
  font-size: 14px;
  font-weight: 700;
  color: #333333;
}

/* 状态徽章 */
.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: #EFF6FF; /* blue-50 */
  color: #3B82F6; /* blue-500 */
}

.status-badge.active {
  background: #EFF6FF;
  color: #3B82F6;
}

.status-badge.completed {
  background: #ECFDF5; /* green-50 */
  color: #10B981; /* green-500 */
}

/* 进度条 - 完全匹配原型参数 */
.progress-bar-wrapper {
  margin-bottom: 8px;
}

.progress-bar-bg {
  height: 6px;
  background: #F0F0F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #FF2442;
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 进度底部信息 */
.progress-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-percent {
  font-size: 10px;
  font-weight: 700;
  color: #999999;
}

.progress-action {
  font-size: 10px;
  font-weight: 700;
  color: #999999;
}

/* 最近浏览列表 */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 最近浏览项 - 匹配原型 */
.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-item:active {
  background: #FAFAFA;
  transform: scale(0.98);
}

.recent-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  background: #E5E5E5;
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-title {
  font-size: 12px;
  font-weight: 700;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.recent-time {
  font-size: 9px;
  color: #CCCCCC;
}

.more-icon {
  font-size: 18px;
  color: #DDDDDD;
  padding: 4px;
}
</style>
