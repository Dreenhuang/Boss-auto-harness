<template>
  <div class="questionnaire-container">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <ChevronLeft class="icon" />
        <span>上一步</span>
      </div>
      <div class="skip-btn" @click="skipQuestionnaire">跳过</div>
    </div>
    
    <div class="content">
      <h2 class="step-title">你了解哪个方向？</h2>
      <p class="step-desc">可多选，最多3个</p>
      
      <div class="options-grid">
        <div 
          class="option-card" 
          :class="{ selected: selectedOptions.includes('tech') }" 
          @click="toggleOption('tech')"
        >
          <div class="option-icon tech-icon">
            <Globe class="icon" />
          </div>
          <span class="option-text">技术地图</span>
        </div>
        <div 
          class="option-card" 
          :class="{ selected: selectedOptions.includes('thinking') }" 
          @click="toggleOption('thinking')"
        >
          <div class="option-icon thinking-icon">
            <Brain class="icon" />
          </div>
          <span class="option-text">思维模型</span>
        </div>
        <div 
          class="option-card" 
          :class="{ selected: selectedOptions.includes('practice') }" 
          @click="toggleOption('practice')"
        >
          <div class="option-icon practice-icon">
            <Wrench class="icon" />
          </div>
          <span class="option-text">实战场景</span>
        </div>
        <div 
          class="option-card" 
          :class="{ selected: selectedOptions.includes('avoid') }" 
          @click="toggleOption('avoid')"
        >
          <div class="option-icon avoid-icon">
            <AlertTriangle class="icon" />
          </div>
          <span class="option-text">避坑指南</span>
        </div>
        <div 
          class="option-card" 
          :class="{ selected: selectedOptions.includes('ai') }" 
          @click="toggleOption('ai')"
        >
          <div class="option-icon ai-icon">
            <Bot class="icon" />
          </div>
          <span class="option-text">AI指挥术</span>
        </div>
        <div 
          class="option-card" 
          :class="{ selected: selectedOptions.includes('resource') }" 
          @click="toggleOption('resource')"
        >
          <div class="option-icon resource-icon">
            <BookOpen class="icon" />
          </div>
          <span class="option-text">资源推荐</span>
        </div>
      </div>
      
      <div class="level-section">
        <h3 class="level-title">你的技术水平？</h3>
        <div class="level-options">
          <div class="level-option" :class="{ selected: selectedLevel === 'beginner' }" @click="selectLevel('beginner')">
            <div class="radio" :class="{ checked: selectedLevel === 'beginner' }"></div>
            <span class="level-text">完全小白</span>
          </div>
          <div class="level-option" :class="{ selected: selectedLevel === 'some' }" @click="selectLevel('some')">
            <div class="radio" :class="{ checked: selectedLevel === 'some' }"></div>
            <span class="level-text">略有了解</span>
          </div>
          <div class="level-option" :class="{ selected: selectedLevel === 'basic' }" @click="selectLevel('basic')">
            <div class="radio" :class="{ checked: selectedLevel === 'basic' }"></div>
            <span class="level-text">有基础</span>
          </div>
        </div>
      </div>
      
      <div class="want-section">
        <h3 class="want-title">最想学什么？</h3>
        <el-select v-model="wantLearn" placeholder="请选择一个场景" class="want-select">
          <el-option label="做一个电商网站" value="ecommerce" />
          <el-option label="开发一个小程序" value="miniprogram" />
          <el-option label="搭建个人博客" value="blog" />
          <el-option label="学习AI工具使用" value="ai-tools" />
        </el-select>
      </div>
    </div>
    
    <div class="bottom-btn" @click="startLearning">
      <span class="btn-text">根据我的选择开始学习</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Globe, Brain, Wrench, AlertTriangle, Bot, BookOpen } from 'lucide-vue-next'

const router = useRouter()
const selectedOptions = ref([])
const selectedLevel = ref('')
const wantLearn = ref('')

const goBack = () => {
  router.back()
}

const skipQuestionnaire = () => {
  router.push('/main/home')
}

const toggleOption = (option) => {
  const index = selectedOptions.value.indexOf(option)
  if (index > -1) {
    selectedOptions.value.splice(index, 1)
  } else if (selectedOptions.value.length < 3) {
    selectedOptions.value.push(option)
  }
}

const selectLevel = (level) => {
  selectedLevel.value = level
}

const startLearning = () => {
  router.push('/main/home')
}
</script>

<style scoped>
.questionnaire-container {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.header {
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eeeeee;
}

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.back-btn .icon {
  width: 20px;
  height: 20px;
  color: #333333;
}

.back-btn span {
  font-size: 14px;
  color: #333333;
  margin-left: 4px;
}

.skip-btn {
  font-size: 14px;
  color: #666666;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 24px 16px;
  overflow-y: auto;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.step-desc {
  font-size: 14px;
  color: #999999;
  margin-top: 8px;
  margin-bottom: 24px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.option-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card.selected {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.05);
}

.option-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.option-icon .icon {
  width: 20px;
  height: 20px;
}

.tech-icon { background: rgba(99, 102, 241, 0.1); }
.tech-icon .icon { color: #6366f1; }

.thinking-icon { background: rgba(139, 92, 246, 0.1); }
.thinking-icon .icon { color: #8b5cf6; }

.practice-icon { background: rgba(16, 185, 129, 0.1); }
.practice-icon .icon { color: #10b981; }

.avoid-icon { background: rgba(245, 158, 11, 0.1); }
.avoid-icon .icon { color: #f59e0b; }

.ai-icon { background: rgba(236, 72, 153, 0.1); }
.ai-icon .icon { color: #ec4899; }

.resource-icon { background: rgba(6, 182, 212, 0.1); }
.resource-icon .icon { color: #06b6d4; }

.option-text {
  font-size: 13px;
  color: #333333;
  text-align: center;
}

.level-section {
  margin-bottom: 24px;
}

.level-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.level-options {
  display: flex;
  gap: 16px;
}

.level-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cccccc;
  margin-right: 8px;
  transition: all 0.2s ease;
}

.radio.checked {
  border-color: #6366f1;
  background: #6366f1;
}

.level-text {
  font-size: 14px;
  color: #333333;
}

.want-section {
  margin-bottom: 24px;
}

.want-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.want-select {
  width: 100%;
}

.bottom-btn {
  height: 56px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}
</style>
