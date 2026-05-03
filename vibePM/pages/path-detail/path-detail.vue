<template>
	<view class="path-detail-container">
		<view class="nav-bar">
			<view class="nav-back" @click="goBack">
				<text class="back-icon">‹</text>
				<text class="back-text">返回</text>
			</view>
			<view class="nav-more">⋯</view>
		</view>
		
		<scroll-view class="content-scroll" scroll-y>
			<view class="path-header" style="background: linear-gradient(90deg, #a855f7, #ec4899);">
				<text class="header-icon">️</text>
				<text class="header-title">电商网站全栈选型</text>
				<text class="header-desc">从前端到后端到数据库，完整的电商技术选型路径</text>
			</view>
			
			<view class="progress-section">
				<view class="progress-info">
					<text class="progress-label">学习进度</text>
					<text class="progress-value">65%</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" style="width: 65%; background: linear-gradient(90deg, #a855f7, #ec4899);"></view>
				</view>
			</view>
			
			<view class="nodes-section">
				<text class="section-title">学习节点</text>
				<view class="node-list">
					<view class="node-item" :class="{completed: node.completed}" v-for="(node, index) in nodes" :key="index">
						<view class="node-indicator">
							<view class="node-dot" :class="{completed: node.completed}"></view>
							<view class="node-line" v-if="index < nodes.length - 1" :class="{completed: node.completed}"></view>
						</view>
						<view class="node-content">
							<text class="node-title">{{ node.title }}</text>
							<text class="node-desc">{{ node.desc }}</text>
							<view class="node-tags">
								<text class="node-tag" v-for="tag in node.tags" :key="tag">{{ tag }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="bottom-btn" @click="startLearning">
			<text class="btn-text">继续学习</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nodes: [
				{ title: '电商网站技术选型概述', desc: '了解电商网站的核心技术需求', tags: ['概念卡'], completed: true },
				{ title: '前端框架选择', desc: 'React vs Vue vs 小程序方案对比', tags: ['对比卡'], completed: true },
				{ title: '后端架构方案', desc: 'Node.js vs Java vs Python后端选型', tags: ['对比卡'], completed: true },
				{ title: '数据库选择', desc: 'MySQL vs MongoDB vs PostgreSQL', tags: ['对比卡'], completed: false },
				{ title: '支付系统集成', desc: '支付宝、微信支付接入方案', tags: ['实战场景'], completed: false },
				{ title: '部署与运维', desc: '云服务器选择与部署方案', tags: ['实战场景'], completed: false }
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		startLearning() {
			uni.navigateTo({ url: '/pages/card-detail/card-detail' })
		}
	}
}
</script>

<style scoped>
.path-detail-container {
	height: 100vh;
	background: #fafafa;
	display: flex;
	flex-direction: column;
}

.nav-bar {
	height: 44px;
	background: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	border-bottom: 1px solid #eeeeee;
}

.nav-back {
	display: flex;
	align-items: center;
}

.back-icon {
	font-size: 24px;
	color: #333333;
}

.back-text {
	font-size: 14px;
	color: #333333;
	margin-left: 4px;
}

.nav-more {
	font-size: 20px;
	color: #666666;
}

.content-scroll {
	flex: 1;
}

.path-header {
	padding: 24px 16px;
}

.header-icon {
	font-size: 32px;
	display: block;
	margin-bottom: 12px;
}

.header-title {
	font-size: 20px;
	font-weight: 700;
	color: #ffffff;
	display: block;
	margin-bottom: 8px;
}

.header-desc {
	font-size: 14px;
	color: rgba(255,255,255,0.8);
	display: block;
}

.progress-section {
	background: #ffffff;
	margin: 12px 16px;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.progress-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
}

.progress-label {
	font-size: 14px;
	color: #666666;
}

.progress-value {
	font-size: 14px;
	font-weight: 600;
	color: #a855f7;
}

.progress-bar {
	height: 8px;
	background: #f5f5f5;
	border-radius: 4px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	border-radius: 4px;
}

.nodes-section {
	padding: 0 16px 16px;
}

.section-title {
	font-size: 15px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 12px;
}

.node-list {
	background: #ffffff;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.node-item {
	display: flex;
	padding: 12px 0;
}

.node-indicator {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 12px;
	position: relative;
}

.node-dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	border: 2px solid #cccccc;
	background: #ffffff;
	z-index: 1;
}

.node-dot.completed {
	border-color: #10b981;
	background: #10b981;
}

.node-line {
	width: 2px;
	flex: 1;
	background: #eeeeee;
	margin: 4px 0;
}

.node-line.completed {
	background: #10b981;
}

.node-content {
	flex: 1;
}

.node-title {
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 4px;
}

.node-desc {
	font-size: 12px;
	color: #666666;
	display: block;
	margin-bottom: 8px;
}

.node-tags {
	display: flex;
	gap: 6px;
}

.node-tag {
	font-size: 11px;
	color: #999999;
	background: #f5f5f5;
	padding: 2px 8px;
	border-radius: 10px;
}

.bottom-btn {
	height: 56px;
	background: #6366f1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-text {
	color: #ffffff;
	font-size: 16px;
	font-weight: 600;
}
</style>
