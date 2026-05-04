<template>
  <div class="pathdetail-container">
    <div class="pathdetail-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="header-title">路径详情</div>
      <Share2 class="share-btn" />
    </div>
    
    <div class="pathdetail-content">
      <div class="path-banner" :style="{ background: pathBannerGradient }">
        <Map class="banner-icon" />
        <h2 class="banner-title">{{ pathTitle }}</h2>
        <p class="banner-desc">{{ pathDesc }}</p>
      </div>
      
      <div class="path-progress-section">
        <div class="progress-header">
          <span class="progress-text">学习进度</span>
          <span class="progress-percent">{{ completedSteps }}/{{ totalSteps }} 已完成</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
      
      <div class="path-steps">
        <div class="step-item" v-for="(step, index) in steps" :key="index" :class="{ completed: step.completed, current: step.current }">
          <div class="step-indicator">
            <div class="step-dot" :class="{ completed: step.completed, current: step.current }">
              <Check v-if="step.completed" class="check-icon" />
              <span v-else class="step-number">{{ index + 1 }}</span>
            </div>
            <div class="step-line" v-if="index < steps.length - 1"></div>
          </div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <div class="step-tags">
              <span class="step-tag" v-for="tag in step.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pathdetail-footer">
      <div class="continue-btn" @click="handleContinueLearning">
        <span class="btn-text">继续学习</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Share2, Map, Check } from 'lucide-vue-next'
import { usePathStore } from '../stores/pathStore.js'
import { getLocalProgress } from '../services/localData.js'

const router = useRouter()
const route = useRoute()
const pathStore = usePathStore()

const GRADIENTS = [
  'linear-gradient(135deg, #FF2442, #FF4D6A)',
  'linear-gradient(135deg, #06b6d4, #0ea5e9)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #dc2626)'
]

// 默认步骤数据（本地回退）
const defaultSteps = [
  { title: '了解电商技术栈', desc: '认识前端、后端、数据库的基本概念', tags: ['入门', '概念'], completed: true, current: false },
  { title: '前端框架选型', desc: 'React vs Vue vs Next.js 对比分析', tags: ['前端', '选型'], completed: true, current: false },
  { title: '后端技术选型', desc: 'Node.js vs Python vs Java 适用场景', tags: ['后端', '选型'], completed: true, current: false },
  { title: '数据库选型', desc: 'MySQL vs MongoDB vs PostgreSQL 对比', tags: ['数据库', '选型'], completed: false, current: true },
  { title: '部署方案', desc: 'Docker + 云服务部署最佳实践', tags: ['部署', 'DevOps'], completed: false, current: false },
  { title: '安全与性能', desc: 'HTTPS、CDN、缓存策略', tags: ['安全', '性能'], completed: false, current: false },
  { title: '支付集成', desc: 'Stripe、支付宝、微信支付接入', tags: ['支付', '集成'], completed: false, current: false },
  { title: '上线与运维', desc: '监控、日志、自动化运维', tags: ['运维', '上线'], completed: false, current: false }
]

onMounted(async () => {
  const id = route.params.id
  if (id) {
    try {
      await pathStore.loadPathDetail(id)
    } catch (error) {
      console.error('加载路径详情失败:', error)
    }
  }
})

const pathTitle = computed(() => pathStore.currentPath?.title || '电商网站全栈选型')
const pathDesc = computed(() => pathStore.currentPath?.description || pathStore.currentPath?.desc || '从前端到后端到数据库，完整的电商技术选型路径')
const pathBannerGradient = computed(() => pathStore.currentPath?.gradient || GRADIENTS[0])

const steps = computed(() => {
  if (pathStore.currentPath && pathStore.currentPath.steps && pathStore.currentPath.steps.length > 0) {
    return pathStore.currentPath.steps
  }
  return defaultSteps
})

const completedSteps = computed(() => steps.value.filter(s => s.completed).length)
const totalSteps = computed(() => steps.value.length)
const progressPercent = computed(() => totalSteps.value > 0 ? Math.round((completedSteps.value / totalSteps.value) * 100) : 0)

const goBack = () => router.back()

const handleContinueLearning = () => {
  const currentStep = steps.value.find(s => s.current)
  if (currentStep && currentStep.contentId) {
    router.push(`/card-detail/${currentStep.contentId}`)
  } else {
    const nextStep = steps.value.find(s => !s.completed)
    if (nextStep && nextStep.contentId) {
      router.push(`/card-detail/${nextStep.contentId}`)
    } else {
      const id = route.params.id
      const stepIndex = currentStep ? steps.value.indexOf(currentStep) + 1 : 0
      if (stepIndex < steps.value.length) {
        router.push(`/card-detail/${id || 1}`)
      }
    }
  }
}
</script>

<style scoped>
.pathdetail-container {
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.pathdetail-header {
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #eeeeee;
}

.back-btn, .share-btn {
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

.pathdetail-content {
  flex: 1;
  overflow-y: auto;
}

.path-banner {
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
}

.banner-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.banner-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.banner-desc {
  font-size: 14px;
  opacity: 0.9;
}

.path-progress-section {
  background: #ffffff;
  padding: 16px;
  margin-bottom: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.progress-percent {
  font-size: 13px;
  color: #999999;
}

.progress-bar {
  height: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF2442, #FF4D6A);
  border-radius: 4px;
}

.path-steps {
  background: #ffffff;
  padding: 16px;
}

.step-item {
  display: flex;
  margin-bottom: 24px;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 12px;
}

.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #999999;
}

.step-dot.completed {
  background: #10b981;
  color: #ffffff;
}

.step-dot.current {
  background: #FF2442;
  color: #ffffff;
}

.check-icon {
  width: 16px;
  height: 16px;
}

.step-line {
  width: 2px;
  height: 40px;
  background: #eeeeee;
  margin-top: 4px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
}

.step-tags {
  display: flex;
  gap: 6px;
}

.step-tag {
  font-size: 11px;
  color: #666666;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 10px;
}

.pathdetail-footer {
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #eeeeee;
}

.continue-btn {
  height: 44px;
  background: linear-gradient(135deg, #FF2442, #FF4D6A);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}
</style>
