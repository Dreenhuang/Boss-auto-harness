<template>
  <div class="role-manage">
    <el-alert
      v-if="authStore.isSuperAdmin"
      title="超级管理员权限说明"
      type="success"
      description="作为超级管理员，您可以创建、编辑、删除任何角色，并为角色分配任意权限。其他管理员只能管理其权限范围内的角色。"
      show-icon
      :closable="false"
      class="permission-alert"
    />

    <!-- 角色列表 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="role in roleList" :key="role.name">
        <el-card class="role-card" shadow="hover">
          <template #header>
            <div class="role-header">
              <div class="role-info">
                <h3 class="role-name">{{ role.label }}</h3>
                <el-tag :type="role.name === 'super_admin' ? 'danger' : 'info'" size="small">
                  {{ role.name === 'super_admin' ? '系统内置' : '自定义' }}
                </el-tag>
              </div>
              <div class="role-actions">
                <el-button
                  v-if="authStore.hasPermission('role:edit') && role.name !== 'super_admin'"
                  link
                  type="primary"
                  @click="handleEdit(role)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="authStore.hasPermission('role:delete') && role.name !== 'super_admin'"
                  link
                  type="danger"
                  @click="handleDelete(role)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>

          <p class="role-desc">{{ role.description }}</p>

          <div class="permission-tags">
            <el-tag
              v-for="perm in role.permissions.slice(0, 6)"
              :key="perm"
              size="small"
              class="perm-tag"
            >
              {{ authStore.getPermissionLabel(perm) }}
            </el-tag>
            <el-tag v-if="role.permissions.length > 6" size="small" type="info">
              +{{ role.permissions.length - 6 }}
            </el-tag>
          </div>

          <div class="role-footer">
            <span class="perm-count">共 {{ role.permissions.length }} 项权限</span>
          </div>
        </el-card>
      </el-col>

      <!-- 添加角色卡片 -->
      <el-col :span="8" v-if="authStore.hasPermission('role:create')">
        <el-card class="role-card add-role" shadow="hover" @click="handleAdd">
          <div class="add-role-content">
            <el-icon class="add-icon"><Plus /></el-icon>
            <span class="add-text">创建新角色</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 权限矩阵 -->
    <el-card class="permission-matrix">
      <template #header>
        <div class="matrix-header">
          <span>权限矩阵</span>
          <el-tag v-if="authStore.isSuperAdmin" type="danger">完整权限</el-tag>
        </div>
      </template>

      <el-table :data="permissionMatrix" style="width: 100%">
        <el-table-column prop="permission" label="权限项" min-width="200">
          <template #default="{ row }">
            <span :class="{ 'super-admin-perm': row.isSuperAdminOnly }">
              {{ row.label }}
              <el-tag v-if="row.isSuperAdminOnly" type="danger" size="small">超管专属</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="role in roleList"
          :key="role.name"
          :label="role.label"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-icon v-if="row[role.name]" class="check-icon"><Check /></el-icon>
            <el-icon v-else class="close-icon"><Close /></el-icon>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑角色弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '创建角色' : '编辑角色'"
      width="600px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="form.label" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="form.name" placeholder="请输入角色标识（英文）" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="权限配置">
          <div class="perm-config">
            <div v-for="group in permissionGroups" :key="group.name" class="perm-group">
              <h4 class="group-title">{{ group.name }}</h4>
              <el-checkbox-group v-model="form.permissions">
                <el-checkbox
                  v-for="perm in group.permissions"
                  :key="perm.code"
                  :label="perm.code"
                  :disabled="perm.isSuperAdminOnly && !authStore.isSuperAdmin"
                >
                  {{ perm.label }}
                  <el-tag v-if="perm.isSuperAdminOnly" type="danger" size="small">超管</el-tag>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Check, Close } from '@element-plus/icons-vue'
import { useAuthStore, ROLES, PERMISSIONS } from '../stores/auth.js'

const authStore = useAuthStore()

// 角色列表
const roleList = ref(Object.values(ROLES))

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref('add')
const form = reactive({
  name: '',
  label: '',
  description: '',
  permissions: []
})

