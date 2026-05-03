<template>
  <div class="favorites-container">
    <div class="favorites-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="header-title">我的收藏</div>
      <div class="header-action"></div>
    </div>
    
    <div class="favorites-content">
      <div class="favorites-list">
        <div class="fav-item" v-for="(item, index) in favorites" :key="index">
          <div class="fav-type-icon" :style="{ background: item.iconBg }">
            <component :is="item.iconComponent" class="icon" :style="{ color: item.iconColor }" />
          </div>
          <div class="fav-content">
            <h3 class="fav-title">{{ item.title }}</h3>
            <p class="fav-desc">{{ item.desc }}</p>
            <div class="fav-meta">
              <span class="fav-tag">{{ item.type }}</span>
              <span class="fav-date">{{ item.date }}</span>
            </div>
          </div>
          <X class="remove-btn" @click="removeFav(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, X, Lightbulb, Target, Wrench, AlertTriangle } from 'lucide-vue-next'

const router = useRouter()

const favorites = ref([
  { iconComponent: Lightbulb, iconBg: 'rgba(99, 102, 241, 0.1)', iconColor: '#6366f1', title: 'API就像餐厅服务员', desc: '用生活化比喻解释API', type: '概念卡', date: '2026-05-02' },
  { iconComponent: Target, iconBg: 'rgba(6, 182, 212, 0.1)', iconColor: '#06b6d4', title: '电商网站选型指南', desc: '从零开始做电商网站', type: '场景卡', date: '2026-05-01' },
  { iconComponent: Wrench, iconBg: 'rgba(16, 185, 129, 0.1)', iconColor: '#10b981', title: 'AI工具入门', desc: 'ChatGPT、Claude对比', type: '工具卡', date: '2026-04-30' },
  { iconComponent: AlertTriangle, iconBg: 'rgba(245, 158, 11, 0.1)', iconColor: '#f59e0b', title: '别用WordPress做电商', desc: 'WordPress电商避坑', type: '避坑卡', date: '2026-04-28' }
])

const goBack = () => router.back()
const removeFav = (index) => favorites.value.splice(index, 1)
</script>

<style scoped>
.favorites-container {
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.favorites-header {
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
  cursor: pointer;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.favorites-content {
  flex: 1;
  overflow-y: auto;
}

.fav-item {
  background: #ffffff;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #f5f5f5;
}

.fav-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.fav-type-icon .icon {
  width: 20px;
  height: 20px;
}

.fav-content {
  flex: 1;
}

.fav-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.fav-desc {
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
}

.fav-meta {
  display: flex;
  gap: 8px;
}

.fav-tag {
  font-size: 11px;
  color: #999999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 10px;
}

.fav-date {
  font-size: 11px;
  color: #cccccc;
}

.remove-btn {
  width: 18px;
  height: 18px;
  color: #cccccc;
  cursor: pointer;
}
</style>
