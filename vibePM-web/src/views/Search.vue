<template>
  <div class="search-container">
    <div class="search-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="search-input-wrapper">
        <input v-model="searchQuery" class="search-input" placeholder="搜索技术概念、工具、场景..." @input="handleSearch" />
        <X class="clear-btn" v-if="searchQuery" @click="clearSearch" />
      </div>
    </div>
    
    <div class="search-content">
      <div v-if="searchQuery" class="search-results">
        <div class="result-item" v-for="(item, index) in filteredResults" :key="index">
          <div class="result-icon" :style="{ background: item.iconBg }">
            <component :is="item.iconComponent" class="icon" :style="{ color: item.iconColor }" />
          </div>
          <div class="result-content">
            <h3 class="result-title">{{ item.title }}</h3>
            <p class="result-desc">{{ item.desc }}</p>
          </div>
          <ChevronRight class="result-arrow" />
        </div>
      </div>
      
      <div v-else class="search-history">
        <div class="history-header">
          <h3 class="history-title">搜索历史</h3>
          <Trash2 class="clear-icon" @click="clearHistory" />
        </div>
        <div class="history-tags">
          <div class="history-tag" v-for="(tag, index) in history" :key="index" @click="searchQuery = tag">{{ tag }}</div>
        </div>
        
        <div class="hot-section">
          <h3 class="hot-title">热门搜索</h3>
          <div class="hot-list">
            <div class="hot-item" v-for="(item, index) in hotSearches" :key="index">
              <span class="hot-rank" :class="{ top3: index < 3 }">{{ index + 1 }}</span>
              <span class="hot-text">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, X, Trash2, ChevronRight, Lightbulb, Wrench, AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')

const history = ['API是什么', 'React vs Vue', '电商网站选型']

const hotSearches = ['API概念解释', '前端框架对比', '电商技术栈', 'AI工具推荐', '数据库选型']

const allResults = [
  { iconComponent: Lightbulb, iconBg: 'rgba(99, 102, 241, 0.1)', iconColor: '#6366f1', title: 'API就像餐厅服务员', desc: '用生活化比喻解释API' },
  { iconComponent: Wrench, iconBg: 'rgba(16, 185, 129, 0.1)', iconColor: '#10b981', title: 'AI工具入门', desc: 'ChatGPT、Claude对比' },
  { iconComponent: AlertTriangle, iconBg: 'rgba(245, 158, 11, 0.1)', iconColor: '#f59e0b', title: '别用WordPress做电商', desc: 'WordPress电商避坑指南' }
]

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  return allResults.filter(r => r.title.includes(searchQuery.value) || r.desc.includes(searchQuery.value))
})

const goBack = () => router.back()
const clearSearch = () => searchQuery.value = ''
const clearHistory = () => history.value = []
const handleSearch = () => {}
</script>

<style scoped>
.search-container {
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.search-header {
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #eeeeee;
}

.back-btn {
  width: 24px;
  height: 24px;
  color: #333333;
  margin-right: 12px;
  cursor: pointer;
}

.search-input-wrapper {
  flex: 1;
  height: 32px;
  background: #f5f5f5;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.clear-btn {
  width: 16px;
  height: 16px;
  color: #999999;
  cursor: pointer;
}

.search-content {
  flex: 1;
  overflow-y: auto;
}

.search-results {
  padding: 8px;
}

.result-item {
  background: #ffffff;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.result-icon .icon {
  width: 20px;
  height: 20px;
}

.result-content {
  flex: 1;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.result-desc {
  font-size: 12px;
  color: #666666;
}

.result-arrow {
  width: 20px;
  height: 20px;
  color: #cccccc;
}

.search-history {
  padding: 16px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.history-title, .hot-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.clear-icon {
  width: 18px;
  height: 18px;
  color: #999999;
  cursor: pointer;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.history-tag {
  font-size: 13px;
  color: #333333;
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
}

.hot-section {
  margin-top: 24px;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.hot-rank {
  width: 24px;
  height: 24px;
  background: #f5f5f5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
  margin-right: 12px;
}

.hot-rank.top3 {
  background: #ff2442;
  color: #ffffff;
}

.hot-text {
  font-size: 14px;
  color: #333333;
}
</style>
