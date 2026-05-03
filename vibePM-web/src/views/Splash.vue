<template>
  <div class="splash-container">
    <div class="logo-section">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fill-opacity="0.9"/>
          <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="title">AI学习助手</h1>
      <p class="subtitle">Vibe PM</p>
      <div class="divider"></div>
      <p class="version">V1.0 · 2026</p>
    </div>
    <div class="bottom-bar"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push('/guide')
  }, 2000)
})
</script>

<style scoped>
.splash-container {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -120px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff2442, #ff4d6d);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(255, 36, 66, 0.3);
}

.logo-svg {
  width: 40px;
  height: 40px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666666;
  margin-bottom: 16px;
}

.divider {
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, #e0e0e0, #f5f5f5);
  margin-bottom: 8px;
  border-radius: 1px;
}

.version {
  font-size: 12px;
  color: #999999;
}

.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7);
}
</style>
