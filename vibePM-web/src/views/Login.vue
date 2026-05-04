<template>
  <div class="login-container">
    <div class="login-header">
      <Icon icon="ri:arrow-left-s-line" class="back-btn" @click="goBack" />
    </div>

    <div class="login-body">
      <div class="logo-area">
        <div class="logo-icon">
          <Icon icon="ri:lightbulb-flash-line" class="logo-img" />
        </div>
        <h1 class="app-name">Vibe PM</h1>
        <p class="app-slogan">让技术学习不再困难</p>
      </div>

      <div class="tab-switch">
        <div
          class="tab-item"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          登录
        </div>
        <div
          class="tab-item"
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          注册
        </div>
      </div>

      <div class="login-form">
        <div class="input-group">
          <Icon icon="ri:phone-line" class="input-icon" />
          <input
            type="tel"
            v-model="phone"
            placeholder="请输入手机号"
            maxlength="11"
            class="input-field"
          />
        </div>

        <div class="input-group">
          <Icon icon="ri:lock-line" class="input-icon" />
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="请输入密码"
            class="input-field"
          />
          <Icon
            :icon="showPassword ? 'ri:eye-off-line' : 'ri:eye-line'"
            class="input-icon toggle-pwd"
            @click="showPassword = !showPassword"
          />
        </div>

        <div class="input-group" v-if="mode === 'register'">
          <Icon icon="ri:lock-line" class="input-icon" />
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="请确认密码"
            class="input-field"
          />
          <Icon
            :icon="showConfirmPassword ? 'ri:eye-off-line' : 'ri:eye-line'"
            class="input-icon toggle-pwd"
            @click="showConfirmPassword = !showConfirmPassword"
          />
        </div>

        <p class="password-hint" v-if="mode === 'register'">
          密码至少8位，必须包含字母和数字
        </p>

        <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>

        <button
          class="login-btn"
          :disabled="!canSubmit || submitting"
          @click="handleSubmit"
        >
          {{ submitting ? (mode === 'login' ? '登录中...' : '注册中...') : (mode === 'login' ? '登录' : '注册') }}
        </button>
      </div>

      <div class="guest-section">
        <div class="divider">
          <span class="divider-text">或者</span>
        </div>
        <button class="guest-btn" @click="handleGuestLogin" :disabled="submitting">
          <Icon icon="ri:user-line" class="guest-icon" />
          游客模式体验
        </button>
      </div>

      <div class="agreement">
        <Icon
          :icon="agreed ? 'ri:checkbox-circle-fill' : 'ri:checkbox-blank-circle-line'"
          class="agree-icon"
          :class="{ agreed }"
          @click="agreed = !agreed"
        />
        <span class="agree-text">
          我已阅读并同意 <a href="javascript:void(0)">《用户协议》</a> 和 <a href="javascript:void(0)">《隐私政策》</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '../stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const mode = ref('login')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const submitting = ref(false)
const agreed = ref(false)
const errorMsg = ref('')

const isPhoneValid = computed(() => /^1\d{10}$/.test(phone.value))
const isPasswordValid = computed(() => {
  if (!password.value || password.value.length < 8) return false
  const hasLetter = /[a-zA-Z]/.test(password.value)
  const hasNumber = /\d/.test(password.value)
  return hasLetter && hasNumber
})
const isConfirmValid = computed(() => {
  if (mode.value === 'login') return true
  return password.value === confirmPassword.value && confirmPassword.value.length > 0
})

const canSubmit = computed(() => {
  if (!isPhoneValid.value || !isPasswordValid.value || !agreed.value) return false
  if (mode.value === 'register' && !isConfirmValid.value) return false
  return true
})

const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return
  errorMsg.value = ''
  submitting.value = true

  try {
    if (mode.value === 'register') {
      if (password.value !== confirmPassword.value) {
        errorMsg.value = '两次输入的密码不一致'
        return
      }
      const result = await userStore.register(phone.value, password.value)
      if (result?.code === 200) {
        router.replace('/main')
      } else {
        errorMsg.value = result?.message || '注册失败，请重试'
      }
    } else {
      const result = await userStore.login(phone.value, password.value)
      if (result?.code === 200) {
        router.replace('/main')
      } else {
        errorMsg.value = result?.message || '登录失败，请重试'
      }
    }
  } catch (err) {
    errorMsg.value = '网络异常，请稍后重试'
  } finally {
    submitting.value = false
  }
}

const handleGuestLogin = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const result = await userStore.guestLogin()
    if (result?.code === 200) {
      router.replace('/main')
    }
  } finally {
    submitting.value = false
  }
}

const goBack = () => router.back()
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.login-header {
  padding: 48px 16px 12px;
}

.back-btn {
  font-size: 28px;
  color: #333333;
  cursor: pointer;
}

.login-body {
  flex: 1;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
}

.logo-area {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #FF2442, #FF4D6A);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo-img {
  font-size: 36px;
  color: #ffffff;
}

.app-name {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.app-slogan {
  font-size: 14px;
  color: #999999;
}

.tab-switch {
  display: flex;
  background: #F5F5F5;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: #999999;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab-item.active {
  background: #ffffff;
  color: #FF2442;
  box-shadow: 0 2px 8px rgba(255, 36, 66, 0.15);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 12px;
  padding: 0 16px;
  height: 48px;
  gap: 12px;
}

.input-icon {
  font-size: 20px;
  color: #999999;
  flex-shrink: 0;
}

.toggle-pwd {
  cursor: pointer;
  color: #BBBBBB;
}

.toggle-pwd:hover {
  color: #FF2442;
}

.input-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #333333;
  outline: none;
}

.input-field::placeholder {
  color: #CCCCCC;
}

.password-hint {
  font-size: 12px;
  color: #AAAAAA;
  margin: -4px 0 0 4px;
}

.error-msg {
  font-size: 13px;
  color: #EF4444;
  margin: -2px 0 0 4px;
}

.login-btn {
  height: 48px;
  background: linear-gradient(135deg, #FF2442, #FF4D6A);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.login-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.guest-section {
  margin-top: 28px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #EEEEEE;
}

.divider-text {
  padding: 0 16px;
  font-size: 12px;
  color: #CCCCCC;
}

.guest-btn {
  width: 100%;
  height: 48px;
  background: #F5F5F5;
  border: 1px solid #EEEEEE;
  border-radius: 12px;
  color: #666666;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.guest-btn:active {
  background: #EEEEEE;
  transform: scale(0.98);
}

.guest-icon {
  font-size: 18px;
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 28px;
}

.agree-icon {
  font-size: 20px;
  color: #CCCCCC;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 1px;
}

.agree-icon.agreed {
  color: #FF2442;
}

.agree-text {
  font-size: 12px;
  color: #999999;
  line-height: 1.6;
}

.agree-text a {
  color: #FF2442;
  text-decoration: none;
}
</style>
