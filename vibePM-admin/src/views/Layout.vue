<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo-area">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=VibePM&backgroundColor=FF2442" alt="logo" class="logo-img" />
        <span class="logo-text">Vibe PM</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
        background-color="#001529"
        text-color="#a6adb4"
        active-text-color="#ffffff"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.path"
          :index="item.path"
          :route="{ path: item.path }"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <el-tag v-if="authStore.isSuperAdmin" type="danger" effect="dark" class="role-tag">
            超级管理员
          </el-tag>
          <el-tag v-else type="info" effect="dark" class="role-tag">
            {{ authStore.user?.role || '管理员' }}
          </el-tag>

          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <img :src="authStore.user?.avatar" alt="avatar" class="user-avatar" />
              <span class="user-name">{{ authStore.user?.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 根据权限过滤菜单
const menuItems = computed(() => {
  const allMenus = [
    { path: '/dashboard', title: '仪表盘', icon: 'Odometer', permission: 'dashboard:view' },
    { path: '/users', title: '用户管理', icon: 'User', permission: 'user:view' },
    { path: '/roles', title: '角色权限', icon: 'Key', permission: 'role:view' },
    { path: '/content', title: '内容管理', icon: 'Document', permission: 'content:view' },
    { path: '/data', title: '数据统计', icon: 'TrendCharts', permission: 'data:view' },
    { path: '/logs', title: '操作日志', icon: 'List', permission: 'log:view' },
    { path: '/prompts', title: '提示词管理', icon: 'ChatDotRound', permission: 'system:view' },
    { path: '/system', title: '系统设置', icon: 'Setting', permission: 'system:view' }
  ]

  return allMenus.filter(item => authStore.hasPermission(item.permission))
})

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const matched = route.matched.find(r => r.meta?.title)
  return matched?.meta?.title || '管理后台'
})

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中')
      break
    case 'password':
      ElMessage.info('修改密码功能开发中')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        authStore.logout()
        router.push('/login')
        ElMessage.success('已退出登录')
      }).catch(() => {})
      break
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background: #001529;
  transition: width 0.3s;
}

.logo-area {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.sidebar-menu {
  border-right: none;
  background: #001529;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: #1890ff !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: #1890ff !important;
}

.header {
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.role-tag {
  font-size: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  font-size: 14px;
  color: #333333;
}

.main-content {
  background: #f0f2f5;
  padding: 24px;
  overflow-y: auto;
}
</style>
