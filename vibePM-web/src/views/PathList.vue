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
            <component :is="path.iconComponent" class="cover-icon" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Plus, ChevronRight, Map, Target, Lightbulb } from 'lucide-vue-next'

const router = useRouter()

const paths = ref([
  { iconComponent: Map, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', title: '电商网站全栈选型', desc: '从前端到后端到数据库', completed: 3, total: 8, progress: 37 },
  { iconComponent: Target, gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', title: '前端框架入门路径', desc: 'React、Vue、Angular基础', completed: 5, total: 10, progress: 50 },
  { iconComponent: Lightbulb, gradient: 'linear-gradient(135deg, #10b981, #059669)', title: 'AI工具使用指南', desc: 'ChatGPT、Claude、文心一言', completed: 2, total: 6, progress: 33 }
])

const goBack = () => router.back()
const goToDetail = () => router.push('/path-detail')
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
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
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
