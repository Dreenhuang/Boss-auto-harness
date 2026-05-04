<template>
  <div class="system-config">
    <el-alert
      v-if="authStore.isSuperAdmin"
      title="超级管理员系统权限"
      type="success"
      description="您可以查看和修改所有系统设置，包括网站信息、用户注册配置、内容审核规则、通知模板等核心系统配置。"
      show-icon
      :closable="false"
      class="permission-alert"
    />
    <el-alert
      v-else
      title="查看权限"
      type="info"
      description="您只能查看系统设置，无法修改。如需修改请联系超级管理员。"
      show-icon
      :closable="false"
      class="permission-alert"
    />

    <!-- 基础配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="config-header">
          <span>基础配置</span>
          <el-tag v-if="authStore.hasPermission('system:edit')" type="success">可编辑</el-tag>
          <el-tag v-else type="info">只读</el-tag>
        </div>
      </template>

      <el-form :model="configForm" label-width="120px">
        <el-form-item label="网站名称">
          <el-input
            v-model="configForm.siteName"
            :disabled="!authStore.hasPermission('system:edit')"
            placeholder="请输入网站名称"
          />
        </el-form-item>
        <el-form-item label="网站Logo">
          <el-input
            v-model="configForm.logo"
            :disabled="!authStore.hasPermission('system:edit')"
            placeholder="Logo URL"
          />
        </el-form-item>
        <el-form-item label="ICP备案号">
          <el-input
            v-model="configForm.icp"
            :disabled="!authStore.hasPermission('system:edit')"
            placeholder="请输入ICP备案号"
          />
        </el-form-item>
        <el-form-item label="客服邮箱">
          <el-input
            v-model="configForm.email"
            :disabled="!authStore.hasPermission('system:edit')"
            placeholder="请输入客服邮箱"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 注册配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="config-header">
          <span>注册配置</span>
        </div>
      </template>

      <el-form :model="configForm" label-width="120px">
        <el-form-item label="注册开关">
          <el-switch
            v-model="configForm.registerEnabled"
            :disabled="!authStore.hasPermission('system:edit')"
          />
        </el-form-item>
        <el-form-item label="验证码开关">
          <el-switch
            v-model="configForm.captchaEnabled"
            :disabled="!authStore.hasPermission('system:edit')"
          />
        </el-form-item>
        <el-form-item label="邀请码模式">
          <el-switch
            v-model="configForm.inviteCodeRequired"
            :disabled="!authStore.hasPermission('system:edit')"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 内容审核配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="config-header">
          <span>内容审核配置</span>
        </div>
      </template>

      <el-form :model="configForm" label-width="120px">
        <el-form-item label="自动审核">
          <el-switch
            v-model="configForm.autoAudit"
            :disabled="!authStore.hasPermission('system:edit')"
          />
        </el-form-item>
        <el-form-item label="敏感词过滤">
          <el-switch
            v-model="configForm.sensitiveWordFilter"
            :disabled="!authStore.hasPermission('system:edit')"
          />
        </el-form-item>
        <el-form-item label="人工复核">
          <el-switch
            v-model="configForm.manualReview"
            :disabled="!authStore.hasPermission('system:edit')"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 保存按钮 -->
    <div v-if="authStore.hasPermission('system:edit')" class="save-section">
      <el-button type="primary" size="large" @click="handleSave">
        <el-icon><Check /></el-icon>
        保存设置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

const configForm = reactive({
  siteName: 'Vibe PM',
  logo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=VibePM&backgroundColor=FF2442',
  icp: '京ICP备12345678号',
  email: 'support@vibepm.com',
  registerEnabled: true,
  captchaEnabled: true,
  inviteCodeRequired: false,
  autoAudit: false,
  sensitiveWordFilter: true,
  manualReview: true
})

function handleSave() {
  ElMessage.success('设置保存成功')
}
</script>

<style scoped>
.system-config {
  padding-bottom: 24px;
}

.permission-alert {
  margin-bottom: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.save-section .el-button {
  width: 200px;
  height: 48px;
  font-size: 16px;
}
</style>
