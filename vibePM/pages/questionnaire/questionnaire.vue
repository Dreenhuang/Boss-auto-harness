<template>
	<view class="questionnaire-container">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
				<text class="back-text">上一步</text>
			</view>
			<view class="skip-btn" @click="skipQuestionnaire">跳过</view>
		</view>
		
		<view class="content">
			<text class="step-title">你了解哪个方向？</text>
			<text class="step-desc">可多选，最多3个</text>
			
			<view class="options-grid">
				<view class="option-card" :class="{selected: selectedOptions.includes('tech')}" @click="toggleOption('tech')">
					<text class="option-icon">🌐</text>
					<text class="option-text">技术地图</text>
				</view>
				<view class="option-card" :class="{selected: selectedOptions.includes('thinking')}" @click="toggleOption('thinking')">
					<text class="option-icon">🧠</text>
					<text class="option-text">思维模型</text>
				</view>
				<view class="option-card" :class="{selected: selectedOptions.includes('practice')}" @click="toggleOption('practice')">
					<text class="option-icon">🛠️</text>
					<text class="option-text">实战场景</text>
				</view>
				<view class="option-card" :class="{selected: selectedOptions.includes('avoid')}" @click="toggleOption('avoid')">
					<text class="option-icon">⚠️</text>
					<text class="option-text">避坑指南</text>
				</view>
				<view class="option-card" :class="{selected: selectedOptions.includes('ai')}" @click="toggleOption('ai')">
					<text class="option-icon">🤖</text>
					<text class="option-text">AI指挥术</text>
				</view>
				<view class="option-card" :class="{selected: selectedOptions.includes('resource')}" @click="toggleOption('resource')">
					<text class="option-icon"></text>
					<text class="option-text">资源推荐</text>
				</view>
			</view>
			
			<view class="level-section">
				<text class="level-title">你的技术水平？</text>
				<view class="level-options">
					<view class="level-option" :class="{selected: selectedLevel === 'beginner'}" @click="selectLevel('beginner')">
						<view class="radio" :class="{checked: selectedLevel === 'beginner'}"></view>
						<text class="level-text">完全小白</text>
					</view>
					<view class="level-option" :class="{selected: selectedLevel === 'some'}" @click="selectLevel('some')">
						<view class="radio" :class="{checked: selectedLevel === 'some'}"></view>
						<text class="level-text">略有了解</text>
					</view>
					<view class="level-option" :class="{selected: selectedLevel === 'basic'}" @click="selectLevel('basic')">
						<view class="radio" :class="{checked: selectedLevel === 'basic'}"></view>
						<text class="level-text">有基础</text>
					</view>
				</view>
			</view>
			
			<view class="want-section">
				<text class="want-title">最想学什么？</text>
				<view class="want-select">
					<text class="select-text">请选择一个场景</text>
					<text class="select-arrow">›</text>
				</view>
			</view>
		</view>
		
		<view class="bottom-btn" @click="startLearning">
			<text class="btn-text">根据我的选择开始学习</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedOptions: [],
			selectedLevel: ''
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		skipQuestionnaire() {
			uni.switchTab({ url: '/pages/home/home' })
		},
		toggleOption(option) {
			const index = this.selectedOptions.indexOf(option)
			if (index > -1) {
				this.selectedOptions.splice(index, 1)
			} else if (this.selectedOptions.length < 3) {
				this.selectedOptions.push(option)
			}
		},
		selectLevel(level) {
			this.selectedLevel = level
		},
		startLearning() {
			uni.switchTab({ url: '/pages/home/home' })
		}
	}
}
</script>

<style scoped>
.questionnaire-container {
	min-height: 100vh;
	background: #fafafa;
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

.skip-btn {
	font-size: 14px;
	color: #666666;
}

.content {
	padding: 24px 16px;
}

.step-title {
	font-size: 20px;
	font-weight: 600;
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
}

.option-card.selected {
	border-color: #6366f1;
	background: #6366f1/10;
}

.option-icon {
	font-size: 28px;
	margin-bottom: 8px;
}

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
}

.radio {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: 2px solid #cccccc;
	margin-right: 8px;
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
	background: #ffffff;
	border-radius: 8px;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.select-text {
	font-size: 14px;
	color: #999999;
}

.select-arrow {
	font-size: 20px;
	color: #cccccc;
}

.bottom-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
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
