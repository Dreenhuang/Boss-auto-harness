<template>
	<view class="home-container">
		<!-- 顶部搜索栏 -->
		<view class="search-bar">
			<view class="search-input" @click="goToSearch">
				<text class="search-icon">🔍</text>
				<text class="search-placeholder">搜索技术概念、工具、场景...</text>
			</view>
			<view class="scan-icon">📷</view>
		</view>
		
		<!-- 分类标签 -->
		<scroll-view class="category-scroll" scroll-x>
			<view class="category-tabs">
				<view class="tab-item" :class="{active: activeTab === 'recommend'}" @click="switchTab('recommend')">推荐</view>
				<view class="tab-item" :class="{active: activeTab === 'tech'}" @click="switchTab('tech')">技术</view>
				<view class="tab-item" :class="{active: activeTab === 'thinking'}" @click="switchTab('thinking')">思维</view>
				<view class="tab-item" :class="{active: activeTab === 'practice'}" @click="switchTab('practice')">实战</view>
				<view class="tab-item" :class="{active: activeTab === 'ai'}" @click="switchTab('ai')">AI</view>
				<view class="tab-item" :class="{active: activeTab === 'resource'}" @click="switchTab('resource')">资源</view>
				<view class="tab-item" :class="{active: activeTab === 'avoid'}" @click="switchTab('avoid')">避坑</view>
				<view class="tab-item" :class="{active: activeTab === 'path'}" @click="switchTab('path')">路径</view>
			</view>
		</scroll-view>
		
		<!-- 瀑布流卡片 -->
		<scroll-view class="waterfall-scroll" scroll-y @scrolltolower="loadMore">
			<view class="waterfall">
				<view class="waterfall-col">
					<!-- 左列卡片 -->
					<view class="card" :style="{borderTop: `4px solid ${card.gradient}`}" v-for="(card, index) in leftCards" :key="'left-'+index" @click="goToDetail(card)">
						<view class="card-header">
							<view class="card-type-icon" :style="{background: card.iconBg}">{{ card.icon }}</view>
							<view class="card-type-tag" :style="{background: card.tagBg, color: card.tagColor}">{{ card.type }}</view>
						</view>
						<text class="card-title">{{ card.title }}</text>
						<text class="card-desc">{{ card.desc }}</text>
						<view class="card-footer">
							<view class="card-tags">
								<text class="card-tag" v-for="tag in card.tags" :key="tag">{{ tag }}</text>
							</view>
							<text class="card-fav">♡</text>
						</view>
					</view>
				</view>
				<view class="waterfall-col">
					<!-- 右列卡片 -->
					<view class="card" :style="{borderTop: `4px solid ${card.gradient}`}" v-for="(card, index) in rightCards" :key="'right-'+index" @click="goToDetail(card)">
						<view class="card-header">
							<view class="card-type-icon" :style="{background: card.iconBg}">{{ card.icon }}</view>
							<view class="card-type-tag" :style="{background: card.tagBg, color: card.tagColor}">{{ card.type }}</view>
						</view>
						<text class="card-title">{{ card.title }}</text>
						<text class="card-desc">{{ card.desc }}</text>
						<view class="card-footer">
							<view class="card-tags">
								<text class="card-tag" v-for="tag in card.tags" :key="tag">{{ tag }}</text>
							</view>
							<text class="card-fav">♡</text>
						</view>
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
			activeTab: 'recommend',
			cards: [
				{
					type: '场景卡',
					icon: '🎯',
					iconBg: '#6366f1/10',
					tagBg: '#6366f1/10',
					tagColor: '#6366f1',
					gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
					title: '电商网站选型指南',
					desc: '从零开始做一个电商网站/小程序，应该选什么技术栈？',
					tags: ['实战场景', '电商']
				},
				{
					type: '概念卡',
					icon: '💡',
					iconBg: '#06b6d4/10',
					tagBg: '#06b6d4/10',
					tagColor: '#06b6d4',
					gradient: 'linear-gradient(90deg, #06b6d4, #10b981)',
					title: 'API就像餐厅服务员',
					desc: '用生活化比喻，解释API是什么、怎么工作、为什么需要它',
					tags: ['技术地图', 'API']
				},
				{
					type: '对比卡',
					icon: '⚔️',
					iconBg: '#f97316/10',
					tagBg: '#f97316/10',
					tagColor: '#f97316',
					gradient: 'linear-gradient(90deg, #f97316, #ef4444)',
					title: 'React vs Vue 全面对比',
					desc: '从学习成本、生态、性能等维度全面对比两大前端框架',
					tags: ['技术地图', '前端']
				},
				{
					type: '避坑卡',
					icon: '⚠️',
					iconBg: '#f59e0b/10',
					tagBg: '#f59e0b/10',
					tagColor: '#f59e0b',
					gradient: 'linear-gradient(90deg, #f59e0b, #d97706)',
					title: '别用WordPress做电商网站',
					desc: '为什么WordPress不适合做大型电商网站，替代方案是什么',
					tags: ['避坑指南', '电商']
				},
				{
					type: '工具卡',
					icon: '🛠️',
					iconBg: '#6366f1/10',
					tagBg: '#6366f1/10',
					tagColor: '#6366f1',
					gradient: 'linear-gradient(90deg, #6366f1, #3b82f6)',
					title: 'AI工具入门',
					desc: 'ChatGPT、Claude、文心一言，哪个最适合你的工作场景？',
					tags: ['AI指挥术', '工具']
				},
				{
					type: '路径卡',
					icon: '️',
					iconBg: '#a855f7/10',
					tagBg: '#a855f7/10',
					tagColor: '#a855f7',
					gradient: 'linear-gradient(90deg, #a855f7, #ec4899)',
					title: '电商网站全栈选型',
					desc: '从前端到后端到数据库，完整的电商技术选型路径',
					tags: ['学习路径', '电商']
				}
			]
		}
	},
	computed: {
		leftCards() {
			return this.cards.filter((_, i) => i % 2 === 0)
		},
		rightCards() {
			return this.cards.filter((_, i) => i % 2 === 1)
		}
	},
	methods: {
		switchTab(tab) {
			this.activeTab = tab
		},
		goToSearch() {
			uni.navigateTo({ url: '/pages/search/search' })
		},
		goToDetail(card) {
			uni.navigateTo({ url: '/pages/card-detail/card-detail' })
		},
		loadMore() {
			// 加载更多卡片
		}
	}
}
</script>

