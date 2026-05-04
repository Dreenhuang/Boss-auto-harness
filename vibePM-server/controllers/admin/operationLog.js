import { supabase } from '../../server.js'

// 内存中的日志存储（实际生产环境应使用数据库）
let operationLogs = []
let logIdCounter = 1

// 添加日志的辅助函数
export function addLog({ action, module, description, operator, details = {} }) {
  const log = {
    id: logIdCounter++,
    action,
    module,
    description,
    operator: operator || 'system',
    details,
    ip: '127.0.0.1',
    userAgent: 'admin-client',
    createdAt: new Date().toISOString()
  }
  operationLogs.unshift(log)

  // 只保留最近1000条日志
  if (operationLogs.length > 1000) {
    operationLogs = operationLogs.slice(0, 1000)
  }

  return log
}

// 获取日志列表
export async function getLogList(req, res) {
  try {
    const { page = 1, pageSize = 20, module = '', action = '', startDate = '', endDate = '' } = req.query

    let filtered = [...operationLogs]

    if (module) {
      filtered = filtered.filter(log => log.module === module)
    }

    if (action) {
      filtered = filtered.filter(log => log.action === action)
    }

    if (startDate) {
      filtered = filtered.filter(log => log.createdAt >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter(log => log.createdAt <= endDate)
    }

    const total = filtered.length
    const offset = (page - 1) * pageSize
    const list = filtered.slice(offset, offset + parseInt(pageSize))

    res.json({
      code: 200,
      message: 'success',
      data: {
        list,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 获取日志详情
export async function getLogDetail(req, res) {
  try {
    const { id } = req.params
    const log = operationLogs.find(l => l.id === parseInt(id))

    if (!log) {
      return res.status(404).json({ code: 404, message: '日志不存在', data: null })
    }

    res.json({ code: 200, message: 'success', data: log })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 清空日志
export async function clearLogs(req, res) {
  try {
    operationLogs = []
    logIdCounter = 1

    addLog({
      action: 'clear',
      module: 'system',
      description: '清空了所有操作日志',
      operator: req.user?.name || 'admin'
    })

    res.json({ code: 200, message: '日志已清空' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
