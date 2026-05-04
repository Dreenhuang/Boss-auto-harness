<template>
  <div class="settings-container">
    <!-- 头部 -->
    <div class="settings-header">
      <ChevronLeft class="back-btn" @click="goBack" />
      <div class="header-title">设置</div>
      <div class="header-placeholder"></div>
    </div>

    <!-- 内容区域 -->
    <div class="settings-content">
      <!-- 个人信息设置 -->
      <div class="settings-section">
        <h3 class="section-title">个人信息</h3>
        <div class="settings-card">
          <div class="avatar-setting" @click="showAvatarPicker = true">
            <span class="setting-label">头像</span>
            <div class="avatar-preview">
              <img v-if="form.avatar" :src="form.avatar" alt="avatar" class="avatar-img" />
              <User v-else class="avatar-default" />
              <ChevronRight class="arrow-icon" />
            </div>
          </div>
          <div class="setting-item" @click="editField('nickname')">
            <span class="setting-label">昵称</span>
            <div class="setting-value">
              <span>{{ form.nickname || '未设置' }}</span>
              <ChevronRight class="arrow-icon" />
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">手机号</span>
            <div class="setting-value">
              <span class="phone-mask">{{ maskPhone(form.phone) }}</span>
            </div>
          </div>
          <div class="setting-item" @click="editField('bio')">
            <span class="setting-label">个人简介</span>
            <div class="setting-value">
              <span class="bio-text">{{ form.bio || '介绍一下自己吧' }}</span>
              <ChevronRight class="arrow-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- 账号安全 -->
      <div class="settings-section">
        <h3 class="section-title">账号安全</h3>
        <div class="settings-card">
          <div class="setting-item" @click="showPasswordModal = true">
            <span class="setting-label">修改密码</span>
            <div class="setting-value">
              <ChevronRight class="arrow-icon" />
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">账号绑定</span>
            <div class="setting-value">
              <span class="bind-status">已绑定手机</span>
              <ChevronRight class="arrow-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="settings-section">
        <h3 class="section-title">隐私设置</h3>
        <div class="settings-card">
          <div class="setting-item toggle-item">
            <span class="setting-label">公开学习进度</span>
            <div class="toggle-switch" :class="{ active: form.privacy.showProgress }" @click="togglePrivacy('showProgress')">
              <div class="toggle-dot"></div>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <span class="setting-label">公开收藏列表</span>
            <div class="toggle-switch" :class="{ active: form.privacy.showFavorites }" @click="togglePrivacy('showFavorites')">
              <div class="toggle-dot"></div>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <span class="setting-label">允许被搜索到</span>
            <div class="toggle-switch" :class="{ active: form.privacy.allowSearch }" @click="togglePrivacy('allowSearch')">
              <div class="toggle-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知偏好 -->
      <div class="settings-section">
        <h3 class="section-title">通知偏好</h3>
        <div class="settings-card">
          <div class="setting-item toggle-item">
            <span class="setting-label">学习提醒</span>
            <div class="toggle-switch" :class="{ active: form.notifications.studyReminder }" @click="toggleNotification('studyReminder')">
              <div class="toggle-dot"></div>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <span class="setting-label">新消息通知</span>
            <div class="toggle-switch" :class="{ active: form.notifications.newMessage }" @click="toggleNotification('newMessage')">
              <div class="toggle-dot"></div>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <span class="setting-label">系统公告</span>
            <div class="toggle-switch" :class="{ active: form.notifications.systemNotice }" @click="toggleNotification('systemNotice')">
              <div class="toggle-dot"></div>
            </div>
          </div>
          <div class="setting-item toggle-item">
            <span class="setting-label">点赞和评论</span>
            <div class="toggle-switch" :class="{ active: form.notifications.interaction }" @click="toggleNotification('interaction')">
              <div class="toggle-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div class="settings-section">
        <h3 class="section-title">关于</h3>
        <div class="settings-card">
          <div class="setting-item">
            <span class="setting-label">版本号</span>
            <div class="setting-value">
              <span class="version-text">v2.2.0</span>
            </div>
          </div>
          <div class="setting-item" @click="showAgreement = true">
            <span class="setting-label">用户协议</span>
            <div class="setting-value">
              <ChevronRight class="arrow-icon" />
            </div>
          </div>
          <div class="setting-item" @click="showPrivacy = true">
            <span class="setting-label">隐私政策</span>
            <div class="setting-value">
              <ChevronRight class="arrow-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="save-section">
        <button class="save-btn" :disabled="!hasChanges || saving" @click="saveSettings">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>

    <!-- 头像选择弹窗 -->
    <div v-if="showAvatarPicker" class="modal-overlay" @click="showAvatarPicker = false">
      <div class="modal-content avatar-modal" @click.stop>
        <h3 class="modal-title">选择头像</h3>
        <div class="avatar-grid">
          <div
            v-for="(avatar, index) in avatarOptions"
            :key="index"
            class="avatar-option"
            :class="{ selected: form.avatar === avatar }"
            @click="selectAvatar(avatar)"
          >
            <img :src="avatar" alt="avatar" class="avatar-option-img" />
          </div>
        </div>
        <button class="modal-close-btn" @click="showAvatarPicker = false">关闭</button>
      </div>
    </div>

    <!-- 编辑昵称弹窗 -->
    <div v-if="editingField === 'nickname'" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">修改昵称</h3>
        <input
          v-model="editValue"
          type="text"
          placeholder="请输入昵称"
          maxlength="20"
          class="edit-input"
        />
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="cancelEdit">取消</button>
          <button class="modal-btn confirm" @click="confirmEdit">确定</button>
        </div>
      </div>
    </div>

    <!-- 编辑简介弹窗 -->
    <div v-if="editingField === 'bio'" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">修改个人简介</h3>
        <textarea
          v-model="editValue"
          placeholder="介绍一下自己吧"
          maxlength="100"
          class="edit-textarea"
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="cancelEdit">取消</button>
          <button class="modal-btn confirm" @click="confirmEdit">确定</button>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">修改密码</h3>
        <div class="password-form">
          <input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="当前密码"
            class="edit-input"
          />
          <input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="新密码（至少8位，包含字母和数字）"
            class="edit-input"
          />
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="确认新密码"
            class="edit-input"
          />
          <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
        </div>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showPasswordModal = false">取消</button>
          <button class="modal-btn confirm" :disabled="!canChangePassword" @click="changePassword">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, User } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const form = ref({
  nickname: '',
  phone: '',
  avatar: '',
  bio: '',
  privacy: {
    showProgress: true,
    showFavorites: true,
    allowSearch: true
  },
  notifications: {
    studyReminder: true,
    newMessage: true,
    systemNotice: true,
    interaction: true
  }
})

