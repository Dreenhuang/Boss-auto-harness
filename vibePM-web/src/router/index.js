import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/splash'
  },
  {
    path: '/splash',
    name: 'Splash',
    component: () => import('@/views/Splash.vue')
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('@/views/Guide.vue')
  },
  {
    path: '/questionnaire',
    name: 'Questionnaire',
    component: () => import('@/views/Questionnaire.vue')
  },
  {
    path: '/main',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'knowledge',
        name: 'Knowledge',
        component: () => import('@/views/KnowledgeBase.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/Message.vue')
      }
    ]
  },
  {
    path: '/card-detail',
    name: 'CardDetail',
    component: () => import('@/views/CardDetail.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/Favorites.vue')
  },
  {
    path: '/path-list',
    name: 'PathList',
    component: () => import('@/views/PathList.vue')
  },
  {
    path: '/path-detail',
    name: 'PathDetail',
    component: () => import('@/views/PathDetail.vue')
  },
  {
    path: '/export',
    name: 'Export',
    component: () => import('@/views/Export.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
