<template>
  <div class="main-layout">
    <router-view class="main-content" />
    
    <!-- 底部TabBar - 完全匹配原型 -->
    <div class="tab-bar">
      <!-- 首页 -->
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'home' }" 
        @click="switchTab('home')"
      >
        <Icon :icon="activeTab === 'home' ? 'ri:home-5-fill' : 'ri:home-5-line'" class="tab-icon" />
        <span class="tab-label">首页</span>
      </div>

      <!-- 知识库 -->
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'knowledge' }" 
        @click="switchTab('knowledge')"
      >
        <Icon :icon="activeTab === 'knowledge' ? 'ri:book-read-fill' : 'ri:book-read-line'" class="tab-icon" />
        <span class="tab-label">知识库</span>
      </div>

      <!-- 中间红色+号按钮 - 匹配原型 -->
      <div class="add-btn-wrapper">
        <div class="add-btn" @click="handleAddClick">
          <Icon icon="ri:add-line" class="add-icon" />
        </div>
      </div>

      <!-- 消息 -->
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'message' }" 
        @click="switchTab('message')"
      >
        <Icon :icon="activeTab === 'message' ? 'ri:message-3-fill' : 'ri:message-3-line'" class="tab-icon" />
        <span class="tab-label">消息</span>
      </div>

      <!-- 我的 -->
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'profile' }" 
        @click="switchTab('profile')"
      >
        <Icon :icon="activeTab === 'profile' ? 'ri:user-3-fill' : 'ri:user-3-line'" class="tab-icon" />
        <span class="tab-label">我</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('home')

// 监听路由变化更新当前Tab
watch(() => route.path, (newPath) => {
  if (newPath.includes('/home')) activeTab.value = 'home'
  else if (newPath.includes('/knowledge')) activeTab.value = 'knowledge'
  else if (newPath.includes('/profile')) activeTab.value = 'profile'
  else if (newPath.includes('/message')) activeTab.value = 'message'
}, { immediate: true })

const switchTab = (tab) => {
  activeTab.value = tab
  router.push(`/main/${tab}`)
}

const handleAddClick = () => {
  // 跳转到搜索页面，方便用户快速查找学习内容
  router.push('/search')
}
</script>

<style scoped>
/* 完全匹配原型的布局 */
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F9F9F9;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

/* 底部TabBar - 匹配原型 */
.tab-bar {
  height: 80px; /* 原型是h-20，即80px */
  background: #ffffff;
  border-top: 1px solid #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 16px;
  position: sticky;
  bottom: 0;
  z-index: 20;
  padding-bottom: env(safe-area-inset-bottom);
}

/* Tab项 */
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 56px;
}

.tab-item:active {
  transform: scale(0.96);
}

.tab-icon {
  font-size: 24px;
  color: #CCCCCC;
  transition: color 0.2s ease;
}

.tab-item.active .tab-icon {
  color: #333333;
}

.tab-label {
  font-size: 9px;
  font-weight: 600;
  color: #999999;
  transition: color 0.2s ease;
}

.tab-item.active .tab-label {
  color: #333333;
}

/* 中间红色+号按钮容器 */
.add-btn-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -12px; /* 向上突出 */
}

/* 红色+号按钮 - 匹配原型 */
.add-btn {
  width: 48px;
  height: 36px;
  background: #FF2442;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3);
  transition: all 0.2s ease;
}

.add-btn:active {
  transform: scale(0.92);
  background: #E61E3C;
  box-shadow: 0 2px 8px rgba(255, 36, 66, 0.3);
}

.add-icon {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}
</style>
