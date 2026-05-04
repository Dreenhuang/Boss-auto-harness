import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 权限定义
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_BAN: 'user:ban',
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_EDIT: 'role:edit',
  ROLE_DELETE: 'role:delete',
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_AUDIT: 'content:audit',
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  DATA_VIEW: 'data:view',
  DATA_EXPORT: 'data:export',
  LOG_VIEW: 'log:view',
  LOG_CLEAR: 'log:clear'
}

// 角色定义（包含新增角色）
export const ROLES = {
  SUPER_ADMIN: {
    name: 'super_admin',
    label: '超级管理员',
    description: '拥有系统所有权限',
    permissions: Object.values(PERMISSIONS)
  },
  ADMIN: {
    name: 'admin',
    label: '管理员',
    description: '日常运营管理',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.USER_VIEW, PERMISSIONS.USER_EDIT, PERMISSIONS.USER_BAN,
      PERMISSIONS.CONTENT_VIEW, PERMISSIONS.CONTENT_CREATE, PERMISSIONS.CONTENT_EDIT, PERMISSIONS.CONTENT_AUDIT,
      PERMISSIONS.DATA_VIEW,
      PERMISSIONS.SYSTEM_VIEW,
      PERMISSIONS.LOG_VIEW
    ]
  },
  EDITOR: {
    name: 'editor',
    label: '内容编辑',
    description: '内容创作和编辑',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.CONTENT_VIEW, PERMISSIONS.CONTENT_CREATE, PERMISSIONS.CONTENT_EDIT, PERMISSIONS.CONTENT_AUDIT
    ]
  },
  VIEWER: {
    name: 'viewer',
    label: '数据查看员',
    description: '仅可查看数据',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.DATA_VIEW
    ]
  },
  FINANCE: {
    name: 'finance',
    label: '财务专员',
    description: '财务数据查看和导出',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DATA_VIEW, PERMISSIONS.DATA_EXPORT,
      PERMISSIONS.SYSTEM_VIEW
    ]
  },
  CUSTOMER_SERVICE: {
    name: 'customer_service',
    label: '客服专员',
    description: '用户服务和反馈处理',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.USER_VIEW, PERMISSIONS.USER_EDIT,
      PERMISSIONS.CONTENT_VIEW
    ]
  }
}

const SUPER_ADMIN_ACCOUNT = {
  id: 'super_admin_001',
  username: 'admin',
  password: 'admin123456',
  name: '超级管理员',
  avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin&backgroundColor=FF2442',
  role: ROLES.SUPER_ADMIN.name,
  permissions: ROLES.SUPER_ADMIN.permissions,
  isSuperAdmin: true,
  lastLogin: null
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const user = ref(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isSuperAdmin = computed(() => user.value?.isSuperAdmin === true)

  function hasPermission(permission) {
    if (!user.value) return false
    if (user.value.isSuperAdmin) return true
    return user.value.permissions?.includes(permission) || false
  }

  function hasAnyPermission(permissions) {
    if (!Array.isArray(permissions)) return hasPermission(permissions)
    return permissions.some(p => hasPermission(p))
  }

  function hasAllPermissions(permissions) {
    if (!Array.isArray(permissions)) return hasPermission(permissions)
    return permissions.every(p => hasPermission(p))
  }

  async function login(username, password) {
    if (username === SUPER_ADMIN_ACCOUNT.username && password === SUPER_ADMIN_ACCOUNT.password) {
      const adminUser = {
        ...SUPER_ADMIN_ACCOUNT,
        lastLogin: new Date().toISOString()
      }
      user.value = adminUser
      token.value = 'super_admin_token_' + Date.now()
      localStorage.setItem('admin_token', token.value)
      localStorage.setItem('admin_user', JSON.stringify(adminUser))
      return { code: 200, message: '登录成功', data: adminUser }
    }
    return { code: 401, message: '用户名或密码错误' }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  function restoreFromStorage() {
    const savedToken = localStorage.getItem('admin_token')
    const savedUser = localStorage.getItem('admin_user')
    if (savedToken && savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        token.value = savedToken
      } catch {
        logout()
      }
    }
  }

  function getRoles() {
    return Object.values(ROLES)
  }

  function getPermissions() {
    return Object.entries(PERMISSIONS).map(([key, value]) => ({
      key,
      code: value,
      label: getPermissionLabel(value)
    }))
  }

  function getPermissionLabel(permission) {
    const labels = {
      [PERMISSIONS.DASHBOARD_VIEW]: '查看仪表盘',
      [PERMISSIONS.USER_VIEW]: '查看用户',
      [PERMISSIONS.USER_CREATE]: '创建用户',
      [PERMISSIONS.USER_EDIT]: '编辑用户',
      [PERMISSIONS.USER_DELETE]: '删除用户',
      [PERMISSIONS.USER_BAN]: '禁用/启用用户',
      [PERMISSIONS.ROLE_VIEW]: '查看角色',
      [PERMISSIONS.ROLE_CREATE]: '创建角色',
      [PERMISSIONS.ROLE_EDIT]: '编辑角色',
      [PERMISSIONS.ROLE_DELETE]: '删除角色',
      [PERMISSIONS.CONTENT_VIEW]: '查看内容',
      [PERMISSIONS.CONTENT_CREATE]: '创建内容',
      [PERMISSIONS.CONTENT_EDIT]: '编辑内容',
      [PERMISSIONS.CONTENT_DELETE]: '删除内容',
      [PERMISSIONS.CONTENT_AUDIT]: '审核内容',
      [PERMISSIONS.SYSTEM_VIEW]: '查看系统设置',
      [PERMISSIONS.SYSTEM_EDIT]: '编辑系统设置',
      [PERMISSIONS.DATA_VIEW]: '查看数据',
      [PERMISSIONS.DATA_EXPORT]: '导出数据',
      [PERMISSIONS.LOG_VIEW]: '查看日志',
      [PERMISSIONS.LOG_CLEAR]: '清空日志'
    }
    return labels[permission] || permission
  }

  return {
    token,
    user,
    isLoggedIn,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    login,
    logout,
    restoreFromStorage,
    getRoles,
    getPermissions,
    getPermissionLabel
  }
})
