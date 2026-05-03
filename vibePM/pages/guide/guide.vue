<template>
	<view class="guide-container">
		<view class="skip-btn" @click="skipGuide">跳过</view>
		
		<swiper class="swiper" :current="currentPage" @change="onSwiperChange" :indicator-dots="false">
			<swiper-item>
				<view class="page">
					<view class="illustration">
						<view class="illust-icon">📱</view>
						<view class="hearts">
							<text class="heart">💕</text>
							<text class="heart heart2">💕</text>
						</view>
					</view>
					<text class="page-title">像刷小红书一样学技术</text>
					<text class="page-desc">不需要懂代码，用自然语言就能理解复杂技术概念</text>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="page">
					<view class="illustration">
						<view class="target-icon">🎯</view>
					</view>
					<text class="page-title">从目标出发，不再迷路</text>
					<text class="page-desc">不管你想做什么，都能找到对应的技术路径</text>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="page">
					<view class="illustration">
						<view class="ai-icon"></view>
					</view>
					<text class="page-title">AI帮你整理知识体系</text>
					<text class="page-desc">收藏的内容自动归类，还能导出成文档</text>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="dots">
			<view class="dot" :class="{active: currentPage === 0}"></view>
			<view class="dot" :class="{active: currentPage === 1}"></view>
			<view class="dot" :class="{active: currentPage === 2}"></view>
		</view>
		
		<view class="btn-wrapper">
			<view class="next-btn" @click="nextPage" v-if="currentPage < 2">下一步</view>
			<view class="start-btn" @click="startLearning" v-else>开始学习</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentPage: 0
		}
	},
	methods: {
		onSwiperChange(e) {
			this.currentPage = e.detail.current
		},
		nextPage() {
			this.currentPage++
		},
		skipGuide() {
			uni.switchTab({ url: '/pages/home/home' })
		},
		startLearning() {
			uni.navigateTo({ url: '/pages/questionnaire/questionnaire' })
		}
	}
}
</script>

<style scoped>
.guide-container {
	width: 100%;
	height: 100vh;
	background: #ffffff;
	position: relative;
}

.skip-btn {
	position: absolute;
	top: 44px;
	right: 16px;
	font-size: 14px;
	color: #666666;
	padding: 8px 16px;
	z-index: 10;
}

.swiper {
	width: 100%;
	height: calc(100vh - 120px);
}

.page {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 32px;
}

.illustration {
	width: 200px;
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 80px;
	position: relative;
}

.illust-icon {
	font-size: 120px;
}

.hearts {
	position: absolute;
	top: 0;
	right: 0;
}

.heart {
	font-size: 24px;
	position: absolute;
}

.heart2 {
	top: -20px;
	right: -20px;
}

.target-icon, .ai-icon {
	font-size: 120px;
}

.page-title {
	font-size: 20px;
	font-weight: 600;
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
}

.dot.active {
	background: #6366f1;
	width: 20px;
	border-radius: 4px;
}

.btn-wrapper {
	position: absolute;
	bottom: 48px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
}

.next-btn, .start-btn {
	width: 80%;
	height: 48px;
	background: #ff2442;
	color: #ffffff;
	font-size: 16px;
	font-weight: 600;
	border-radius: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
