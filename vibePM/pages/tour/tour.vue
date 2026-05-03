<template>
	<view class="tour-container">
		<view class="header">
			<text class="header-title">导出笔记</text>
		</view>
		
		<scroll-view class="content-scroll" scroll-y>
			<view class="intro-section">
				<view class="intro-icon">📤</view>
				<text class="intro-title">将你的学习成果导出为文档</text>
				<text class="intro-desc">支持多种格式，方便分享和存档</text>
			</view>
			
			<view class="format-section">
				<text class="section-title">选择导出格式</text>
				<view class="format-list">
					<view class="format-item" :class="{selected: selectedFormat === 'pdf'}" @click="selectFormat('pdf')">
						<view class="format-icon" style="background: #ef4444/10;">📄</view>
						<view class="format-info">
							<text class="format-name">PDF文档</text>
							<text class="format-desc">适合打印和分享，保持排版</text>
						</view>
						<view class="format-radio" :class="{checked: selectedFormat === 'pdf'}"></view>
					</view>
					<view class="format-item" :class="{selected: selectedFormat === 'docx'}" @click="selectFormat('docx')">
						<view class="format-icon" style="background: #3b82f6/10;">📝</view>
						<view class="format-info">
							<text class="format-name">Word文档</text>
							<text class="format-desc">可编辑，适合二次修改</text>
						</view>
						<view class="format-radio" :class="{checked: selectedFormat === 'docx'}"></view>
					</view>
					<view class="format-item" :class="{selected: selectedFormat === 'md'}" @click="selectFormat('md')">
						<view class="format-icon" style="background: #10b981/10;">📋</view>
						<view class="format-info">
							<text class="format-name">Markdown</text>
							<text class="format-desc">适合技术文档和代码块</text>
						</view>
						<view class="format-radio" :class="{checked: selectedFormat === 'md'}"></view>
					</view>
					<view class="format-item" :class="{selected: selectedFormat === 'html'}" @click="selectFormat('html')">
						<view class="format-icon" style="background: #f59e0b/10;">🌐</view>
						<view class="format-info">
							<text class="format-name">HTML网页</text>
							<text class="format-desc">适合在线预览和嵌入</text>
						</view>
						<view class="format-radio" :class="{checked: selectedFormat === 'html'}"></view>
					</view>
				</view>
			</view>
			
			<view class="content-section">
				<text class="section-title">选择导出内容</text>
				<view class="content-options">
					<view class="content-option" @click="toggleContent('favorites')">
						<view class="checkbox" :class="{checked: selectedContents.includes('favorites')}"></view>
						<text class="content-text">收藏夹内容</text>
					</view>
					<view class="content-option" @click="toggleContent('paths')">
						<view class="checkbox" :class="{checked: selectedContents.includes('paths')}"></view>
						<text class="content-text">学习路径</text>
					</view>
					<view class="content-option" @click="toggleContent('notes')">
						<view class="checkbox" :class="{checked: selectedContents.includes('notes')}"></view>
						<text class="content-text">个人笔记</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="bottom-btn" @click="handleExport">
			<text class="btn-text">导出文档</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedFormat: 'pdf',
			selectedContents: ['favorites']
		}
	},
	methods: {
		selectFormat(format) {
			this.selectedFormat = format
		},
		toggleContent(content) {
			const index = this.selectedContents.indexOf(content)
			if (index > -1) {
				this.selectedContents.splice(index, 1)
			} else {
				this.selectedContents.push(content)
			}
		},
		handleExport() {
			uni.showToast({ title: '导出成功', icon: 'success' })
		}
	}
}
</script>

<style scoped>
.tour-container {
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

.intro-section {
	background: #ffffff;
	padding: 24px 16px;
	text-align: center;
}

.intro-icon {
	font-size: 48px;
	margin-bottom: 12px;
}

.intro-title {
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 8px;
}

.intro-desc {
	font-size: 14px;
	color: #666666;
	display: block;
}

.format-section {
	padding: 16px;
}

.section-title {
	font-size: 15px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 12px;
}

.format-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.format-item {
	background: #ffffff;
	border-radius: 12px;
	padding: 14px 16px;
	display: flex;
	align-items: center;
	border: 2px solid transparent;
}

.format-item.selected {
	border-color: #6366f1;
}

.format-icon {
	width: 40px;
	height: 40px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	margin-right: 12px;
}

.format-info {
	flex: 1;
}

.format-name {
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 4px;
}

.format-desc {
	font-size: 12px;
	color: #999999;
	display: block;
}

.format-radio {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: 2px solid #cccccc;
}

.format-radio.checked {
	border-color: #6366f1;
	background: #6366f1;
}

.content-section {
	padding: 0 16px 16px;
}

.content-options {
	background: #ffffff;
	border-radius: 12px;
	padding: 12px 16px;
}

.content-option {
	display: flex;
	align-items: center;
	padding: 12px 0;
	border-bottom: 1px solid #f5f5f5;
}

.content-option:last-child {
	border-bottom: none;
}

.checkbox {
	width: 20px;
	height: 20px;
	border-radius: 4px;
	border: 2px solid #cccccc;
	margin-right: 12px;
}

.checkbox.checked {
	border-color: #6366f1;
	background: #6366f1;
}

.content-text {
	font-size: 14px;
	color: #333333;
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
