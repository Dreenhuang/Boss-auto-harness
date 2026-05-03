<template>
	<view class="splash-container">
		<view class="logo-section">
			<view class="logo-icon">
				<text class="logo-text">小红书</text>
			</view>
			<text class="title">小白AI产品经理</text>
			<text class="subtitle">Vibe PM</text>
			<view class="divider"></view>
			<text class="version">V1.0 · 2026</text>
		</view>
		<view class="bottom-bar"></view>
	</view>
</template>

<script>
export default {
	onLoad() {
		setTimeout(() => {
			uni.switchTab({ url: '/pages/home/home' })
		}, 2000)
	}
}
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
	background: #ff2442;
	border-radius: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 24px;
}

.logo-text {
	color: #ffffff;
	font-size: 20px;
	font-weight: 700;
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
	height: 1px;
	background: #e0e0e0;
	margin-bottom: 8px;
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
	height: 20px;
	background: linear-gradient(90deg, #6366f1, #8b5cf6);
}
</style>
