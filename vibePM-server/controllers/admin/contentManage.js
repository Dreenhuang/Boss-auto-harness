import { supabase } from '../../server.js'
import { addLog } from './operationLog.js'

// 获取内容列表
export async function getContentList(req, res) {
  try {
    const { page = 1, pageSize = 10, keyword = '', status = '' } = req.query
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })

    if (keyword) {
      query = query.ilike('title', `%${keyword}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw error

    const contents = data.map(post => ({
      id: post.id,
      title: post.title,
      author: post.author || '匿名',
      category: post.category || '未分类',
      cover: post.image || 'https://picsum.photos/seed/default/100/80',
      status: post.status || 'published',
      views: post.views || 0,
      likes: post.likes || 0,
      createTime: post.created_at ? post.created_at.split('T')[0] + ' ' + post.created_at.split('T')[1]?.substring(0, 8) : ''
    }))

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: contents,
        total: count || 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 获取内容详情
export async function getContentDetail(req, res) {
  try {
    const { id } = req.params

    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({
      code: 200,
      message: 'success',
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author || '匿名',
        category: post.category || '未分类',
        status: post.status || 'published',
        views: post.views || 0,
        likes: post.likes || 0,
        createTime: post.created_at
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 创建内容
export async function createContent(req, res) {
  try {
    const { title, content, author, category } = req.body

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title,
        content,
        author,
        category,
        status: 'published',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    addLog({
      action: 'create',
      module: 'content',
      description: `创建了内容"${title}"`,
      operator: req.user?.name || 'admin',
      details: { contentId: data.id }
    })

    res.json({ code: 200, message: '创建成功', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 更新内容
export async function updateContent(req, res) {
  try {
    const { id } = req.params
    const { title, content, author, category } = req.body

    const { data, error } = await supabase
      .from('posts')
      .update({ title, content, author, category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    addLog({
      action: 'update',
      module: 'content',
      description: `更新了内容"${title}"`,
      operator: req.user?.name || 'admin',
      details: { contentId: id }
    })

    res.json({ code: 200, message: '更新成功', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 删除内容
export async function deleteContent(req, res) {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    addLog({
      action: 'delete',
      module: 'content',
      description: `删除了内容 ID:${id}`,
      operator: req.user?.name || 'admin',
      details: { contentId: id }
    })

    res.json({ code: 200, message: '删除成功' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 审核内容
export async function auditContent(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    const { data, error } = await supabase
      .from('posts')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    addLog({
      action: 'audit',
      module: 'content',
      description: `审核内容"${data.title}"为${status === 'published' ? '通过' : '驳回'}`,
      operator: req.user?.name || 'admin',
      details: { contentId: id, status }
    })

    res.json({ code: 200, message: '审核完成', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 批量审核
export async function batchAuditContent(req, res) {
  try {
    const { ids, status } = req.body

    const { error } = await supabase
      .from('posts')
      .update({ status })
      .in('id', ids)

    if (error) throw error

    addLog({
      action: 'batch_audit',
      module: 'content',
      description: `批量审核 ${ids.length} 条内容为${status === 'published' ? '通过' : '驳回'}`,
      operator: req.user?.name || 'admin',
      details: { contentIds: ids, status }
    })

    res.json({ code: 200, message: '批量审核完成' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
