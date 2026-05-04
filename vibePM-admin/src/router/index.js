import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore, PERMISSIONS } from '../stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          icon: 'Odometer',
          permission: PERMISSIONS.DASHBOARD_VIEW
        }
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('../views/UserManage.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          permission: PERMISSIONS.USER_VIEW
        }
      },
      {
        path: 'roles',
        name: 'RoleManage',
        component: () => import('../views/RoleManage.vue'),
        meta: {
          title: '角色权限',
          icon: 'Key',
          permission: PERMISSIONS.ROLE_VIEW
        }
      },
      {
        path: 'content',
        name: 'ContentManage',
        component: () => import('../views/ContentManage.vue'),
        meta: {
          title: '内容管理',
          icon: 'Document',
          permission: PERMISSIONS.CONTENT_VIEW
        }
      },
      {
        path: 'data',
        name: 'DataAnalysis',
        component: () => import('../views/DataAnalysis.vue'),
        meta: {
          title: '数据统计',
          icon: 'TrendCharts',
          permission: PERMISSIONS.DATA_VIEW
        }
      },
      {
        path: 'logs',
        name: 'OperationLog',
        component: () => import('../views/OperationLog.vue'),
        meta: {
          title: '操作日志',
          icon: 'List',
          permission: PERMISSIONS.LOG_VIEW
        }
      },
      {
        path: 'prompts',
        name: 'PromptManage',
        component: () => import('../views/PromptManage.vue'),
        meta: {
          title: '提示词管理',
          icon: 'ChatDotRound',
          permission: PERMISSIONS.SYSTEM_VIEW
        }
      },
      {
        path: 'system',
        name: 'SystemConfig',
        component: () => import('../views/SystemConfig.vue'),
        meta: {
          title: '系统设置',
          icon: 'Setting',
          permission: PERMISSIONS.SYSTEM_VIEW
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 公开页面直接通过
  if (to.meta?.public) {
    next()
    return
  }

  // 未登录跳转到登录页
  if (!authStore.isLoggedIn) {
    authStore.restoreFromStorage()
    if (!authStore.isLoggedIn) {
      next('/login')
      return
    }
  }

  // 检查页面权限
  if (to.meta?.permission && !authStore.hasPermission(to.meta.permission)) {
    next('/dashboard')
    return
  }

  next()
})

export default router
