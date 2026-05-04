// 内存中的提示词存储（与operationLog保持一致）
let promptTemplates = [
  {
    id: 1,
    key: 'image_generation',
    name: '图片生成提示词',
    description: '用于MiniMax AI图片生成的默认提示词模板',
    content: '生成一张高质量的技术概念图，主题：{techName}。要求：现代扁平化设计风格，配色以红色(#FF2442)和白色为主，简洁明了，适合作为学习卡片的封面图。不要包含任何文字。',
    category: 'ai',
    variables: ['techName'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    key: 'content_summary',
    name: '内容摘要生成',
    description: '自动生成学习卡片摘要',
    content: '请为以下技术内容生成一段简洁的摘要（100字以内），适合小白用户理解：\n\n{content}\n\n要求：用通俗易懂的语言，突出核心概念。',
    category: 'ai',
    variables: ['content'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    key: 'learning_path_guide',
    name: '学习路径引导',
    description: '为用户生成个性化学习建议',
    content: '用户当前水平：{level}\n学习目标：{goals}\n\n请生成一段个性化的学习路径引导语，鼓励用户坚持学习。',
    category: 'ai',
    variables: ['level', 'goals'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    key: 'welcome_message',
    name: '欢迎消息',
    description: '新用户注册后的欢迎消息',
    content: '欢迎加入Vibe PM！\n\n我们为你准备了{pathCount}条精选学习路径，涵盖产品经理、前端开发、AI工具等热门领域。\n\n点击"开始学习"，开启你的技术成长之旅！',
    category: 'system',
    variables: ['pathCount'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    key: 'daily_tip',
    name: '每日学习提示',
    description: '每日推送的学习小贴士',
    content: '今日学习小贴士：\n\n{tip}\n\n坚持学习，每天进步一点点！',
    category: 'system',
    variables: ['tip'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

let promptIdCounter = 6

// 获取提示词列表
export async function getPromptList(req, res) {
  try {
    const { category, keyword } = req.query
    let filtered = [...promptTemplates]

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category)
    }

    if (keyword) {
      const lower = keyword.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.key.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      )
    }

    res.json({
      code: 200,
      message: 'success',
      data: filtered
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 获取提示词详情
export async function getPromptDetail(req, res) {
  try {
    const { id } = req.params
    const prompt = promptTemplates.find(p => p.id === parseInt(id))

    if (!prompt) {
      return res.status(404).json({ code: 404, message: '提示词不存在', data: null })
    }

    res.json({ code: 200, message: 'success', data: prompt })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 创建提示词
export async function createPrompt(req, res) {
  try {
    const { key, name, description, content, category, variables } = req.body

    // 检查key是否已存在
    const existing = promptTemplates.find(p => p.key === key)
    if (existing) {
      return res.status(400).json({ code: 400, message: '提示词key已存在', data: null })
    }

    const prompt = {
      id: promptIdCounter++,
      key,
      name,
      description: description || '',
      content,
      category: category || 'general',
      variables: variables || [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    promptTemplates.push(prompt)

    res.json({ code: 200, message: '创建成功', data: prompt })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 更新提示词
export async function updatePrompt(req, res) {
  try {
    const { id } = req.params
    const { name, description, content, category, variables, is_active } = req.body

    const index = promptTemplates.findIndex(p => p.id === parseInt(id))
    if (index === -1) {
      return res.status(404).json({ code: 404, message: '提示词不存在', data: null })
    }

    promptTemplates[index] = {
      ...promptTemplates[index],
      name: name || promptTemplates[index].name,
      description: description !== undefined ? description : promptTemplates[index].description,
      content: content || promptTemplates[index].content,
      category: category || promptTemplates[index].category,
      variables: variables !== undefined ? variables : promptTemplates[index].variables,
      is_active: is_active !== undefined ? is_active : promptTemplates[index].is_active,
      updated_at: new Date().toISOString()
    }

    res.json({ code: 200, message: '更新成功', data: promptTemplates[index] })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 删除提示词
export async function deletePrompt(req, res) {
  try {
    const { id } = req.params
    const index = promptTemplates.findIndex(p => p.id === parseInt(id))

    if (index === -1) {
      return res.status(404).json({ code: 404, message: '提示词不存在', data: null })
    }

    promptTemplates.splice(index, 1)

    res.json({ code: 200, message: '删除成功' })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 获取提示词分类列表
export async function getPromptCategories(req, res) {
  try {
    const categories = [...new Set(promptTemplates.map(p => p.category))]
    res.json({ code: 200, message: 'success', data: categories })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 根据key获取提示词内容（前端使用）
export async function getPromptByKey(req, res) {
  try {
    const { key } = req.params
    const prompt = promptTemplates.find(p => p.key === key && p.is_active)

    if (!prompt) {
      return res.status(404).json({ code: 404, message: '提示词不存在', data: null })
    }

    res.json({ code: 200, message: 'success', data: prompt })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
