<template>
	<view class="favorites-container">
		<view class="header">
			<text class="header-title">收藏夹</text>
		</view>
		
		<!-- 分类筛选 -->
		<scroll-view class="filter-scroll" scroll-x>
			<view class="filter-tabs">
				<view class="filter-tab" :class="{active: activeFilter === 'all'}" @click="setFilter('all')">全部</view>
				<view class="filter-tab" :class="{active: activeFilter === 'concept'}" @click="setFilter('concept')">概念卡</view>
				<view class="filter-tab" :class="{active: activeFilter === 'compare'}" @click="setFilter('compare')">对比卡</view>
				<view class="filter-tab" :class="{active: activeFilter === 'tool'}" @click="setFilter('tool')">工具卡</view>
				<view class="filter-tab" :class="{active: activeFilter === 'avoid'}" @click="setFilter('avoid')">避坑卡</view>
				<view class="filter-tab" :class="{active: activeFilter === 'path'}" @click="setFilter('path')">路径卡</view>
			</view>
		</scroll-view>
		
		<!-- 卡片列表 -->
		<scroll-view class="card-scroll" scroll-y>
			<view class="card-list">
				<view class="fav-card" v-for="(card, index) in filteredCards" :key="index" @click="goToDetail">
					<view class="card-top-bar" :style="{background: card.gradient}"></view>
					<view class="card-content">
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
							<text class="card-fav-active">♥</text>
						</view>
					</view>
				</view>
			</view>
			<view class="empty-tip" v-if="filteredCards.length === 0">
				<text class="empty-text">没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activeFilter: 'all',
			cards: [
				{
					type: '概念卡',
					icon: '💡',
					iconBg: '#06b6d4/10',
					tagBg: '#06b6d4/10',
					tagColor: '#06b6d4',
					gradient: 'linear-gradient(90deg, #06b6d4, #10b981)',
					title: 'API就像餐厅服务员',
					desc: '用生活化比喻，解释API是什么、怎么工作',
					tags: ['技术地图', 'API'],
					category: 'concept'
				},
				{
					type: '对比卡',
					icon: '⚔️',
					iconBg: '#f97316/10',
					tagBg: '#f97316/10',
					tagColor: '#f97316',
					gradient: 'linear-gradient(90deg, #f97316, #ef4444)',
					title: 'React vs Vue 全面对比',
					desc: '从学习成本、生态、性能等维度对比',
					tags: ['技术地图', '前端'],
					category: 'compare'
				},
				{
					type: '避坑卡',
					icon: '⚠️',
					iconBg: '#f59e0b/10',
					tagBg: '#f59e0b/10',
					tagColor: '#f59e0b',
					gradient: 'linear-gradient(90deg, #f59e0b, #d97706)',
					title: '别用WordPress做电商网站',
					desc: '为什么WordPress不适合做大型电商网站',
					tags: ['避坑指南', '电商'],
					category: 'avoid'
				},
				{
					type: '工具卡',
					icon: '️',
					iconBg: '#6366f1/10',
					tagBg: '#6366f1/10',
					tagColor: '#6366f1',
					gradient: 'linear-gradient(90deg, #6366f1, #3b82f6)',
					title: 'AI工具入门指南',
					desc: 'ChatGPT、Claude、文心一言对比',
					tags: ['AI指挥术', '工具'],
					category: 'tool'
				},
				{
					type: '路径卡',
					icon: '🗺️',
					iconBg: '#a855f7/10',
					tagBg: '#a855f7/10',
					tagColor: '#a855f7',
					gradient: 'linear-gradient(90deg, #a855f7, #ec4899)',
					title: '电商网站全栈选型',
					desc: '从前端到后端到数据库的完整路径',
					tags: ['学习路径', '电商'],
					category: 'path'
				}
			]
		}
	},
	computed: {
		filteredCards() {
			if (this.activeFilter === 'all') return this.cards
			return this.cards.filter(c => c.category === this.activeFilter)
		}
	},
	methods: {
		setFilter(filter) {
			this.activeFilter = filter
		},
		goToDetail() {
			uni.navigateTo({ url: '/pages/card-detail/card-detail' })
		}
	}
}
</script>

<style scoped>
.favorites-container {
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

.filter-scroll {
	height: 40px;
	background: #ffffff;
	white-space: nowrap;
	border-bottom: 1px solid #eeeeee;
}

.filter-tabs {
	display: inline-flex;
	padding: 0 12px;
}

.filter-tab {
	padding: 0 14px;
	height: 40px;
	line-height: 40px;
	font-size: 13px;
	color: #666666;
}

.filter-tab.active {
	color: #6366f1;
	font-weight: 600;
}

.card-scroll {
	flex: 1;
}

.card-list {
	padding: 8px 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.fav-card {
	background: #ffffff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.card-top-bar {
	height: 4px;
}

.card-content {
	padding: 12px;
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
	display: block;
	margin-bottom: 6px;
}

.card-desc {
	font-size: 12px;
	color: #666666;
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

.card-fav-active {
	font-size: 18px;
	color: #ff2442;
}

.empty-tip {
	padding: 40px;
	text-align: center;
}

.empty-text {
	font-size: 14px;
	color: #999999;
}
</style>
