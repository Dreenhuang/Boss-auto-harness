<template>
	<view class="kb-container">
		<view class="header">
			<text class="header-title">我的知识库</text>
		</view>
		
		<!-- 统计卡片 -->
		<view class="stats-row">
			<view class="stat-card">
				<text class="stat-num">28</text>
				<text class="stat-label">收藏</text>
			</view>
			<view class="stat-card">
				<text class="stat-num">3</text>
				<text class="stat-label">路径</text>
			</view>
			<view class="stat-card">
				<text class="stat-num">156</text>
				<text class="stat-label">浏览</text>
			</view>
		</view>
		
		<!-- 功能入口 -->
		<view class="menu-grid">
			<view class="menu-item" @click="goToFavorites">
				<view class="menu-icon" style="background: #6366f1/10;"></view>
				<text class="menu-text">收藏夹</text>
			</view>
			<view class="menu-item" @click="goToPathList">
				<view class="menu-icon" style="background: #10b981/10;">🗺️</view>
				<text class="menu-text">学习路径</text>
			</view>
			<view class="menu-item" @click="goToExport">
				<view class="menu-icon" style="background: #f59e0b/10;">📤</view>
				<text class="menu-text">导出笔记</text>
			</view>
		</view>
		
		<!-- 最近浏览 -->
		<view class="recent-section">
			<text class="section-title">最近浏览</text>
			<view class="recent-list">
				<view class="recent-item" v-for="(item, index) in recentList" :key="index" @click="goToDetail">
					<view class="recent-icon" :style="{background: item.bg}">{{ item.icon }}</view>
					<view class="recent-info">
						<text class="recent-title">{{ item.title }}</text>
						<text class="recent-time">{{ item.time }}</text>
					</view>
					<text class="recent-arrow">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			recentList: [
				{ icon: '💡', bg: '#06b6d4/10', title: 'API就像餐厅服务员', time: '3天前' },
				{ icon: '⚔️', bg: '#f97316/10', title: 'React vs Vue对比', time: '5天前' },
				{ icon: '️', bg: '#a855f7/10', title: '电商网站全栈选型', time: '1周前' }
			]
		}
	},
	methods: {
		goToFavorites() {
			uni.navigateTo({ url: '/pages/favorites/favorites' })
		},
		goToPathList() {
			uni.navigateTo({ url: '/pages/path-list/path-list' })
		},
		goToExport() {
			uni.navigateTo({ url: '/pages/tour/tour' })
		},
		goToDetail() {
			uni.navigateTo({ url: '/pages/card-detail/card-detail' })
		}
	}
}
</script>

<style scoped>
.kb-container {
	min-height: 100vh;
	background: #fafafa;
}

.header {
	height: 44px;
	background: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid #eeeeee;
}

.header-title {
	font-size: 17px;
	font-weight: 600;
	color: #1a1a1a;
}

.stats-row {
	display: flex;
	padding: 16px;
	gap: 12px;
}

.stat-card {
	flex: 1;
	background: #ffffff;
	border-radius: 12px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.stat-num {
	font-size: 24px;
	font-weight: 700;
	color: #6366f1;
	margin-bottom: 4px;
}

.stat-label {
	font-size: 12px;
	color: #999999;
}

.menu-grid {
	display: flex;
	padding: 0 16px 16px;
	gap: 12px;
}

.menu-item {
	flex: 1;
	background: #ffffff;
	border-radius: 12px;
	padding: 20px 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.menu-icon {
	width: 40px;
	height: 40px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	margin-bottom: 8px;
}

.menu-text {
	font-size: 13px;
	color: #333333;
}

.recent-section {
	padding: 0 16px 16px;
}

.section-title {
	font-size: 15px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 12px;
}

.recent-list {
	background: #ffffff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.recent-item {
	display: flex;
	align-items: center;
	padding: 14px 16px;
	border-bottom: 1px solid #f5f5f5;
}

.recent-item:last-child {
	border-bottom: none;
}

.recent-icon {
	width: 36px;
	height: 36px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	margin-right: 12px;
}

.recent-info {
	flex: 1;
}

.recent-title {
	font-size: 14px;
	color: #333333;
	display: block;
	margin-bottom: 4px;
}

.recent-time {
	font-size: 12px;
	color: #999999;
}

.recent-arrow {
	font-size: 18px;
	color: #cccccc;
}
</style>
