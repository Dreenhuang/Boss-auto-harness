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
  },
  {
    id: 6,
    key: 'tech_article_gen',
    name: '技术文章生成',
    description: 'AI自动生成技术学习文章',
    content: '请生成一篇关于{techName}的技术入门文章，适合小白用户阅读。\n\n要求：\n1. 文章结构清晰，包含：什么是{techName}、为什么学习它、核心概念、实际应用场景\n2. 使用通俗易懂的比喻解释技术概念\n3. 文章长度800-1200字\n4. 在文章末尾添加3个思考问题\n5. 语言风格轻松活泼，像朋友聊天一样',
    category: 'ai',
    variables: ['techName'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    key: 'framework_comparison',
    name: '框架对比文章生成',
    description: '自动生成技术框架对比文章',
    content: '请生成一篇对比文章，对比{frameworkA}和{frameworkB}。\n\n要求：\n1. 从学习曲线、生态系统、性能、社区活跃度等维度对比\n2. 给出适合不同场景的选择建议\n3. 包含简单的代码示例或伪代码\n4. 文章长度600-1000字\n5. 结尾给出"一句话建议"',
    category: 'ai',
    variables: ['frameworkA', 'frameworkB'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    key: 'learning_roadmap',
    name: '学习路线图生成',
    description: '生成结构化学习路径',
    content: '请为{skillName}生成一份学习路线图。\n\n要求：\n1. 分为初级、中级、高级三个阶段\n2. 每个阶段列出3-5个具体的学习目标\n3. 推荐每个阶段的学习资源类型（视频/文档/项目）\n4. 预估每个阶段的学习时间\n5. 给出阶段之间的衔接建议',
    category: 'ai',
    variables: ['skillName'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 9,
    key: 'case_study_gen',
    name: '实战案例生成',
    description: '生成技术实战案例分析',
    content: '请生成一个关于{topic}的实战案例。\n\n要求：\n1. 案例背景：一个真实的业务场景\n2. 遇到的问题和挑战\n3. 解决方案的思路和步骤\n4. 最终效果和收益\n5. 从中学到的关键经验\n6. 文章长度800-1200字',
    category: 'ai',
    variables: ['topic'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 10,
    key: 'tool_review_gen',
    name: '工具评测生成',
    description: '生成技术工具评测文章',
    content: '请生成一篇关于{toolName}的工具评测文章。\n\n要求：\n1. 工具简介：是什么、由谁开发\n2. 核心功能介绍\n3. 优缺点分析\n4. 适用人群和场景\n5. 同类工具对比\n6. 上手难度评分（1-5星）\n7. 文章长度600-1000字',
    category: 'ai',
    variables: ['toolName'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 11,
    key: 'interview_prep',
    name: '面试题生成',
    description: '生成技术面试题和答案',
    content: '请生成5道关于{topic}的面试题及参考答案。\n\n要求：\n1. 题目难度分布：2道简单、2道中等、1道困难\n2. 每道题包含：题目、考察点、参考答案、延伸思考\n3. 答案要通俗易懂，适合小白理解\n4. 语言简洁明了',
    category: 'ai',
    variables: ['topic'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 12,
    key: 'push_notification',
    name: '推送通知文案',
    description: '生成APP推送通知文案',
    content: '请生成一条APP推送通知文案。\n\n场景：{scene}\n\n要求：\n1. 标题不超过20字，吸引眼球\n2. 正文不超过50字\n3. 包含行动号召（如"点击查看"）\n4. 语气亲切，像朋友推荐',
    category: 'system',
    variables: ['scene'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

let promptIdCounter = 13

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
