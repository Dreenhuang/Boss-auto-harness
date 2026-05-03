<template>
  <div class="guide-container">
    <div class="skip-btn" @click="skipGuide">跳过</div>
    
    <div class="swiper-wrapper" ref="swiperRef">
      <div class="swiper-slide" v-for="(page, index) in pages" :key="index" :class="{ active: currentPage === index }">
        <div class="page-content">
          <div class="illustration">
            <component :is="page.icon" class="illust-icon" :class="page.iconClass" />
          </div>
          <h2 class="page-title">{{ page.title }}</h2>
          <p class="page-desc">{{ page.desc }}</p>
        </div>
      </div>
    </div>
    
    <div class="dots">
      <div class="dot" :class="{ active: currentPage === i }" v-for="i in 3" :key="i"></div>
    </div>
    
    <div class="btn-wrapper">
      <el-button 
        type="primary" 
        class="action-btn" 
        v-if="currentPage < 2"
        @click="nextPage"
      >
        下一步
      </el-button>
      <el-button 
        type="primary" 
        class="action-btn start-btn" 
        v-else
        @click="startLearning"
      >
        开始学习
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Monitor, Target, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const currentPage = ref(0)
const swiperRef = ref(null)

const pages = [
  {
    icon: Monitor,
    iconClass: 'icon-blue',
    title: '像刷小红书一样学技术',
    desc: '不需要懂代码，用自然语言就能理解复杂技术概念'
  },
  {
    icon: Target,
    iconClass: 'icon-purple',
    title: '从目标出发，不再迷路',
    desc: '不管你想做什么，都能找到对应的技术路径'
  },
  {
    icon: Sparkles,
    iconClass: 'icon-pink',
    title: 'AI帮你整理知识体系',
    desc: '收藏的内容自动归类，还能导出成文档'
  }
]

const nextPage = () => {
  if (currentPage.value < 2) {
    currentPage.value++
  }
}

const skipGuide = () => {
  router.push('/main/home')
}

const startLearning = () => {
  router.push('/questionnaire')
}
</script>

<style scoped>
.guide-container {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.skip-btn {
  position: absolute;
  top: 44px;
  right: 16px;
  font-size: 14px;
  color: #666666;
  padding: 8px 16px;
  z-index: 10;
  cursor: pointer;
}

.swiper-wrapper {
  width: 100%;
  height: calc(100vh - 160px);
  position: relative;
}

.swiper-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.4s ease;
}

.swiper-slide.active {
  opacity: 1;
  transform: translateX(0);
}

.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32px;
}

.illustration {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
  border-radius: 24px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.illust-icon {
  width: 80px;
  height: 80px;
}

.icon-blue {
  color: #6366f1;
}

.icon-purple {
  color: #8b5cf6;
}

.icon-pink {
  color: #a855f7;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 32px;
  text-align: center;
}

.page-desc {
  font-size: 14px;
  color: #666666;
  margin-top: 12px;
  text-align: center;
  line-height: 1.6;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 48px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e5e5e5;
  transition: all 0.3s ease;
}

.dot.active {
  background: #ff2442;
  width: 24px;
  border-radius: 4px;
}

.btn-wrapper {
  position: absolute;
  bottom: 48px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0 24px;
}

.action-btn {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff2442, #ff4d6d);
  border: none;
}

.start-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}
</style>
