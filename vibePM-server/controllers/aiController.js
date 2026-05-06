import { supabase } from '../server.js'
import {
  generateOptimizedImagePrompt
} from '../services/promptStrategies.js'
import {
  generateText,
  generateImage as minimaxGenerateImage,
  generateDeepContent,
  generateQuickReference,
  generateInterviewQuestions,
  generateProjectTutorial,
  batchGenerateContent,
  batchGenerateImages,
  generateContentWithImage,
  getMetrics,
  resetMetrics
} from '../services/minimaxService.js'

const DAILY_QUOTA = 50

// 生成单张图片（优化版）
export async function generateImage(req, res) {
  try {
    const { prompt, techName, cardId, style = 'flat_design', composition = 'centered', colorScheme = 'xiaohongshu' } = req.body

    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('image_quota')
      .select('count')
      .eq('date', today)
      .single()

    const currentUsage = usage?.count || 0

    if (currentUsage >= DAILY_QUOTA) {
      return res.status(429).json({
        code: 429,
        message: `Daily quota exceeded (${currentUsage}/${DAILY_QUOTA})`,
        data: null
      })
    }

    // 使用优化后的提示词
    let finalPrompt = prompt
    if (techName && !prompt) {
      finalPrompt = generateOptimizedImagePrompt(techName, {
        style,
        composition,
        colorScheme,
        detail: 'icon_style'
      })
    }

    const imageUrl = await minimaxGenerateImage(finalPrompt, {
      aspect_ratio: '1:1',
      style,
      composition,
      colorScheme
    })

    if (cardId) {
      await supabase
        .from('posts')
        .update({ image: imageUrl })
        .eq('id', cardId)
    }

    await supabase
      .from('generated_images')
      .insert({
        url: imageUrl,
        prompt: finalPrompt,
        tags: [techName || 'general'],
        tech_name: techName || '',
        card_id: cardId || null
      })

    await supabase
      .from('image_quota')
      .upsert({
        date: today,
        count: currentUsage + 1
      }, { onConflict: 'date' })

    res.json({
      code: 200,
      message: 'success',
      data: {
        imageUrl,
        prompt: finalPrompt,
        remainingQuota: DAILY_QUOTA - currentUsage - 1
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 生成深度技术文章
export async function generateDeepArticle(req, res) {
  try {
    const { topic, options = {} } = req.body

    if (!topic) {
      return res.status(400).json({
        code: 400,
        message: 'Topic is required',
        data: null
      })
    }

    console.log(`[API] 收到生成深度文章请求: ${topic}`)

    const result = await generateDeepContent(topic, {
      style: options.style || 'friendly',
      length: options.length || 'medium',
      difficulty: options.difficulty || 'beginner'
    })

    if (result.success) {
      // 保存到数据库
      const { error } = await supabase.from('posts').insert([{
        title: result.title,
        content: result.content,
        author: 'AI助手',
        category: options.category || '技术',
        tags: [topic, 'AI生成', '深度文章'],
        type: options.type || 'article',
        height: '220px',
        likes: 0,
        image: ''
      }])

      if (error) {
        console.error('[API] 保存到数据库失败:', error.message)
      }
    }

    res.json({
      code: result.success ? 200 : 500,
      message: result.success ? 'success' : result.error,
      data: result
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 生成速查卡
export async function generateQuickReferenceCard(req, res) {
  try {
    const { topic } = req.body

    if (!topic) {
      return res.status(400).json({
        code: 400,
        message: 'Topic is required',
        data: null
      })
    }

    console.log(`[API] 收到生成速查卡请求: ${topic}`)

    const result = await generateQuickReference(topic)

    if (result.success) {
      await supabase.from('posts').insert([{
        title: result.title,
        content: result.content,
        author: 'AI助手',
        category: '速查卡',
        tags: [topic, 'AI生成', '速查卡'],
        type: 'quick_reference',
        height: '220px',
        likes: 0,
        image: ''
      }])
    }

    res.json({
      code: result.success ? 200 : 500,
      message: result.success ? 'success' : result.error,
      data: result
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 生成面试题
export async function generateInterviewQuestionsController(req, res) {
  try {
    const { topic } = req.body

    if (!topic) {
      return res.status(400).json({
        code: 400,
        message: 'Topic is required',
        data: null
      })
    }

    console.log(`[API] 收到生成面试题请求: ${topic}`)

    const result = await generateInterviewQuestions(topic)

    if (result.success) {
      await supabase.from('posts').insert([{
        title: result.title,
        content: result.content,
        author: 'AI助手',
        category: '面试题',
        tags: [topic, 'AI生成', '面试题'],
        type: 'interview',
        height: '220px',
        likes: 0,
        image: ''
      }])
    }

    res.json({
      code: result.success ? 200 : 500,
      message: result.success ? 'success' : result.error,
      data: result
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 生成实战项目
export async function generateProjectTutorialController(req, res) {
  try {
    const { topic } = req.body

    if (!topic) {
      return res.status(400).json({
        code: 400,
        message: 'Topic is required',
        data: null
      })
    }

    console.log(`[API] 收到生成项目教程请求: ${topic}`)

    const result = await generateProjectTutorial(topic)

    if (result.success) {
      await supabase.from('posts').insert([{
        title: result.title,
        content: result.content,
        author: 'AI助手',
        category: '实战项目',
        tags: [topic, 'AI生成', '实战项目'],
        type: 'project',
        height: '220px',
        likes: 0,
        image: ''
      }])
    }

    res.json({
      code: result.success ? 200 : 500,
      message: result.success ? 'success' : result.error,
      data: result
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 批量生成内容
export async function batchGenerateContentController(req, res) {
  try {
    const { topics, options = {} } = req.body

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        code: 400,
        message: 'Topics array is required',
        data: null
      })
    }

    console.log(`[API] 收到批量生成内容请求: ${topics.length} 个主题 (类型: ${options.contentType || 'deep_article'})`)

    const results = await batchGenerateContent(topics, options)

    // 保存成功的内容到数据库
    const successfulResults = results.filter(r => r.success)
    if (successfulResults.length > 0) {
      const postsToInsert = successfulResults.map(result => ({
        title: result.title,
        content: result.content,
        author: 'AI助手',
        category: getCategoryByType(result.type),
        tags: [result.topic, 'AI生成', '批量生成'],
        type: result.type || 'article',
        height: '220px',
        likes: 0,
        image: ''
      }))

      const { error } = await supabase.from('posts').insert(postsToInsert)
      if (error) {
        console.error('[API] 保存到数据库失败:', error.message)
      }
    }

    res.json({
      code: 200,
      message: 'success',
      data: {
        results,
        summary: {
          total: topics.length,
          success: successfulResults.length,
          failed: results.filter(r => !r.success).length,
          avgTime: successfulResults.length > 0
            ? Math.round(successfulResults.reduce((sum, r) => sum + (r.duration || 0), 0) / successfulResults.length)
            : 0
        }
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 根据内容类型获取分类
function getCategoryByType(type) {
  const categoryMap = {
    'deep_article': '技术',
    'quick_reference': '速查卡',
    'interview': '面试题',
    'project': '实战项目'
  }
  return categoryMap[type] || '技术'
}

// 批量生成图片
export async function batchGenerateImagesController(req, res) {
  try {
    const { topics, options = {} } = req.body

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        code: 400,
        message: 'Topics array is required',
        data: null
      })
    }

    // 检查配额
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('image_quota')
      .select('count')
      .eq('date', today)
      .single()

    const currentUsage = usage?.count || 0

    if (currentUsage + topics.length > DAILY_QUOTA) {
      return res.status(429).json({
        code: 429,
        message: `Quota exceeded. Current: ${currentUsage}, Requested: ${topics.length}, Limit: ${DAILY_QUOTA}`,
        data: null
      })
    }

    console.log(`[API] 收到批量生成图片请求: ${topics.length} 个主题`)

    const results = await batchGenerateImages(topics, options)

    // 保存生成的图片
    const successfulResults = results.filter(r => r.success)
    if (successfulResults.length > 0) {
      const imagesToInsert = successfulResults.map(result => ({
        url: result.url,
        prompt: result.topic,
        tags: [result.topic],
        tech_name: result.topic
      }))

      await supabase.from('generated_images').insert(imagesToInsert)

      // 更新配额
      await supabase
        .from('image_quota')
        .upsert({
          date: today,
          count: currentUsage + successfulResults.length
        }, { onConflict: 'date' })
    }

    res.json({
      code: 200,
      message: 'success',
      data: {
        results,
        summary: {
          total: topics.length,
          success: successfulResults.length,
          failed: results.filter(r => !r.success).length,
          remainingQuota: DAILY_QUOTA - currentUsage - successfulResults.length
        }
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 生成内容并配图
export async function generateContentWithImageController(req, res) {
  try {
    const { topic, options = {} } = req.body

    if (!topic) {
      return res.status(400).json({
        code: 400,
        message: 'Topic is required',
        data: null
      })
    }

    console.log(`[API] 收到生成内容并配图请求: ${topic}`)

    const result = await generateContentWithImage(topic, options)

    if (result.success) {
      // 保存到数据库
      const { error } = await supabase.from('posts').insert([{
        title: result.title,
        content: result.content,
        author: 'AI助手',
        category: options.category || '技术',
        tags: [topic, 'AI生成', '配图'],
        type: options.type || 'article',
        height: '220px',
        likes: 0,
        image: result.imageUrl
      }])

      if (error) {
        console.error('[API] 保存到数据库失败:', error.message)
      }
    }

    res.json({
      code: result.success ? 200 : 500,
      message: result.success ? 'success' : result.error,
      data: result
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 获取性能指标
export async function getMetricsController(req, res) {
  try {
    const metrics = getMetrics()
    res.json({
      code: 200,
      message: 'success',
      data: metrics
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 重置性能指标
export async function resetMetricsController(req, res) {
  try {
    resetMetrics()
    res.json({
      code: 200,
      message: 'Metrics reset successfully',
      data: null
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 获取配额状态
export async function getQuotaStatus(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('image_quota')
      .select('count')
      .eq('date', today)
      .single()

    const currentUsage = usage?.count || 0

    res.json({
      code: 200,
      message: 'success',
      data: {
        dailyQuota: DAILY_QUOTA,
        currentUsage,
        remaining: DAILY_QUOTA - currentUsage,
        date: today
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 匹配图片到卡片
export async function matchImageToCard(req, res) {
  try {
    const { cardId, cardTags } = req.body

    const { data: images } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })

    let bestMatch = null
    let bestScore = 0

    for (const img of (images || [])) {
      const score = calculateSimilarity(cardTags || [], img.tags || [])
      if (score > bestScore && score > 0.3) {
        bestScore = score
        bestMatch = img
      }
    }

    if (bestMatch) {
      res.json({
        code: 200,
        message: 'success',
        data: {
          imageUrl: bestMatch.url,
          score: bestScore,
          matched: true
        }
      })
    } else {
      res.json({
        code: 200,
        message: 'success',
        data: { imageUrl: '', score: 0, matched: false }
      })
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

function calculateSimilarity(tags1, tags2) {
  if (!tags1.length || !tags2.length) return 0
  const set1 = new Set(tags1.map(t => t.toLowerCase()))
  const set2 = new Set(tags2.map(t => t.toLowerCase()))
  const intersection = [...set1].filter(x => set2.has(x))
  return intersection.length / Math.max(set1.size, set2.size)
}
