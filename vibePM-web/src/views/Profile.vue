<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar">
          <img v-if="userAvatar" :src="userAvatar" alt="avatar" class="avatar-img" />
          <User v-else class="avatar-icon" />
        </div>
        <div class="user-details">
          <h2 class="username">{{ username }}</h2>
          <p class="user-level">{{ userLevel }}</p>
        </div>
        <Settings class="settings-icon" @click="goToSettings" />
      </div>
    </div>
    
    <div class="stats-section">
      <div class="stat-item">
        <span class="stat-value">{{ favoritesCount }}</span>
        <span class="stat-label">收藏</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ pathCount }}</span>
        <span class="stat-label">路径</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ studyDays }}</span>
        <span class="stat-label">天</span>
      </div>
    </div>
    
    <div class="menu-section">
      <div class="menu-item" @click="goToFavorites">
        <div class="menu-icon" style="background: rgba(255, 36, 66, 0.1);">
          <Heart class="icon" style="color: #FF2442;" />
        </div>
        <span class="menu-text">我的收藏</span>
        <ChevronRight class="menu-arrow" />
      </div>
      <div class="menu-item" @click="goToPathList">
        <div class="menu-icon" style="background: rgba(16, 185, 129, 0.1);">
          <Map class="icon" style="color: #10b981;" />
        </div>
        <span class="menu-text">学习路径</span>
        <ChevronRight class="menu-arrow" />
      </div>
      <div class="menu-item" @click="goToExport">
        <div class="menu-icon" style="background: rgba(245, 158, 11, 0.1);">
          <Download class="icon" style="color: #f59e0b;" />
        </div>
        <span class="menu-text">导出笔记</span>
        <ChevronRight class="menu-arrow" />
      </div>
      <div class="menu-item" @click="goToMessage">
        <div class="menu-icon" style="background: rgba(236, 72, 153, 0.1);">
          <Bell class="icon" style="color: #ec4899;" />
        </div>
        <span class="menu-text">消息通知</span>
        <ChevronRight class="menu-arrow" />
      </div>
      <div class="menu-item" @click="goToHelp">
        <div class="menu-icon" style="background: rgba(6, 182, 212, 0.1);">
          <HelpCircle class="icon" style="color: #06b6d4;" />
        </div>
        <span class="menu-text">帮助中心</span>
        <ChevronRight class="menu-arrow" />
      </div>
    </div>
    
    <div class="logout-btn" @click="handleLogout">
      <span class="logout-text">退出登录</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Settings, Heart, Map, Download, Bell, HelpCircle, ChevronRight } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const username = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.name || '学习者')
const userAvatar = computed(() => userStore.userInfo?.avatar || '')
const userLevel = computed(() => {
  const level = userStore.userInfo?.level || 3
  const days = userStore.userInfo?.studyDays || 0
  return `Lv.${level} · 已学习${days}天`
})
const favoritesCount = computed(() => userStore.userInfo?.favoritesCount || 12)
const pathCount = computed(() => userStore.userInfo?.pathCount || 3)
const studyDays = computed(() => userStore.userInfo?.studyDays || 7)

onMounted(async () => {
  try {
    await userStore.loadProfile()
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
})

const goToFavorites = () => router.push('/favorites')
const goToPathList = () => router.push('/path-list')
const goToExport = () => router.push('/export')
const goToSettings = () => router.push('/settings')
const goToMessage = () => router.push('/message')
const goToHelp = () => {
  alert('帮助中心即将上线，敬请期待！')
}

const handleLogout = async () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.profile-header {
  background: #ffffff;
  padding: 24px 16px;
  border-bottom: 1px solid #eeeeee;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF2442, #FF4D6A);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.avatar-icon {
  width: 28px;
  height: 28px;
  color: #ffffff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.user-level {
  font-size: 13px;
  color: #999999;
}

.settings-icon {
  width: 24px;
  height: 24px;
  color: #666666;
  cursor: pointer;
}

.stats-section {
  background: #ffffff;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999999;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: #eeeeee;
}

.menu-section {
  background: #ffffff;
  margin-bottom: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.menu-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-icon .icon {
  width: 18px;
  height: 18px;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  color: #333333;
}

.menu-arrow {
  width: 18px;
  height: 18px;
  color: #cccccc;
}

.logout-btn {
  margin: 16px;
  height: 44px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logout-text {
  font-size: 14px;
  color: #ff2442;
}
</style>