// 权限分组
const permissionGroups = [
  {
    name: '用户管理',
    permissions: [
      { code: PERMISSIONS.USER_VIEW, label: '查看用户' },
      { code: PERMISSIONS.USER_CREATE, label: '创建用户' },
      { code: PERMISSIONS.USER_EDIT, label: '编辑用户' },
      { code: PERMISSIONS.USER_DELETE, label: '删除用户', isSuperAdminOnly: true },
      { code: PERMISSIONS.USER_BAN, label: '禁用用户' }
    ]
  },
  {
    name: '角色权限',
    permissions: [
      { code: PERMISSIONS.ROLE_VIEW, label: '查看角色' },
      { code: PERMISSIONS.ROLE_CREATE, label: '创建角色', isSuperAdminOnly: true },
      { code: PERMISSIONS.ROLE_EDIT, label: '编辑角色', isSuperAdminOnly: true },
      { code: PERMISSIONS.ROLE_DELETE, label: '删除角色', isSuperAdminOnly: true }
    ]
  },
  {
    name: '内容管理',
    permissions: [
      { code: PERMISSIONS.CONTENT_VIEW, label: '查看内容' },
      { code: PERMISSIONS.CONTENT_CREATE, label: '创建内容' },
      { code: PERMISSIONS.CONTENT_EDIT, label: '编辑内容' },
      { code: PERMISSIONS.CONTENT_DELETE, label: '删除内容' },
      { code: PERMISSIONS.CONTENT_AUDIT, label: '审核内容' }
    ]
  },
  {
    name: '数据统计',
    permissions: [
      { code: PERMISSIONS.DATA_VIEW, label: '查看数据' },
      { code: PERMISSIONS.DATA_EXPORT, label: '导出数据' }
    ]
  },
  {
    name: '系统设置',
    permissions: [
      { code: PERMISSIONS.SYSTEM_VIEW, label: '查看设置' },
      { code: PERMISSIONS.SYSTEM_EDIT, label: '编辑设置', isSuperAdminOnly: true }
    ]
  }
]

// 权限矩阵数据
const permissionMatrix = computed(() => {
  const allPerms = Object.values(PERMISSIONS)
  return allPerms.map(perm => {
    const row = {
      code: perm,
      label: authStore.getPermissionLabel(perm),
      isSuperAdminOnly: !ROLES.ADMIN.permissions.includes(perm) && perm !== PERMISSIONS.DASHBOARD_VIEW
    }
    roleList.value.forEach(role => {
      row[role.name] = role.permissions.includes(perm)
    })
    return row
  })
})

// 添加角色
function handleAdd() {
  dialogType.value = 'add'
  form.name = ''
  form.label = ''
  form.description = ''
  form.permissions = []
  dialogVisible.value = true
}

// 编辑角色
function handleEdit(role) {
  dialogType.value = 'edit'
  Object.assign(form, role)
  dialogVisible.value = true
}

// 删除角色
function handleDelete(role) {
  ElMessageBox.confirm(`确定要删除角色"${role.label}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    const index = roleList.value.findIndex(r => r.name === role.name)
    if (index > -1) {
      roleList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 提交
function handleSubmit() {
  if (dialogType.value === 'add') {
    const newRole = {
      name: form.name,
      label: form.label,
      description: form.description,
      permissions: form.permissions
    }
    roleList.value.push(newRole)
    ElMessage.success('创建成功')
  } else {
    const index = roleList.value.findIndex(r => r.name === form.name)
    if (index > -1) {
      roleList.value[index] = { ...roleList.value[index], ...form }
      ElMessage.success('更新成功')
    }
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.role-manage {
  padding-bottom: 24px;
}

.permission-alert {
  margin-bottom: 20px;
}

.role-card {
  margin-bottom: 20px;
  height: 240px;
  display: flex;
  flex-direction: column;
}

.role-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.role-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.role-actions {
  display: flex;
  gap: 8px;
}

.role-desc {
  font-size: 14px;
  color: #666666;
  margin: 12px 0;
  flex: 1;
}

.permission-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.perm-tag {
  margin-right: 0;
}

.role-footer {
  border-top: 1px solid #eeeeee;
  padding-top: 12px;
}

.perm-count {
  font-size: 13px;
  color: #999999;
}

.add-role {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #d9d9d9;
  background: #fafafa;
}

.add-role:hover {
  border-color: #FF2442;
  background: #fff5f5;
}

.add-role-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.add-icon {
  font-size: 40px;
  color: #999999;
}

.add-text {
  font-size: 16px;
  color: #666666;
}

.permission-matrix {
  margin-top: 20px;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check-icon {
  color: #52c41a;
  font-size: 18px;
}

.close-icon {
  color: #d9d9d9;
  font-size: 18px;
}

.super-admin-perm {
  color: #f5222d;
  font-weight: 600;
}

.perm-config {
  max-height: 400px;
  overflow-y: auto;
}

.perm-group {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.perm-group:last-child {
  border-bottom: none;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

:deep(.el-checkbox) {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
