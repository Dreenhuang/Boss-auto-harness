<template>
	<view class="detail-container">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-back" @click="goBack">
				<text class="back-icon">‹</text>
				<text class="back-text">返回</text>
			</view>
			<view class="nav-more">⋯</view>
		</view>
		
		<!-- 卡片内容 -->
		<scroll-view class="content-scroll" scroll-y>
			<view class="card-content">
				<view class="card-type-header" style="background: linear-gradient(90deg, #06b6d4, #10b981);">
					<text class="type-icon">💡</text>
					<text class="type-name">概念卡</text>
				</view>
				
				<view class="card-body">
					<text class="card-title">API就像餐厅服务员</text>
					<text class="card-subtitle">用不同软件之间交流的比喻，就像餐厅服务员负责传递客人的需求和厨房之间的需求。</text>
					
					<view class="content-section">
						<text class="section-title">📌 核心概念</text>
						<view class="point-list">
							<view class="point-item">
								<text class="point-dot">•</text>
								<text class="point-text"><text class="point-bold">客人点单</text> = API接口</text>
							</view>
							<view class="point-item">
								<text class="point-dot">•</text>
								<text class="point-text"><text class="point-bold">服务员传菜</text> = API接口</text>
							</view>
							<view class="point-item">
								<text class="point-dot">•</text>
								<text class="point-text"><text class="point-bold">厨房做菜</text> = 处理数据</text>
							</view>
							<view class="point-item">
								<text class="point-dot">•</text>
								<text class="point-text"><text class="point-bold">上菜给客人</text> = 返回结果</text>
							</view>
						</view>
					</view>
					
					<view class="content-section">
						<text class="section-title">🔑 三种常见API类型对比</text>
						<view class="compare-table">
							<view class="table-header">
								<text class="th">类型</text>
								<text class="th">特点</text>
								<text class="th">举例</text>
							</view>
							<view class="table-row">
								<text class="td">RESTful</text>
								<text class="td">最通用</text>
								<text class="td">大部分Web API</text>
							</view>
							<view class="table-row">
								<text class="td">GraphQL</text>
								<text class="td">灵活获取</text>
								<text class="td">多个数据</text>
							</view>
							<view class="table-row">
								<text class="td">gRPC</text>
								<text class="td">高性能通信</text>
								<text class="td">微服务间通信</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="action-item" @click="handleCollect">
				<text class="action-icon">♡</text>
				<text class="action-text">收藏</text>
			</view>
			<view class="action-item" @click="handleAddPath">
				<text class="action-icon">+</text>
				<text class="action-text">加入路径</text>
			</view>
			<view class="action-item" @click="handleShare">
				<text class="action-icon">↗</text>
				<text class="action-text">分享</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		goBack() {
			uni.navigateBack()
		},
		handleCollect() {
			uni.showToast({ title: '已收藏', icon: 'success' })
		},
		handleAddPath() {
			uni.showToast({ title: '已加入路径', icon: 'success' })
		},
		handleShare() {
			uni.showToast({ title: '分享功能', icon: 'none' })
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

.card-content {
	background: #ffffff;
	margin: 8px;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.card-type-header {
	height: 4px;
}

.card-body {
	padding: 16px;
}

.card-title {
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 8px;
}

.card-subtitle {
	font-size: 14px;
	color: #666666;
	line-height: 1.6;
	display: block;
	margin-bottom: 24px;
}

.content-section {
	margin-bottom: 24px;
}

.section-title {
	font-size: 15px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 12px;
}

.point-list {
	background: #f5f5f5;
	border-radius: 8px;
	padding: 12px;
}

.point-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 8px;
}

.point-item:last-child {
	margin-bottom: 0;
}

.point-dot {
	color: #6366f1;
	margin-right: 8px;
	font-size: 16px;
}

.point-text {
	font-size: 14px;
	color: #333333;
	line-height: 1.5;
}

.point-bold {
	font-weight: 600;
	color: #1a1a1a;
}

.compare-table {
	background: #f5f5f5;
	border-radius: 8px;
	overflow: hidden;
}

.table-header {
	display: flex;
	background: #6366f1;
}

.th {
	flex: 1;
	padding: 10px 8px;
	font-size: 12px;
	font-weight: 600;
	color: #ffffff;
	text-align: center;
}

.table-row {
	display: flex;
	border-bottom: 1px solid #eeeeee;
}

.table-row:last-child {
	border-bottom: none;
}

.td {
	flex: 1;
	padding: 10px 8px;
	font-size: 12px;
	color: #333333;
	text-align: center;
}

.bottom-bar {
	height: 56px;
	background: #ffffff;
	display: flex;
	align-items: center;
	border-top: 1px solid #eeeeee;
}

.action-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.action-icon {
	font-size: 20px;
	color: #666666;
	margin-bottom: 2px;
}

.action-text {
	font-size: 11px;
	color: #666666;
}
</style>
