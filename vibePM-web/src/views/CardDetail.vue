<template>
  <div class="detail-container">
    <div class="detail-header">
      <Icon icon="ri:arrow-left-s-line" class="back-btn" @click="goBack" />
      <div class="header-title">卡片详情</div>
      <Icon icon="ri:share-line" class="share-btn" />
    </div>
    
    <div class="detail-content" v-if="post">
      <div class="card-banner" :style="{ background: bannerGradient }">
        <Icon :icon="bannerIcon" class="banner-icon" />
      </div>
      
      <div class="card-info">
        <div class="card-type-row">
          <div class="type-tag" :style="typeTagStyle">{{ post.category || '概念' }}</div>
          <div class="type-tag" style="background: rgba(6, 182, 212, 0.1); color: #06b6d4;">{{ post.type || '技术地图' }}</div>
        </div>
        
        <h1 class="detail-title">{{ post.title }}</h1>
        <p class="detail-desc">{{ post.content ? post.content.replace(/[#*>`]/g, '').substring(0, 80) + '...' : '' }}</p>
        
        <div class="detail-tags">
          <span class="detail-tag" v-for="tag in (post.tags || [])" :key="tag">{{ tag }}</span>
        </div>
      </div>
      
      <div class="detail-body" v-html="renderedContent"></div>
    </div>

    <div class="detail-content" v-else-if="loading">
      <div class="loading-state">加载中...</div>
    </div>
    
    <div class="detail-footer">
      <div class="action-btn" @click="toggleFav">
        <Icon :icon="isFav ? 'ri:heart-3-fill' : 'ri:heart-3-line'" class="action-icon" :class="{ filled: isFav }" />
        <span class="action-text">收藏</span>
      </div>
      <div class="action-btn" @click="handleShare">
        <Icon icon="ri:share-line" class="action-icon" />
        <span class="action-text">分享</span>
      </div>
      <div class="action-btn" @click="handleExport">
        <Icon icon="ri:download-line" class="action-icon" />
        <span class="action-text">导出</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { usePostStore } from '../stores/postStore.js'
import { useFavoriteStore } from '../stores/favoriteStore.js'
import { exportApi } from '../services/api.js'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()
const favoriteStore = useFavoriteStore()
const isFav = ref(false)
const loading = ref(true)

const post = computed(() => postStore.currentPost)

const bannerGradient = computed(() => {
  const gradients = {
    concept: 'linear-gradient(135deg, #FF2442, #FF4D6A)',
    practice: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    tech: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    ai: 'linear-gradient(135deg, #FF4D6A, #ec4899)',
    guide: 'linear-gradient(135deg, #10b981, #06b6d4)'
  }
  return gradients[post.value?.type] || gradients.concept
})

const bannerIcon = computed(() => {
  const icons = {
    concept: 'ri:lightbulb-line',
    practice: 'ri:code-s-slash-line',
    tech: 'ri:cpu-line',
    ai: 'ri:robot-line',
    guide: 'ri:compass-3-line'
  }
  return icons[post.value?.type] || 'ri:lightbulb-line'
})

const typeTagStyle = computed(() => {
  const styles = {
    concept: { background: 'rgba(255, 36, 66, 0.1)', color: '#FF2442' },
    practice: { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
    tech: { background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' },
    ai: { background: 'rgba(255, 77, 106, 0.1)', color: '#FF4D6A' },
    guide: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }
  }
  return styles[post.value?.type] || styles.concept
})

const renderedContent = computed(() => {
  if (!post.value?.content) return '<p>暂无内容</p>'
  return post.value.content
    .replace(/^### (.*$)/gm, '<h3 class="section-title">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="section-title">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="section-title">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul class="section-list">$1</ul>')
    .replace(/^> (.*$)/gm, '<div class="highlight-box"><p class="highlight-text">$1</p></div>')
    .replace(/\n\n/g, '</p><p class="section-text">')
    .replace(/^(?!<)/, '<p class="section-text">')
    .replace(/(?!>)$/, '</p>')
})

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await postStore.loadPostDetail(id)
  }
  loading.value = false
})

const goBack = () => router.back()

const toggleFav = async () => {
  if (!post.value) return
  if (isFav.value) {
    await favoriteStore.removeFavorite(post.value.id)
  } else {
    await favoriteStore.addFavorite(post.value.id)
  }
  isFav.value = !isFav.value
}

const handleShare = () => {
  if (navigator.share && post.value) {
    navigator.share({ title: post.value.title, text: post.value.content?.substring(0, 100), url: window.location.href })
  }
}

const handleExport = async () => {
  if (!post.value) return
  try {
    const result = await exportApi.exportContent('md', [post.value.id], { includeTags: true, includeDates: true })
    if (result.code === 200 && result.data?.downloadUrl) {
      const a = document.createElement('a')
      a.href = result.data.downloadUrl
      a.download = result.data.fileName
      a.click()
    } else {
      // API不可用时，使用浏览器原生方式导出为文本
      const content = `# ${post.value.title}\n\n${post.value.content || ''}`
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${post.value.title || 'export'}.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('导出失败，使用本地导出:', error)
    // 降级为浏览器原生导出
    if (post.value) {
      const content = `# ${post.value.title}\n\n${post.value.content || ''}`
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${post.value.title || 'export'}.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.detail-container {
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.detail-header {
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #eeeeee;
}

.back-btn, .share-btn {
  font-size: 24px;
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

.detail-content {
  flex: 1;
  overflow-y: auto;
}

.loading-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 14px;
}

.card-banner {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-icon {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.9);
}

.card-info {
  background: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.card-type-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.type-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.detail-desc {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-tag {
  font-size: 12px;
  color: #666666;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.detail-body {
  background: #ffffff;
  padding: 16px;
  margin-top: 8px;
}

.detail-footer {
  height: 56px;
  background: #ffffff;
  display: flex;
  border-top: 1px solid #eeeeee;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.action-icon {
  font-size: 20px;
  color: #666666;
  margin-bottom: 4px;
}

.action-icon.filled {
  color: #ff2442;
}

.action-text {
  font-size: 11px;
  color: #666666;
}
</style>

<style>
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  margin-top: 20px;
}

.section-title:first-child {
  margin-top: 0;
}

.section-text {
  font-size: 14px;
  color: #333333;
  line-height: 1.8;
  margin-bottom: 12px;
}

.section-list {
  padding-left: 20px;
  margin-bottom: 16px;
}

.section-list li {
  font-size: 14px;
  color: #333333;
  line-height: 2;
}

.highlight-box {
  background: rgba(255, 36, 66, 0.05);
  border-left: 4px solid #FF2442;
  padding: 12px;
  border-radius: 0 8px 8px 0;
  margin-top: 16px;
}

.highlight-text {
  font-size: 14px;
  color: #333333;
  line-height: 1.6;
}
</style>
