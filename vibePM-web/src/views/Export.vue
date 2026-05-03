<template>
  <div class="export-container">
    <div class="export-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="header-title">导出笔记</div>
      <div class="header-action"></div>
    </div>
    
    <div class="export-content">
      <div class="export-section">
        <h3 class="section-title">选择导出内容</h3>
        <div class="export-options">
          <div class="export-option" :class="{ selected: selectedType === 'favorites' }" @click="selectedType = 'favorites'">
            <div class="option-icon" style="background: rgba(99, 102, 241, 0.1);">
              <Heart class="icon" style="color: #6366f1;" />
            </div>
            <div class="option-info">
              <span class="option-title">我的收藏</span>
              <span class="option-desc">28个收藏内容</span>
            </div>
            <div class="radio" :class="{ checked: selectedType === 'favorites' }"></div>
          </div>
          <div class="export-option" :class="{ selected: selectedType === 'paths' }" @click="selectedType = 'paths'">
            <div class="option-icon" style="background: rgba(16, 185, 129, 0.1);">
              <Map class="icon" style="color: #10b981;" />
            </div>
            <div class="option-info">
              <span class="option-title">学习路径</span>
              <span class="option-desc">5个学习路径</span>
            </div>
            <div class="radio" :class="{ checked: selectedType === 'paths' }"></div>
          </div>
          <div class="export-option" :class="{ selected: selectedType === 'notes' }" @click="selectedType = 'notes'">
            <div class="option-icon" style="background: rgba(245, 158, 11, 0.1);">
              <FileText class="icon" style="color: #f59e0b;" />
            </div>
            <div class="option-info">
              <span class="option-title">学习笔记</span>
              <span class="option-desc">12篇笔记</span>
            </div>
            <div class="radio" :class="{ checked: selectedType === 'notes' }"></div>
          </div>
        </div>
      </div>
      
      <div class="export-section">
        <h3 class="section-title">选择导出格式</h3>
        <div class="format-options">
          <div class="format-option" :class="{ selected: selectedFormat === 'pdf' }" @click="selectedFormat = 'pdf'">
            <FileText class="format-icon" />
            <span class="format-text">PDF</span>
          </div>
          <div class="format-option" :class="{ selected: selectedFormat === 'markdown' }" @click="selectedFormat = 'markdown'">
            <File class="format-icon" />
            <span class="format-text">Markdown</span>
          </div>
          <div class="format-option" :class="{ selected: selectedFormat === 'html' }" @click="selectedFormat = 'html'">
            <Globe class="format-icon" />
            <span class="format-text">HTML</span>
          </div>
        </div>
      </div>
      
      <div class="export-section">
        <h3 class="section-title">导出设置</h3>
        <div class="setting-item">
          <span class="setting-label">包含图片</span>
          <el-switch v-model="settings.includeImages" />
        </div>
        <div class="setting-item">
          <span class="setting-label">包含标签</span>
          <el-switch v-model="settings.includeTags" />
        </div>
        <div class="setting-item">
          <span class="setting-label">包含日期</span>
          <el-switch v-model="settings.includeDates" />
        </div>
      </div>
    </div>
    
    <div class="export-footer">
      <div class="export-btn" @click="handleExport">
        <Download class="btn-icon" />
        <span class="btn-text">导出</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Heart, Map, FileText, Download, File, Globe } from 'lucide-vue-next'

const router = useRouter()
const selectedType = ref('favorites')
const selectedFormat = ref('pdf')
const settings = ref({
  includeImages: true,
  includeTags: true,
  includeDates: false
})

const goBack = () => router.back()
const handleExport = () => {
  alert('导出功能开发中...')
}
</script>

<style scoped>
.export-container {
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.export-header {
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

.export-content {
  flex: 1;
  overflow-y: auto;
}

.export-section {
  background: #ffffff;
  padding: 16px;
  margin-bottom: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-option {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
}

.export-option.selected {
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
  margin-right: 12px;
}

.option-icon .icon {
  width: 20px;
  height: 20px;
}

.option-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.option-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #999999;
}

.radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cccccc;
}

.radio.checked {
  border-color: #6366f1;
  background: #6366f1;
}

.format-options {
  display: flex;
  gap: 12px;
}

.format-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
}

.format-option.selected {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.05);
}

.format-icon {
  width: 24px;
  height: 24px;
  color: #666666;
  margin-bottom: 8px;
}

.format-text {
  font-size: 13px;
  color: #333333;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  color: #333333;
}

.export-footer {
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #eeeeee;
}

.export-btn {
  height: 44px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
  margin-right: 8px;
}

.btn-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}
</style>
