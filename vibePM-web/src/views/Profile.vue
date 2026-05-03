<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar">
          <User class="avatar-icon" />
        </div>
        <div class="user-details">
          <h2 class="username">学习者</h2>
          <p class="user-level">Lv.3 · 已学习12天</p>
        </div>
        <Settings class="settings-icon" />
      </div>
    </div>
    
    <div class="stats-section">
      <div class="stat-item">
        <span class="stat-value">28</span>
        <span class="stat-label">收藏</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">5</span>
        <span class="stat-label">路径</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">12</span>
        <span class="stat-label">天</span>
      </div>
    </div>
    
    <div class="menu-section">
      <div class="menu-item" @click="goToFavorites">
        <div class="menu-icon" style="background: rgba(99, 102, 241, 0.1);">
          <Heart class="icon" style="color: #6366f1;" />
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
      <div class="menu-item">
        <div class="menu-icon" style="background: rgba(236, 72, 153, 0.1);">
          <Bell class="icon" style="color: #ec4899;" />
        </div>
        <span class="menu-text">消息通知</span>
        <ChevronRight class="menu-arrow" />
      </div>
      <div class="menu-item">
        <div class="menu-icon" style="background: rgba(6, 182, 212, 0.1);">
          <HelpCircle class="icon" style="color: #06b6d4;" />
        </div>
        <span class="menu-text">帮助中心</span>
        <ChevronRight class="menu-arrow" />
      </div>
    </div>
    
    <div class="logout-btn">
      <span class="logout-text">退出登录</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Settings, Heart, Map, Download, Bell, HelpCircle, ChevronRight } from 'lucide-vue-next'

const router = useRouter()

const goToFavorites = () => router.push('/favorites')
const goToPathList = () => router.push('/path-list')
const goToExport = () => router.push('/export')
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
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
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
