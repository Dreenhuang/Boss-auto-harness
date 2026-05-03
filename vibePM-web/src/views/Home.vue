<template>
  <div class="home-container">
    <!-- 顶部导航 - 完全匹配原型 -->
    <div class="home-header">
      <div class="search-box" @click="goToSearch">
        <Icon icon="ri:search-line" class="search-icon" />
        <span class="search-placeholder">技术概念 / 工具 / 场景</span>
      </div>
      <Icon icon="ri:notification-3-line" class="notification-icon" @click="goToMessage" />
    </div>

    <!-- 分类标签 - 匹配原型 -->
    <div class="category-bar">
      <div 
        class="category-item" 
        :class="{ active: activeTab === tab.value }" 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 瀑布流内容 - 匹配原型 -->
    <div class="waterfall-container">
      <div class="waterfall-grid">
        <div 
          class="app-card" 
          v-for="(post, index) in posts" 
          :key="post.id"
          @click="goToDetail(post)"
          :style="{ animationDelay: (index * 0.05) + 's' }"
        >
          <!-- 卡片图片区域 -->
          <div class="card-image" :style="{ height: post.height }">
            <img :src="post.image" alt="" class="cover-img" />
            <div class="category-badge">{{ post.category }}</div>
          </div>

          <!-- 卡片内容 -->
          <div class="card-body">
            <h3 class="card-title">{{ post.title }}</h3>
            
            <div class="card-footer">
              <div class="author-info">
                <img :src="post.avatar" alt="" class="author-avatar" />
                <span class="author-name">{{ post.author }}</span>
              </div>
              
              <div class="like-btn" @click.stop="toggleLike(post.id)">
                <Icon 
                  :icon="likedPosts.has(post.id) ? 'ri:heart-3-fill' : 'ri:heart-3-line'" 
                  :class="{ liked: likedPosts.has(post.id) }"
                />
                <span class="like-count">{{ formatCount(post.likes) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="load-more-tip">没有更多内容了</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const activeTab = ref('recommend')
const likedPosts = ref(new Set([1, 3]))

const tabs = [
  { label: '推荐', value: 'recommend' },
  { label: '实战方案', value: 'practice' },
  { label: '技术模型', value: 'tech' },
  { label: 'AI 指标', value: 'ai' },
  { label: '入门指南', value: 'guide' }
]

// 模拟数据 - 完全匹配原型
const posts = ref([
  {
    id: 1,
    title: 'API 就像餐厅服务员：三分钟读懂接口原理',
    author: '技术小白',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    likes: 1205,
    image: 'https://picsum.photos/seed/api1/400/300',
    height: '220px',
    category: '概念'
  },
  {
    id: 2,
    title: '2026年全栈开发选型：别用 WordPress 做电商了',
    author: '架构师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
    likes: 892,
    image: 'https://picsum.photos/seed/wp2/400/240',
    height: '180px',
    category: '避坑'
  },
  {
    id: 3,
    title: 'React vs Vue：2026年该选哪一个？全面对比',
    author: '效率达人阿强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eff',
    likes: 3421,
    image: 'https://picsum.photos/seed/rv3/400/280',
    height: '200px',
    category: '对比'
  },
  {
    id: 4,
    title: '从零开始：18天掌握 AI 产品经理技能树',
    author: '职场导师Lily',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily',
    likes: 567,
    image: 'https://picsum.photos/seed/ai4/400/320',
    height: '240px',
    category: '路径'
  },
  {
    id: 5,
    title: '电商网站全栈选型指南（PDF可导出）',
    author: '技术宅小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xm',
    likes: 231,
    image: 'https://picsum.photos/seed/ec5/400/260',
    height: '190px',
    category: '工具'
  },
  {
    id: 6,
    title: '如何用自然语言理解复杂技术概念',
    author: '学习教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach',
    likes: 128,
    image: 'https://picsum.photos/seed/nl6/400/290',
    height: '210px',
    category: '思维'
  }
])

const switchTab = (tab) => {
  activeTab.value = tab
}

const goToSearch = () => router.push('/search')
const goToMessage = () => router.push('/message')
const goToDetail = () => router.push('/card-detail')

const toggleLike = (id) => {
  if (likedPosts.value.has(id)) {
    likedPosts.value.delete(id)
  } else {
    likedPosts.value.add(id)
  }
}

const formatCount = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}
</script>

<style scoped>
/* 完全匹配原型的样式参数 */
.home-container {
  height: 100vh;
  background-color: #F9F9F9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航 */
.home-header {
  background: #ffffff;
  padding: 12px 16px;
  padding-top: 48px;
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
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.notification-icon:active {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(0.96);
}

/* 分类标签栏 */
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

/* 瀑布流容器 */
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

/* 瀑布流网格 - 匹配原型 */
.waterfall-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

/* 卡片样式 - 匹配原型 */
.app-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
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

/* 卡片图片 */
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

/* 分类徽章 */
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

/* 卡片内容区 */
.card-body {
  padding: 12px;
}

/* 标题 - 最多显示2行 */
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

/* 底部信息 */
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

/* 点赞按钮 */
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

/* 加载提示 */
.load-more-tip {
  text-align: center;
  font-size: 12px;
  color: #DDDDDD;
  padding: 40px 0 20px;
}
</style>
