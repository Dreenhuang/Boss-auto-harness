<template>
  <div class="pathlist-container">
    <div class="pathlist-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="header-title">学习路径</div>
      <Plus class="add-btn" />
    </div>
    
    <div class="pathlist-content">
      <div class="pathlist-list">
        <div class="path-item" v-for="(path, index) in paths" :key="index" @click="goToDetail(path)">
          <div class="path-cover" :style="{ background: path.gradient }">
            <Icon :icon="path.icon" class="cover-icon" />
          </div>
          <div class="path-info">
            <h3 class="path-title">{{ path.title }}</h3>
            <p class="path-desc">{{ path.desc }}</p>
            <div class="path-progress">
              <div class="progress-bar" :style="{ width: path.progress + '%' }"></div>
            </div>
            <p class="path-meta">{{ path.completed }}/{{ path.total }} 已完成 · {{ path.progress }}%</p>
          </div>
          <ChevronRight class="path-arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Plus, ChevronRight } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'
import { usePathStore } from '../stores/pathStore.js'

const router = useRouter()
const pathStore = usePathStore()

const GRADIENTS = [
  'linear-gradient(135deg, #FF2442, #FF4D6A)',
  'linear-gradient(135deg, #06b6d4, #0ea5e9)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
  'linear-gradient(135deg, #FF4D6A, #FF2442)'
]

const ICONS = [
  'ri:map-2-line',
  'ri:target-line',
  'ri:lightbulb-line',
  'ri:rocket-line',
  'ri:code-s-slash-line',
  'ri:book-open-line'
]

// 本地默认路径数据
const localPaths = [
  { id: 'lp1', title: '电商网站全栈选型', description: '从前端到后端到数据库，完整的电商技术选型路径', progress: 38, totalSteps: 8, completed: 3 },
  { id: 'lp2', title: '前端框架入门路径', description: 'React / Vue / Angular 从零到一', progress: 100, totalSteps: 10, completed: 10 },
  { id: 'lp3', title: 'AI工具使用指南', description: 'ChatGPT / Claude / Midjourney 实战教程', progress: 60, totalSteps: 6, completed: 4 },
  { id: 'lp4', title: '后端开发入门', description: 'Node.js / Python / Java 后端开发基础', progress: 15, totalSteps: 12, completed: 2 }
]

const paths = computed(() => {
  const source = pathStore.paths.length > 0 ? pathStore.paths : localPaths
  return source.map((p, index) => ({
    ...p,
    icon: p.icon || ICONS[index % ICONS.length],
    gradient: p.gradient || GRADIENTS[index % GRADIENTS.length],
    desc: p.description || p.desc || '',
    total: p.totalSteps || p.total || 0,
    completed: p.completed || Math.floor((p.totalSteps || 0) * (p.progress || 0) / 100)
  }))
})

onMounted(async () => {
  try {
    await pathStore.loadPaths()
  } catch (error) {
    console.error('加载路径列表失败:', error)
  }
})

const goBack = () => router.back()

const goToDetail = async (path) => {
  try {
    await pathStore.loadPathDetail(path.id)
  } catch (error) {
    console.error('加载路径详情失败:', error)
  }
  router.push(`/path-detail/${path.id}`)
}
</script>

<style scoped>
.pathlist-container {
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.pathlist-header {
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #eeeeee;
}

.back-btn, .add-btn {
  width: 24px;
  height: 24px;
  color: #333333;
  cursor: pointer;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.pathlist-content {
  flex: 1;
  overflow-y: auto;
}

.path-item {
  background: #ffffff;
  padding: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.path-cover {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.cover-icon {
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.9);
}

.path-info {
  flex: 1;
}

.path-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.path-desc {
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
}

.path-progress {
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF2442, #FF4D6A);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.path-meta {
  font-size: 11px;
  color: #999999;
}

.path-arrow {
  width: 20px;
  height: 20px;
  color: #cccccc;
}
</style>
