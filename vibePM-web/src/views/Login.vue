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

      <div class="login-form" v-if="!isGuestMode">
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
          <Icon icon="ri:shield-keyhole-line" class="input-icon" />
          <input 
            type="text" 
            v-model="code" 
            placeholder="验证码" 
            maxlength="6"
            class="input-field code-input"
          />
          <button 
            class="code-btn" 
            :disabled="countdown > 0 || !isPhoneValid"
            @click="sendVerifyCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>

        <button 
          class="login-btn" 
          :disabled="!canLogin || logging"
          @click="handleLogin"
        >
          {{ logging ? '登录中...' : '登录' }}
        </button>
      </div>

      <div class="guest-section">
        <div class="divider">
          <span class="divider-text">或者</span>
        </div>
        <button class="guest-btn" @click="handleGuestLogin" :disabled="logging">
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

const phone = ref('')
const code = ref('')
const countdown = ref(0)
const logging = ref(false)
const agreed = ref(false)
const isGuestMode = ref(false)

const isPhoneValid = computed(() => /^1\d{10}$/.test(phone.value))
const canLogin = computed(() => isPhoneValid.value && code.value.length === 6 && agreed.value)

let countdownTimer = null

const sendVerifyCode = async () => {
  if (!isPhoneValid.value || countdown.value > 0) return
  const result = await userStore.login(phone.value, '000000')
  if (result?.code === 200) {
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(countdownTimer)
    }, 1000)
  }
}

const handleLogin = async () => {
  if (!canLogin.value || logging.value) return
  logging.value = true
  try {
    const result = await userStore.login(phone.value, code.value)
    if (result?.code === 200) {
      router.replace('/main')
    }
  } finally {
    logging.value = false
  }
}

const handleGuestLogin = async () => {
  if (logging.value) return
  logging.value = true
  try {
    const result = await userStore.guestLogin()
    if (result?.code === 200) {
      router.replace('/main')
    }
  } finally {
    logging.value = false
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
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
}

.logo-area {
  text-align: center;
  margin-bottom: 48px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.code-input {
  flex: 1;
}

.code-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #6366f1;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  padding: 4px 0;
}

.code-btn:disabled {
  color: #CCCCCC;
  cursor: not-allowed;
}

.login-btn {
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
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
  margin-top: 32px;
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
  margin-top: 32px;
}

.agree-icon {
  font-size: 20px;
  color: #CCCCCC;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 1px;
}

.agree-icon.agreed {
  color: #6366f1;
}

.agree-text {
  font-size: 12px;
  color: #999999;
  line-height: 1.6;
}

.agree-text a {
  color: #6366f1;
  text-decoration: none;
}
</style>