const originalForm = ref(null)
const saving = ref(false)
const showAvatarPicker = ref(false)
const editingField = ref(null)
const editValue = ref('')
const showPasswordModal = ref(false)
const passwordError = ref('')

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 头像选项 - DiceBear Adventurer 风格
const avatarOptions = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Cara&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Fiona&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Gina&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Hana&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Iris&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jade&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Kara&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Nina&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Olivia&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Pia&backgroundColor=b6e3f4'
]

// 是否有修改
const hasChanges = computed(() => {
  if (!originalForm.value) return false
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
})

// 是否可以修改密码
const canChangePassword = computed(() => {
  return passwordForm.value.oldPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword.length >= 8 &&
    /[a-zA-Z]/.test(passwordForm.value.newPassword) &&
    /\d/.test(passwordForm.value.newPassword)
})

// 初始化
onMounted(() => {
  const user = userStore.userInfo
  if (user) {
    form.value = {
      nickname: user.nickname || user.name || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      privacy: { ...form.value.privacy, ...user.privacy },
      notifications: { ...form.value.notifications, ...user.notifications }
    }
    originalForm.value = JSON.parse(JSON.stringify(form.value))
  }
})

// 手机号脱敏
function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 返回
function goBack() {
  router.back()
}

// 选择头像
function selectAvatar(avatar) {
  form.value.avatar = avatar
  showAvatarPicker.value = false
}

