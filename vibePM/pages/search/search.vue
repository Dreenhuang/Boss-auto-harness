<template>
	<view class="search-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input-wrapper">
				<text class="search-icon">🔍</text>
				<input class="search-input" v-model="searchText" placeholder="搜索技术概念、工具、场景..." @confirm="handleSearch" />
				<text class="clear-btn" v-if="searchText" @click="clearSearch">✕</text>
			</view>
			<text class="cancel-btn" @click="goBack">取消</text>
		</view>
		
		<!-- 有搜索结果时显示 -->
		<view class="result-section" v-if="searchText && searchResults.length > 0">
			<text class="section-title">搜索结果</text>
			<view class="result-list">
				<view class="result-item" v-for="(item, index) in searchResults" :key="index" @click="goToDetail">
					<text class="result-title">{{ item.title }}</text>
					<text class="result-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>
		
		<!-- 无搜索结果时显示 -->
		<view class="empty-section" v-if="searchText && searchResults.length === 0">
			<view class="empty-icon"></view>
			<text class="empty-title">未找到"{{ searchText }}"相关内容</text>
			<text class="empty-desc">试试其他关键词？</text>
			<view class="suggest-section">
				<text class="suggest-title">你可能想看</text>
				<view class="suggest-list">
					<view class="suggest-item" v-for="(item, index) in suggestions" :key="index">
						<text class="suggest-icon">{{ item.icon }}</text>
						<text class="suggest-text">{{ item.text }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 默认状态：热门标签+搜索历史 -->
		<view class="default-section" v-if="!searchText">
			<text class="section-title">热门搜索</text>
			<view class="hot-tags">
				<text class="hot-tag" v-for="(tag, index) in hotTags" :key="index" @click="searchTag(tag)">{{ tag }}</text>
			</view>
			
			<text class="section-title" style="margin-top: 24px;">搜索历史</text>
			<view class="history-list">
				<view class="history-item" v-for="(item, index) in searchHistory" :key="index" @click="searchTag(item)">
					<text class="history-icon">🕐</text>
					<text class="history-text">{{ item }}</text>
					<text class="history-arrow">›</text>
				</view>
			</view>
			<view class="clear-history" @click="clearHistory">
				<text class="clear-text">清空历史</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchText: '',
			searchResults: [],
			hotTags: ['React', 'AI编程', '电商', '低代码', '小程序', 'API', 'Vue对比', 'Python'],
			searchHistory: ['什么是微服务', '小程序开发方案', 'Python能做什么'],
			suggestions: [
				{ icon: '🌐', text: '技术地图' },
				{ icon: '🧠', text: 'AI指挥术' },
				{ icon: '️', text: '实战场景' }
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		clearSearch() {
			this.searchText = ''
			this.searchResults = []
		},
		handleSearch() {
			if (this.searchText) {
				// 模拟搜索结果
				this.searchResults = [
					{ title: 'API就像餐厅服务员', desc: '用生活化比喻解释API概念' },
					{ title: 'RESTful API 入门', desc: '最通用的API类型详解' }
				]
			}
		},
		searchTag(tag) {
			this.searchText = tag
			this.handleSearch()
		},
		goToDetail() {
			uni.navigateTo({ url: '/pages/card-detail/card-detail' })
		},
		clearHistory() {
			this.searchHistory = []
		}
	}
}
</script>

<style scoped>
.search-container {
	min-height: 100vh;
	background: #fafafa;
}

.search-bar {
	height: 44px;
	background: #ffffff;
	display: flex;
	align-items: center;
	padding: 0 12px;
	border-bottom: 1px solid #eeeeee;
}

.search-input-wrapper {
	flex: 1;
	height: 32px;
	background: #f5f5f5;
	border-radius: 16px;
	display: flex;
	align-items: center;
	padding: 0 12px;
}

.search-icon {
	font-size: 14px;
	margin-right: 8px;
}

.search-input {
	flex: 1;
	font-size: 14px;
	color: #333333;
}

.clear-btn {
	font-size: 16px;
	color: #999999;
	padding: 4px;
}

.cancel-btn {
	font-size: 14px;
	color: #6366f1;
	margin-left: 12px;
}

.section-title {
	font-size: 15px;
	font-weight: 600;
	color: #1a1a1a;
	padding: 16px 16px 12px;
	display: block;
}

.hot-tags {
	display: flex;
	flex-wrap: wrap;
	padding: 0 16px;
	gap: 8px;
}

.hot-tag {
	background: #f5f5f5;
	color: #333333;
	font-size: 13px;
	padding: 6px 14px;
	border-radius: 16px;
}

.history-list {
	background: #ffffff;
	margin: 0 16px;
	border-radius: 12px;
	overflow: hidden;
}

.history-item {
	display: flex;
	align-items: center;
	padding: 14px 16px;
	border-bottom: 1px solid #f5f5f5;
}

.history-item:last-child {
	border-bottom: none;
}

.history-icon {
	font-size: 16px;
	margin-right: 12px;
}

.history-text {
	flex: 1;
	font-size: 14px;
	color: #333333;
}

.history-arrow {
	font-size: 18px;
	color: #cccccc;
}

.clear-history {
	padding: 16px;
	text-align: center;
}

.clear-text {
	font-size: 14px;
	color: #999999;
}

.empty-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60px 32px;
}

.empty-icon {
	font-size: 64px;
	margin-bottom: 16px;
}

.empty-title {
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 8px;
}

.empty-desc {
	font-size: 14px;
	color: #999999;
	margin-bottom: 32px;
}

.suggest-section {
	width: 100%;
}

.suggest-title {
	font-size: 14px;
	color: #666666;
	margin-bottom: 12px;
	display: block;
}

.suggest-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.suggest-item {
	background: #ffffff;
	border-radius: 12px;
	padding: 14px 16px;
	display: flex;
	align-items: center;
}

.suggest-icon {
	font-size: 24px;
	margin-right: 12px;
}

.suggest-text {
	font-size: 14px;
	color: #333333;
}

.result-section {
	padding: 16px;
}

.result-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.result-item {
	background: #ffffff;
	border-radius: 12px;
	padding: 14px 16px;
}

.result-title {
	font-size: 15px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 6px;
}

.result-desc {
	font-size: 13px;
	color: #666666;
	display: block;
}
</style>
