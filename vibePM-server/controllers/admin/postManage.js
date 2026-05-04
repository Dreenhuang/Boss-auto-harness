import { supabase } from '../../server.js'
import { addLog } from './operationLog.js'

// 获取内容列表（支持状态筛选）
export async function getAdminPosts(req, res) {
  try {
    const { keyword, status, source, page = 1, pageSize = 10 } = req.query
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (status) query = query.eq('status', status)
    if (source) query = query.eq('source', source)
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,author.ilike.%${keyword}%`)
    }

    const { data, count, error } = await query
    if (error) throw error

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: data || [],
        total: count || 0,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 创建内容
export async function createPost(req, res) {
  try {
    const { title, content, author, category, tags, image, type, status, scheduled_at, prompt_key } = req.body

    const postData = {
      title,
      content,
      author: author || '管理员',
      category,
      tags: tags || [],
      image,
      type: type || 'recommend',
      status: status || 'published',
      source: 'manual',
      height: '220px',
      likes: 0,
      views: 0,
      ai_generated: false
    }

    if (scheduled_at) {
      postData.status = 'approved'
      postData.scheduled_at = scheduled_at
    }

    if (prompt_key) {
      postData.prompt_key = prompt_key
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single()

    if (error) throw error

    // 记录操作日志
    addLog({
      action: 'create',
      module: 'content',
      description: `创建内容: ${title}`,
      operator: req.user?.username || 'admin',
      details: { postId: data.id, title }
    })

    res.json({ code: 200, message: '创建成功', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 更新内容
export async function updatePost(req, res) {
  try {
    const { id } = req.params
    const updateData = req.body
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    addLog({
      action: 'update',
      module: 'content',
      description: `更新内容: ${data.title}`,
      operator: req.user?.username || 'admin',
      details: { postId: id }
    })

    res.json({ code: 200, message: '更新成功', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 删除内容
export async function deletePost(req, res) {
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
      description: `删除内容 ID: ${id}`,
      operator: req.user?.username || 'admin'
    })

    res.json({ code: 200, message: '删除成功' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 审核内容
export async function auditPost(req, res) {
  try {
    const { id } = req.params
    const { status, reason } = req.body

    const updateData = {
      status,
      reviewed_at: new Date().toISOString(),
      reject_reason: status === 'rejected' ? reason : null
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    addLog({
      action: 'audit',
      module: 'content',
      description: `审核内容 "${data.title}" -> ${status}`,
      operator: req.user?.username || 'admin',
      details: { postId: id, status, reason }
    })

    res.json({ code: 200, message: '审核完成', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 批量审核
export async function batchAuditPosts(req, res) {
  try {
    const { ids, status } = req.body

    const { data, error } = await supabase
      .from('posts')
      .update({
        status,
        reviewed_at: new Date().toISOString()
      })
      .in('id', ids)
      .select()

    if (error) throw error

    addLog({
      action: 'audit',
      module: 'content',
      description: `批量审核 ${ids.length} 条内容 -> ${status}`,
      operator: req.user?.username || 'admin',
      details: { ids, status }
    })

    res.json({ code: 200, message: `已${status === 'published' ? '通过' : '驳回'} ${ids.length} 条内容`, data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 定时发布
export async function schedulePost(req, res) {
  try {
    const { id } = req.params
    const { scheduled_at } = req.body

    const { data, error } = await supabase
      .from('posts')
      .update({
        status: 'approved',
        scheduled_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ code: 200, message: '定时发布已设置', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// AI批量生成内容
export async function aiGeneratePosts(req, res) {
  try {
    const { prompt_key, count = 5, category, type } = req.body

    // 获取提示词模板
    const { getPromptByKey: getPromptFromMemory } = await import('./promptManage.js')
    const mockReq = { params: { key: prompt_key } }
    const mockRes = {
      json: (d) => d,
      status: () => ({ json: (d) => d })
    }

    // 这里简化处理，直接生成模拟数据
    const generatedPosts = []
    const techNames = ['React', 'Vue', 'Docker', 'Kubernetes', 'TypeScript', 'Node.js', 'Python', 'AI', 'API', '数据库']
    const categories = ['基础概念', '技术选型', '学习路径', '框架对比', '实战方案']

    for (let i = 0; i < Math.min(count, 20); i++) {
      const tech = techNames[Math.floor(Math.random() * techNames.length)]
      generatedPosts.push({
        id: `ai_${Date.now()}_${i}`,
        title: `${tech} 入门指南：从零到实战`,
        content: `# ${tech} 入门指南\n\n## 什么是${tech}？\n\n${tech} 是现代软件开发中非常重要的技术...\n\n## 核心概念\n\n1. 基础语法\n2. 常用工具\n3. 最佳实践\n\n> 学习${tech}不需要太多前置知识，坚持练习即可掌握。`,
        author: 'AI助手',
        category: category || categories[Math.floor(Math.random() * categories.length)],
        tags: [tech, '入门', '教程'],
        type: type || 'recommend',
        status: 'draft',
        source: 'ai',
        ai_generated: true,
        prompt_key,
        height: '220px',
        likes: 0,
        views: 0,
        created_at: new Date().toISOString()
      })
    }

    // 保存到数据库
    const { data, error } = await supabase
      .from('posts')
      .insert(generatedPosts)
      .select()

    if (error) throw error

    addLog({
      action: 'create',
      module: 'content',
      description: `AI批量生成 ${generatedPosts.length} 条内容`,
      operator: req.user?.username || 'admin',
      details: { prompt_key, count: generatedPosts.length }
    })

    res.json({ code: 200, message: `成功生成 ${generatedPosts.length} 条内容`, data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
