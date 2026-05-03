<template>
  <div class="message-container">
    <!-- 顶部标题栏 -->
    <div class="message-header">
      <h1 class="header-title">消息</h1>
      <div class="header-actions">
        <span class="clear-btn" @click="clearAllUnread">清除未读</span>
        <Icon icon="ri:settings-4-line" class="settings-icon" />
      </div>
    </div>

    <!-- 快捷操作区 -->
    <div class="quick-actions">
      <div 
        class="quick-action-item" 
        v-for="(item, index) in quickActions" 
        :key="index"
        @click="switchTab(item.id)"
      >
        <div class="action-icon" :class="item.colorClass">
          <Icon :icon="item.icon" />
        </div>
        <span class="action-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- Tab切换 -->
    <div class="message-tabs">
      <div 
        class="tab" 
        :class="{ active: currentTab === tab.value }"
        v-for="tab in tabs"
        :key="tab.value"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list">
      <div 
        class="message-item" 
        v-for="(msg, index) in filteredMessages" 
        :key="index"
        @click="markAsRead(msg.id)"
      >
        <div class="avatar-wrapper">
          <img :src="msg.avatar" alt="" class="avatar" :style="{ background: msg.bgColor }" />
          <div v-if="msg.unread" class="unread-dot"></div>
        </div>
        
        <div class="message-content">
          <div class="message-top">
            <h3 class="sender-name">{{ msg.name }}</h3>
            <span class="message-time">{{ msg.time }}</span>
          </div>
          <p class="message-text">{{ msg.content }}</p>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredMessages.length === 0" class="empty-state">
        <Icon icon="ri:message-2-line" class="empty-icon" />
        <p class="empty-text">暂无相关消息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const currentTab = ref('all')

const quickActions = [
  { id: 'interaction', icon: 'ri:heart-3-line', label: '收到的赞', colorClass: 'red' },
  { id: 'follow', icon: 'ri:user-add-line', label: '新增关注', colorClass: 'blue' },
  { id: 'comment', icon: 'ri:chat-3-line', label: '评论和 @', colorClass: 'green' }
]

const tabs = [
  { label: '全部', value: 'all' },
  { label: '互动', value: 'interaction' },
  { label: '私信', value: 'private' },
  { label: '系统', value: 'system' }
]

// 模拟消息数据 - 匹配原型
const messages = ref([
  {
    id: 1,
    type: 'private',
    name: '架构师老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
    bgColor: '#F0F0F0',
    content: '老弟，上次那个 API 的方案发我一份？',
    time: '14:20',
    unread: true
  },
  {
    id: 2,
    type: 'private',
    name: '职场导师Lily',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily',
    bgColor: '#E0E0E0',
    content: '你的学习计划已经制定好了，记得查看。',
    time: '昨天',
    unread: false
  },
  {
    id: 3,
    type: 'system',
    name: '系统通知',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sys',
    bgColor: '#D0D0D0',
    content: '欢迎加入 Vibe PM！开启你的 AI 学习之旅。',
    time: '05-01',
    unread: false
  },
  {
    id: 4,
    type: 'interaction',
    name: '技术小白',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    bgColor: '#C0C0C0',
    content: '赞了你的笔记《API 就像餐厅服务员》',
    time: '1小时前',
    unread: true
  },
  {
    id: 5,
    type: 'follow',
    name: '码农小张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
    bgColor: '#B0B0B0',
    content: '开始关注了你',
    time: '2小时前',
    unread: true
  },
  {
    id: 6,
    type: 'comment',
    name: 'AI探索者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai',
    bgColor: '#A0A0A0',
    content: '在评论中回复了你：这个比喻太妙了！',
    time: '3小时前',
    unread: false
  }
])

// 过滤消息
const filteredMessages = computed(() => {
  if (currentTab.value === 'all') return messages.value
  if (currentTab.value === 'interaction') {
    return messages.value.filter(m => ['interaction', 'follow', 'comment'].includes(m.type))
  }
  return messages.value.filter(m => m.type === currentTab.value)
})

const switchTab = (tab) => {
  currentTab.value = tab
}

const markAsRead = (id) => {
  const msg = messages.value.find(m => m.id === id)
  if (msg) msg.unread = false
}

const clearAllUnread = () => {
  messages.value.forEach(m => m.unread = false)
}
</script>

<style scoped>
/* 完全匹配原型的样式 */
.message-container {
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部 */
.message-header {
  padding: 48px 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #FAFAFA;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #333333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.clear-btn {
  font-size: 12px;
  color: #999999;
  cursor: pointer;
}

.settings-icon {
  font-size: 20px;
  color: #666666;
  cursor: pointer;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 24px 16px;
  border-bottom: 1px solid #FAFAFA;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-icon .iconify {
  font-size: 24px;
}

.action-icon.red {
  background: #FEF2F2; /* red-50 */
  color: #EF4444; /* red-500 */
}

.action-icon.blue {
  background: #EFF6FF; /* blue-50 */
  color: #3B82F6; /* blue-500 */
}

.action-icon.green {
  background: #ECFDF5; /* green-50 */
  color: #10B981; /* green-500 */
}

.action-label {
  font-size: 11px;
  color: #666666;
  font-weight: 500;
}

/* Tab切换 */
.message-tabs {
  display: flex;
  padding: 12px 16px;
  gap: 24px;
  border-bottom: 1px solid #FAFAFA;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.message-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  font-size: 14px;
  color: #999999;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  padding-bottom: 8px;
  transition: all 0.2s ease;
}

.tab.active {
  color: #333333;
  font-weight: 700;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #FF2442;
  border-radius: 1px;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.message-list::-webkit-scrollbar {
  display: none;
}

/* 单条消息 - 匹配原型 */
.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #FAFAFA;
}

.message-item:active {
  background: #FAFAFA;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.unread-dot {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  background: #FF2442;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.sender-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 10px;
  color: #999999;
  flex-shrink: 0;
}

.message-text {
  font-size: 12px;
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 空状态 */
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
  font-size: 12px;
  color: #CCCCCC;
}
</style>
