<template>
  <div class="detail-container">
    <div class="detail-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="header-title">卡片详情</div>
      <Share2 class="share-btn" />
    </div>
    
    <div class="detail-content">
      <div class="card-banner" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
        <Lightbulb class="banner-icon" />
      </div>
      
      <div class="card-info">
        <div class="card-type-row">
          <div class="type-tag" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">概念卡</div>
          <div class="type-tag" style="background: rgba(6, 182, 212, 0.1); color: #06b6d4;">技术地图</div>
        </div>
        
        <h1 class="detail-title">API就像餐厅服务员</h1>
        <p class="detail-desc">用生活化比喻，解释API是什么、怎么工作、为什么需要它</p>
        
        <div class="detail-tags">
          <span class="detail-tag">API</span>
          <span class="detail-tag">技术概念</span>
          <span class="detail-tag">入门</span>
        </div>
      </div>
      
      <div class="detail-body">
        <h2 class="section-title">什么是API？</h2>
        <p class="section-text">想象你去餐厅吃饭。你坐在桌前，看着菜单点菜。服务员把你的订单送到厨房，然后把做好的菜端给你。</p>
        <p class="section-text">在这个比喻中：</p>
        <ul class="section-list">
          <li><strong>你</strong> = 应用程序或用户</li>
          <li><strong>菜单</strong> = API文档</li>
          <li><strong>服务员</strong> = API</li>
          <li><strong>厨房</strong> = 服务器或数据库</li>
        </ul>
        
        <h2 class="section-title">API的作用</h2>
        <p class="section-text">API就像服务员一样，负责传递信息。它让不同的软件系统能够互相通信，而不需要了解对方的内部工作原理。</p>
        
        <div class="highlight-box">
          <Info class="highlight-icon" />
          <p class="highlight-text">API让复杂的技术变得简单，你不需要知道厨房怎么做菜，只需要告诉服务员你想吃什么。</p>
        </div>
      </div>
    </div>
    
    <div class="detail-footer">
      <div class="action-btn" @click="toggleFav">
        <Heart class="action-icon" :class="{ filled: isFav }" />
        <span class="action-text">收藏</span>
      </div>
      <div class="action-btn">
        <Share2 class="action-icon" />
        <span class="action-text">分享</span>
      </div>
      <div class="action-btn">
        <Download class="action-icon" />
        <span class="action-text">导出</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Share2, Lightbulb, Heart, Download, Info } from 'lucide-vue-next'

const router = useRouter()
const isFav = ref(false)

const goBack = () => router.back()
const toggleFav = () => isFav.value = !isFav.value
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

.detail-content {
  flex: 1;
  overflow-y: auto;
}

.card-banner {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-icon {
  width: 48px;
  height: 48px;
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
  background: rgba(99, 102, 241, 0.05);
  border-left: 4px solid #6366f1;
  padding: 12px;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.highlight-icon {
  width: 20px;
  height: 20px;
  color: #6366f1;
  margin-right: 12px;
}

.highlight-text {
  font-size: 14px;
  color: #333333;
  line-height: 1.6;
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
  width: 20px;
  height: 20px;
  color: #666666;
  margin-bottom: 4px;
}

.action-icon.filled {
  color: #ff2442;
  fill: #ff2442;
}

.action-text {
  font-size: 11px;
  color: #666666;
}
</style>
