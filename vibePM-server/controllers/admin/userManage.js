import { supabase } from '../../server.js'

// 获取用户列表
export async function getUserList(req, res) {
  try {
    const { page = 1, pageSize = 10, keyword = '', status = '' } = req.query
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })

    if (keyword) {
      query = query.or(`nickname.ilike.%${keyword}%,phone.ilike.%${keyword}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw error

    const users = data.map(user => ({
      id: user.id,
      name: user.nickname || '未命名',
      phone: user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '',
      avatar: user.avatar || '',
      role: user.role || 'viewer',
      status: user.status || 'active',
      studyDays: user.study_days || 0,
      createTime: user.created_at ? user.created_at.split('T')[0] + ' ' + user.created_at.split('T')[1]?.substring(0, 8) : ''
    }))

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: users,
        total: count || 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 获取用户详情
export async function getUserDetail(req, res) {
  try {
    const { id } = req.params

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({
      code: 200,
      message: 'success',
      data: {
        id: user.id,
        name: user.nickname || '未命名',
        phone: user.phone || '',
        avatar: user.avatar || '',
        role: user.role || 'viewer',
        status: user.status || 'active',
        studyDays: user.study_days || 0,
        createTime: user.created_at
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 创建用户
export async function createUser(req, res) {
  try {
    const { name, phone, role, status } = req.body

    const { data, error } = await supabase
      .from('users')
      .insert([{
        nickname: name,
        phone,
        role,
        status,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}&backgroundColor=b6e3f4`,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    res.json({ code: 200, message: '创建成功', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 更新用户
export async function updateUser(req, res) {
  try {
    const { id } = req.params
    const { name, phone, role, status } = req.body

    const { data, error } = await supabase
      .from('users')
      .update({
        nickname: name,
        phone,
        role,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ code: 200, message: '更新成功', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 删除用户
export async function deleteUser(req, res) {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ code: 200, message: '删除成功' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 批量删除用户
export async function batchDeleteUsers(req, res) {
  try {
    const { ids } = req.body

    const { error } = await supabase
      .from('users')
      .delete()
      .in('id', ids)

    if (error) throw error

    res.json({ code: 200, message: '批量删除成功' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 切换用户状态
export async function toggleUserStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ code: 200, message: '状态更新成功', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
