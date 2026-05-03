<template>
	<view class="path-list-container">
		<view class="header">
			<text class="header-title">学习路径</text>
		</view>
		
		<scroll-view class="content-scroll" scroll-y>
			<view class="path-list">
				<view class="path-card" v-for="(path, index) in pathList" :key="index" @click="goToDetail(path)">
					<view class="path-header" :style="{background: path.gradient}">
						<text class="path-icon">{{ path.icon }}</text>
						<text class="path-title">{{ path.title }}</text>
					</view>
					<view class="path-body">
						<text class="path-desc">{{ path.desc }}</text>
						<view class="path-progress">
							<view class="progress-bar">
								<view class="progress-fill" :style="{width: path.progress + '%', background: path.gradient}"></view>
							</view>
							<text class="progress-text">{{ path.progress }}%</text>
						</view>
						<view class="path-meta">
							<text class="meta-item">{{ path.cards }}张卡片</text>
							<text class="meta-item">{{ path.time }}预计</text>
						</view>
					</view>
					<view class="path-footer">
						<text class="continue-btn" v-if="path.progress > 0">继续学习</text>
						<text class="start-btn" v-else>开始学习</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pathList: [
				{
					icon: '️',
					title: '电商网站全栈选型',
					desc: '从前端到后端到数据库，完整的电商技术选型路径',
					gradient: 'linear-gradient(90deg, #a855f7, #ec4899)',
					progress: 65,
					cards: 12,
					time: '约2小时'
				},
				{
					icon: '🌐',
					title: '前端开发入门路径',
					desc: 'HTML/CSS/JavaScript基础到框架选型',
					gradient: 'linear-gradient(90deg, #6366f1, #3b82f6)',
					progress: 0,
					cards: 8,
					time: '约1.5小时'
				},
				{
					icon: '🤖',
					title: 'AI产品经理必修',
					desc: '从技术理解到AI指挥术的完整知识体系',
					gradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
					progress: 30,
					cards: 15,
					time: '约3小时'
				}
			]
		}
	},
	methods: {
		goToDetail(path) {
			uni.navigateTo({ url: '/pages/path-detail/path-detail' })
		}
	}
}
</script>

<style scoped>
.path-list-container {
	height: 100vh;
	background: #fafafa;
	display: flex;
	flex-direction: column;
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

.content-scroll {
	flex: 1;
}

.path-list {
	padding: 12px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.path-card {
	background: #ffffff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.path-header {
	padding: 16px;
	display: flex;
	align-items: center;
}

.path-icon {
	font-size: 24px;
	margin-right: 12px;
}

.path-title {
	font-size: 16px;
	font-weight: 600;
	color: #ffffff;
}

.path-body {
	padding: 16px;
}

.path-desc {
	font-size: 13px;
	color: #666666;
	display: block;
	margin-bottom: 12px;
}

.path-progress {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.progress-bar {
	flex: 1;
	height: 6px;
	background: #f5f5f5;
	border-radius: 3px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	border-radius: 3px;
}

.progress-text {
	font-size: 12px;
	color: #666666;
	margin-left: 8px;
}

.path-meta {
	display: flex;
	gap: 16px;
}

.meta-item {
	font-size: 12px;
	color: #999999;
}

.path-footer {
	padding: 0 16px 16px;
}

.continue-btn, .start-btn {
	display: block;
	text-align: center;
	padding: 10px;
	background: #6366f1;
	color: #ffffff;
	font-size: 14px;
	font-weight: 600;
	border-radius: 8px;
}
</style>
