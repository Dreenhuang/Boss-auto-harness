import { Router } from 'express'
import {
  getUserList,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  toggleUserStatus
} from '../controllers/admin/userManage.js'

import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/admin/roleManage.js'

import {
  getContentList,
  getContentDetail,
  createContent,
  updateContent,
  deleteContent,
  auditContent,
  batchAuditContent
} from '../controllers/admin/contentManage.js'

import {
  getStatsOverview,
  getUserStats,
  getContentStats,
  getLearningStats,
  exportData
} from '../controllers/admin/stats.js'

import {
  getSystemConfig,
  updateSystemConfig
} from '../controllers/admin/systemConfig.js'

import {
  getLogList,
  getLogDetail,
  clearLogs
} from '../controllers/admin/operationLog.js'

import {
  getPromptList,
  getPromptDetail,
  createPrompt,
  updatePrompt,
  deletePrompt,
  getPromptCategories,
  getPromptByKey
} from '../controllers/admin/promptManage.js'

const router = Router()

// 用户管理
router.get('/users', getUserList)
router.get('/users/:id', getUserDetail)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)
router.post('/users/batch-delete', batchDeleteUsers)
router.post('/users/:id/toggle-status', toggleUserStatus)

// 角色管理
router.get('/roles', getRoleList)
router.post('/roles', createRole)
router.put('/roles/:id', updateRole)
router.delete('/roles/:id', deleteRole)

// 内容管理
router.get('/contents', getContentList)
router.get('/contents/:id', getContentDetail)
router.post('/contents', createContent)
router.put('/contents/:id', updateContent)
router.delete('/contents/:id', deleteContent)
router.post('/contents/:id/audit', auditContent)
router.post('/contents/batch-audit', batchAuditContent)

// 数据统计
router.get('/stats/overview', getStatsOverview)
router.get('/stats/users', getUserStats)
router.get('/stats/contents', getContentStats)
router.get('/stats/learning', getLearningStats)
router.post('/stats/export', exportData)

// 系统设置
router.get('/system/config', getSystemConfig)
router.put('/system/config', updateSystemConfig)

// 操作日志
router.get('/logs', getLogList)
router.get('/logs/:id', getLogDetail)
router.delete('/logs', clearLogs)

// 提示词管理
router.get('/prompts', getPromptList)
router.get('/prompts/categories', getPromptCategories)
router.get('/prompts/:id', getPromptDetail)
router.get('/prompts/key/:key', getPromptByKey)
router.post('/prompts', createPrompt)
router.put('/prompts/:id', updatePrompt)
router.delete('/prompts/:id', deletePrompt)

export default router
