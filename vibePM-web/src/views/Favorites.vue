<template>
  <div class="favorites-container">
    <div class="favorites-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="header-title">我的收藏</div>
      <div class="header-action"></div>
    </div>
    
    <div class="favorites-content">
      <div class="favorites-list" v-if="mappedFavorites.length > 0">
        <div class="fav-item" v-for="(item, index) in mappedFavorites" :key="item.id || index">
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
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <Icon icon="ri:heart-3-line" class="empty-icon" />
        <p class="empty-text">还没有收藏内容</p>
        <p class="empty-hint">浏览卡片时点击收藏按钮即可添加</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, X, Lightbulb, Target, Wrench, AlertTriangle } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'
import { useFavoriteStore } from '../stores/favoriteStore.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const { favorites, loading, hasMore } = storeToRefs(favoriteStore)

// 图标映射：根据API返回的type字段匹配对应图标
const iconMap = {
  concept: { iconComponent: Lightbulb, iconBg: 'rgba(255, 36, 66, 0.1)', iconColor: '#FF2442' },
  scenario: { iconComponent: Target, iconBg: 'rgba(6, 182, 212, 0.1)', iconColor: '#06b6d4' },
  tool: { iconComponent: Wrench, iconBg: 'rgba(16, 185, 129, 0.1)', iconColor: '#10b981' },
  warning: { iconComponent: AlertTriangle, iconBg: 'rgba(245, 158, 11, 0.1)', iconColor: '#f59e0b' },
  default: { iconComponent: Lightbulb, iconBg: 'rgba(255, 36, 66, 0.1)', iconColor: '#FF2442' }
}

function mapFavItem(item) {
  const iconInfo = iconMap[item.type || item.category] || iconMap.default
  return {
    ...item,
    iconComponent: iconInfo.iconComponent,
    iconBg: iconInfo.iconBg,
    iconColor: iconInfo.iconColor
  }
}

// 本地默认收藏数据
const localFavorites = ref([
  { id: 'lf1', title: 'API 就像餐厅服务员', desc: '三分钟读懂接口原理', type: 'concept', date: '2026-05-01' },
  { id: 'lf2', title: '电商网站全栈选型', desc: '从WordPress到Next.js的选型之路', type: 'scenario', date: '2026-04-30' },
  { id: 'lf3', title: 'React vs Vue 对比', desc: '2026年该选哪一个？', type: 'tool', date: '2026-04-29' },
  { id: 'lf4', title: '别用WordPress做电商', desc: '性能瓶颈和扩展困难的真实案例', type: 'warning', date: '2026-04-28' }
])

const mappedFavorites = computed(() => {
  if (favorites.value.length > 0) {
    return favorites.value.map(mapFavItem)
  }
  // API数据为空时使用本地数据
  return localFavorites.value.map(mapFavItem)
})

onMounted(async () => {
  try {
    await favoriteStore.loadFavorites(true)
  } catch (error) {
    console.error('加载收藏失败:', error)
  }
})

const goBack = () => router.back()
const removeFav = (index) => {
  if (favorites.value.length > 0) {
    // API数据模式：通过store删除
    const item = favorites.value[index]
    if (item && item.id) {
      favoriteStore.removeFavorite(item.id)
    }
  } else {
    // 本地数据模式：直接从localFavorites中删除
    if (index >= 0 && index < localFavorites.value.length) {
      localFavorites.value.splice(index, 1)
    }
  }
}

const onLoadMore = () => {
  if (hasMore.value && !loading.value) {
    favoriteStore.loadFavorites()
  }
}
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

.empty-icon {
  font-size: 64px;
  color: #E5E5E5;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #999999;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 12px;
  color: #CCCCCC;
}
</style>
