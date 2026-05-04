import { supabase } from '../../server.js'

// 默认角色配置
const defaultRoles = [
  {
    id: 'super_admin',
    name: 'super_admin',
    label: '超级管理员',
    description: '拥有系统所有权限',
    permissions: ['*'],
    isSystem: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin',
    name: 'admin',
    label: '管理员',
    description: '日常运营管理',
    permissions: [
      'dashboard:view',
      'user:view', 'user:edit', 'user:ban',
      'content:view', 'content:create', 'content:edit', 'content:audit',
      'data:view',
      'system:view'
    ],
    isSystem: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'editor',
    name: 'editor',
    label: '内容编辑',
    description: '内容创作和编辑',
    permissions: [
      'dashboard:view',
      'content:view', 'content:create', 'content:edit', 'content:audit'
    ],
    isSystem: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'viewer',
    name: 'viewer',
    label: '数据查看员',
    description: '仅可查看数据',
    permissions: [
      'dashboard:view',
      'user:view',
      'content:view',
      'data:view'
    ],
    isSystem: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'finance',
    name: 'finance',
    label: '财务专员',
    description: '财务数据查看和导出',
    permissions: [
      'dashboard:view',
      'data:view', 'data:export',
      'system:view'
    ],
    isSystem: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'customer_service',
    name: 'customer_service',
    label: '客服专员',
    description: '用户服务和反馈处理',
    permissions: [
      'dashboard:view',
      'user:view', 'user:edit',
      'content:view'
    ],
    isSystem: false,
    createdAt: new Date().toISOString()
  }
]

let roles = [...defaultRoles]

// 获取角色列表
export async function getRoleList(req, res) {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: roles
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 创建角色
export async function createRole(req, res) {
  try {
    const { name, label, description, permissions } = req.body

    const newRole = {
      id: name,
      name,
      label,
      description,
      permissions,
      isSystem: false,
      createdAt: new Date().toISOString()
    }

    roles.push(newRole)

    res.json({ code: 200, message: '创建成功', data: newRole })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 更新角色
export async function updateRole(req, res) {
  try {
    const { id } = req.params
    const { label, description, permissions } = req.body

    const index = roles.findIndex(r => r.id === id)
    if (index === -1) {
      return res.status(404).json({ code: 404, message: '角色不存在', data: null })
    }

    if (roles[index].isSystem) {
      return res.status(403).json({ code: 403, message: '系统内置角色不可修改', data: null })
    }

    roles[index] = {
      ...roles[index],
      label,
      description,
      permissions,
      updatedAt: new Date().toISOString()
    }

    res.json({ code: 200, message: '更新成功', data: roles[index] })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 删除角色
export async function deleteRole(req, res) {
  try {
    const { id } = req.params

    const index = roles.findIndex(r => r.id === id)
    if (index === -1) {
      return res.status(404).json({ code: 404, message: '角色不存在', data: null })
    }

    if (roles[index].isSystem) {
      return res.status(403).json({ code: 403, message: '系统内置角色不可删除', data: null })
    }

    roles.splice(index, 1)

    res.json({ code: 200, message: '删除成功' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