// 编辑字段
function editField(field) {
  editingField.value = field
  editValue.value = form.value[field] || ''
}

// 取消编辑
function cancelEdit() {
  editingField.value = null
  editValue.value = ''
}

// 确认编辑
function confirmEdit() {
  if (editingField.value) {
    form.value[editingField.value] = editValue.value.trim()
    editingField.value = null
    editValue.value = ''
  }
}

// 切换隐私设置
function togglePrivacy(key) {
  form.value.privacy[key] = !form.value.privacy[key]
}

// 切换通知设置
function toggleNotification(key) {
  form.value.notifications[key] = !form.value.notifications[key]
}

// 修改密码
async function changePassword() {
  passwordError.value = ''
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '两次输入的密码不一致'
    return
  }
  try {
    const result = await userStore.updateProfile({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    if (result?.code === 200) {
      showPasswordModal.value = false
      passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
      alert('密码修改成功')
    } else {
      passwordError.value = result?.message || '密码修改失败'
    }
  } catch (err) {
    passwordError.value = '网络异常，请稍后重试'
  }
}

// 保存设置
async function saveSettings() {
  if (!hasChanges.value || saving.value) return
  saving.value = true
  try {
    const result = await userStore.updateProfile({
      nickname: form.value.nickname,
      avatar: form.value.avatar,
      bio: form.value.bio,
      privacy: form.value.privacy,
      notifications: form.value.notifications
    })
    if (result?.code === 200) {
      originalForm.value = JSON.parse(JSON.stringify(form.value))
      alert('设置保存成功')
    } else {
      alert(result?.message || '保存失败')
    }
  } catch (err) {
    alert('网络异常，请稍后重试')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.settings-container {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.settings-header {
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #eeeeee;
}

.back-btn {
  width: 24px;
  height: 24px;
  color: #333333;
  cursor: pointer;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-placeholder {
  width: 24px;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.settings-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #999999;
  margin-bottom: 8px;
  padding-left: 4px;
}

.settings-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  color: #333333;
}

.setting-value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.setting-value span {
  font-size: 14px;
  color: #999999;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  color: #cccccc;
}

/* 头像设置 */
.avatar-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.avatar-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-default {
  width: 40px;
  height: 40px;
  color: #cccccc;
}

.phone-mask {
  color: #999999;
}

.bio-text {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.version-text {
  color: #999999;
}

/* 开关 */
.toggle-item {
  cursor: default;
}

.toggle-switch {
  width: 48px;
  height: 28px;
  background: #e5e5e5;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-switch.active {
  background: #FF2442;
}

.toggle-dot {
  width: 24px;
  height: 24px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-dot {
  transform: translateX(20px);
}

/* 保存按钮 */
.save-section {
  padding: 20px 16px 40px;
}

.save-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #FF2442, #FF4D6A);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  width: 85%;
  max-width: 340px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
  text-align: center;
}

/* 头像选择弹窗 */
.avatar-modal {
  max-height: 70vh;
  overflow-y: auto;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.avatar-option {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.avatar-option.selected {
  border-color: #FF2442;
}

.avatar-option-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-close-btn {
  width: 100%;
  height: 44px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  color: #333333;
  font-size: 15px;
  cursor: pointer;
}

/* 编辑输入 */
.edit-input {
  width: 100%;
  height: 44px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 15px;
  margin-bottom: 12px;
  outline: none;
}

.edit-textarea {
  width: 100%;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  margin-bottom: 12px;
  outline: none;
  resize: none;
}

.password-form .edit-input {
  margin-bottom: 10px;
}

.error-text {
  font-size: 13px;
  color: #EF4444;
  margin-bottom: 12px;
}

/* 弹窗按钮 */
.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.modal-btn.cancel {
  background: #f5f5f5;
  color: #666666;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #FF2442, #FF4D6A);
  color: #ffffff;
}

.modal-btn.confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
