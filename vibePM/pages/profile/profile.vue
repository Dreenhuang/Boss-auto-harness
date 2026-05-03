<template>
	<view class="profile-container">
		<!-- 用户信息卡片 -->
		<view class="user-card" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
			<view class="user-avatar">
				<text class="avatar-text">👤</text>
			</view>
			<view class="user-info">
				<text class="user-name">学习达人</text>
				<text class="user-level">Lv.8 学习专家</text>
			</view>
			<view class="settings-btn" @click="goToSettings">
				<text class="settings-icon">⚙️</text>
			</view>
		</view>
		
		<!-- 统计信息 -->
		<view class="stats-row">
			<view class="stat-item">
				<text class="stat-num">28</text>
				<text class="stat-label">收藏</text>
			</view>
			<view class="stat-item">
				<text class="stat-num">3</text>
				<text class="stat-label">路径</text>
			</view>
			<view class="stat-item">
				<text class="stat-num">156</text>
				<text class="stat-label">浏览</text>
			</view>
		</view>
		
		<!-- 菜单列表 -->
		<view class="menu-list">
			<view class="menu-item" @click="goToKnowledgeBase">
				<text class="menu-icon">📚</text>
				<text class="menu-text">我的知识库</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToFavorites">
				<text class="menu-icon">♡</text>
				<text class="menu-text">收藏夹</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToPathList">
				<text class="menu-icon">🗺️</text>
				<text class="menu-text">学习路径</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToTour">
				<text class="menu-icon">📤</text>
				<text class="menu-text">导出笔记</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>
		
		<!-- 设置菜单 -->
		<view class="menu-list" style="margin-top: 12px;">
			<view class="menu-item" @click="showGuide">
				<text class="menu-icon">💬</text>
				<text class="menu-text">新手引导</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="showLogin">
				<text class="menu-icon">🔑</text>
				<text class="menu-text">登录账号</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">📱</text>
				<text class="menu-text">版本信息</text>
				<text class="menu-version">V1.0</text>
			</view>
		</view>
		
		<!-- 新手引导弹窗 -->
		<view class="modal-overlay" v-if="showGuideModal" @click="closeGuide">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">新手引导</text>
					<text class="modal-close" @click="closeGuide">✕</text>
				</view>
				<view class="modal-body">
					<view class="wechat-section">
						<view class="wechat-icon">💬</view>
						<text class="wechat-title">添加微信客服</text>
						<text class="wechat-desc">获取一对一学习指导</text>
						<view class="wechat-code">
							<text class="code-text">微信号：aixuexi2026</text>
						</view>
						<view class="copy-btn" @click="copyWechat">
							<text class="copy-text">复制微信号</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 游客引导弹窗 -->
		<view class="modal-overlay" v-if="showLoginModal" @click="closeLogin">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">登录账号</text>
					<text class="modal-close" @click="closeLogin">✕</text>
				</view>
				<view class="modal-body">
					<view class="login-section">
						<view class="login-icon">🔑</view>
						<text class="login-title">登录解锁更多功能</text>
						<text class="login-desc">同步学习进度、收藏内容、学习路径</text>
						<view class="login-btn" @click="handleLogin">
							<text class="login-btn-text">立即登录</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showGuideModal: false,
			showLoginModal: false
		}
	},
	methods: {
		goToSettings() {
			uni.showToast({ title: '设置页面', icon: 'none' })
		},
		goToKnowledgeBase() {
			uni.navigateTo({ url: '/pages/knowledge-base/knowledge-base' })
		},
		goToFavorites() {
			uni.navigateTo({ url: '/pages/favorites/favorites' })
		},
		goToPathList() {
			uni.navigateTo({ url: '/pages/path-list/path-list' })
		},
		goToTour() {
			uni.navigateTo({ url: '/pages/tour/tour' })
		},
		showGuide() {
			this.showGuideModal = true
		},
		closeGuide() {
			this.showGuideModal = false
		},
		copyWechat() {
			uni.setClipboardData({
				data: 'aixuexi2026',
				success: () => {
					uni.showToast({ title: '已复制', icon: 'success' })
				}
			})
		},
		showLogin() {
			this.showLoginModal = true
		},
		closeLogin() {
			this.showLoginModal = false
		},
		handleLogin() {
			uni.showToast({ title: '登录功能开发中', icon: 'none' })
		}
	}
}
</script>

<style scoped>
.profile-container {
	min-height: 100vh;
	background: #fafafa;
}

.user-card {
	padding: 24px 16px;
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: rgba(255,255,255,0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16px;
}

.avatar-text {
	font-size: 32px;
}

.user-info {
	flex: 1;
}

.user-name {
	font-size: 18px;
	font-weight: 700;
	color: #ffffff;
	display: block;
	margin-bottom: 4px;
}

.user-level {
	font-size: 13px;
	color: rgba(255,255,255,0.8);
}

.settings-btn {
	padding: 8px;
}

.settings-icon {
	font-size: 20px;
}

.stats-row {
	display: flex;
	background: #ffffff;
	margin: -20px 16px 0;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.stat-item {
	flex: 1;
	text-align: center;
}

.stat-num {
	font-size: 20px;
	font-weight: 700;
	color: #6366f1;
	display: block;
	margin-bottom: 4px;
}

.stat-label {
	font-size: 12px;
	color: #999999;
}

.menu-list {
	background: #ffffff;
	margin: 12px 16px 0;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 14px 16px;
	border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	font-size: 20px;
	margin-right: 12px;
}

.menu-text {
	flex: 1;
	font-size: 14px;
	color: #333333;
}

.menu-arrow {
	font-size: 18px;
	color: #cccccc;
}

.menu-version {
	font-size: 12px;
	color: #999999;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal-content {
	width: 80%;
	background: #ffffff;
	border-radius: 16px;
	overflow: hidden;
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px;
	border-bottom: 1px solid #eeeeee;
}

.modal-title {
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
}

.modal-close {
	font-size: 18px;
	color: #999999;
	padding: 4px;
}

.modal-body {
	padding: 16px;
}

.wechat-section {
	text-align: center;
}

.wechat-icon {
	font-size: 48px;
	margin-bottom: 12px;
}

.wechat-title {
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 8px;
}

.wechat-desc {
	font-size: 13px;
	color: #666666;
	display: block;
	margin-bottom: 16px;
}

.wechat-code {
	background: #f5f5f5;
	border-radius: 8px;
	padding: 12px;
	margin-bottom: 16px;
}

.code-text {
	font-size: 14px;
	color: #333333;
	font-weight: 600;
}

.copy-btn {
	background: #6366f1;
	border-radius: 8px;
	padding: 12px;
}

.copy-text {
	color: #ffffff;
	font-size: 14px;
	font-weight: 600;
	text-align: center;
	display: block;
}

.login-section {
	text-align: center;
}

.login-icon {
	font-size: 48px;
	margin-bottom: 12px;
}

.login-title {
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	display: block;
	margin-bottom: 8px;
}

.login-desc {
	font-size: 13px;
	color: #666666;
	display: block;
	margin-bottom: 24px;
}

.login-btn {
	background: #6366f1;
	border-radius: 8px;
	padding: 12px;
}

.login-btn-text {
	color: #ffffff;
	font-size: 14px;
	font-weight: 600;
	text-align: center;
	display: block;
}
</style>