<style scoped>
.home-container {
	height: 100vh;
	background: #fafafa;
	display: flex;
	flex-direction: column;
}

.search-bar {
	height: 44px;
	background: #ffffff;
	display: flex;
	align-items: center;
	padding: 0 12px;
	border-bottom: 1px solid #eeeeee;
}

.search-input {
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

.search-placeholder {
	font-size: 13px;
	color: #999999;
}

.scan-icon {
	font-size: 20px;
	margin-left: 12px;
}

.category-scroll {
	height: 40px;
	background: #ffffff;
	white-space: nowrap;
	border-bottom: 1px solid #eeeeee;
}

.category-tabs {
	display: inline-flex;
	padding: 0 12px;
}

.tab-item {
	padding: 0 16px;
	height: 40px;
	line-height: 40px;
	font-size: 14px;
	color: #666666;
	position: relative;
}

.tab-item.active {
	color: #6366f1;
	font-weight: 600;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 24px;
	height: 3px;
	background: #6366f1;
	border-radius: 2px;
}

.waterfall-scroll {
	flex: 1;
}

.waterfall {
	display: flex;
	padding: 8px;
	gap: 8px;
}

.waterfall-col {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.card {
	background: #ffffff;
	border-radius: 12px;
	padding: 12px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.card-header {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.card-type-icon {
	width: 24px;
	height: 24px;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	margin-right: 8px;
}

.card-type-tag {
	font-size: 11px;
	padding: 2px 8px;
	border-radius: 10px;
}

.card-title {
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
	line-height: 1.4;
	display: block;
	margin-bottom: 6px;
}

.card-desc {
	font-size: 12px;
	color: #666666;
	line-height: 1.5;
	display: block;
	margin-bottom: 12px;
}

.card-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.card-tags {
	display: flex;
	gap: 6px;
}

.card-tag {
	font-size: 11px;
	color: #999999;
	background: #f5f5f5;
	padding: 2px 8px;
	border-radius: 10px;
}

.card-fav {
	font-size: 18px;
	color: #cccccc;
}
</style>
