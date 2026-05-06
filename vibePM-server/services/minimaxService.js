// MiniMax API 服务 - 文本生成 + 图片生成（优化版）
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env') })

import {
  generateOptimizedImagePrompt,
  generateOptimizedContentPrompt,
  generateQuickReferencePrompt,
  generateInterviewQuestionsPrompt,
  generateProjectTutorialPrompt
} from './promptStrategies.js'

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_TEXT_ENDPOINT = 'https://api.minimax.chat/v1/text/chatcompletion_v2'
const MINIMAX_IMAGE_ENDPOINT = process.env.MINIMAX_IMAGE_ENDPOINT || 'https://api.minimaxi.com/v1/image_generation'

// 性能指标追踪
const metrics = {
  text: { total: 0, success: 0, failed: 0, totalTime: 0 },
  image: { total: 0, success: 0, failed: 0, totalTime: 0 }
}

// 获取性能指标
export function getMetrics() {
  return {
    text: {
      ...metrics.text,
      successRate: metrics.text.total > 0 ? (metrics.text.success / metrics.text.total * 100).toFixed(2) + '%' : '0%',
      avgTime: metrics.text.success > 0 ? Math.round(metrics.text.totalTime / metrics.text.success) : 0
    },
    image: {
      ...metrics.image,
      successRate: metrics.image.total > 0 ? (metrics.image.success / metrics.image.total * 100).toFixed(2) + '%' : '0%',
      avgTime: metrics.image.success > 0 ? Math.round(metrics.image.totalTime / metrics.image.success) : 0
    }
  }
}

// 重置性能指标
export function resetMetrics() {
  metrics.text = { total: 0, success: 0, failed: 0, totalTime: 0 }
  metrics.image = { total: 0, success: 0, failed: 0, totalTime: 0 }
}

// 文本生成 - 使用MiniMax M2.7（优化版）
export async function generateText(prompt, options = {}) {
  const { maxTokens = 4000, temperature = 0.7 } = options

  const startTime = Date.now()
  metrics.text.total++

  console.log('[MiniMax] 开始文本生成...')
  console.log('[MiniMax] API Key:', MINIMAX_API_KEY ? '已配置' : '未配置')

  try {
    const response = await fetch(MINIMAX_TEXT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [
          {
            role: 'system',
            content: '你是一位资深技术专家和优秀的技术内容创作者。你擅长将复杂的技术概念用简单易懂的方式讲解，注重知识的系统性和实用性。你的文章既有深度又通俗易懂，能让读者真正掌握技术原理和实践方法。'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.2
      })
    })

    console.log('[MiniMax] 响应状态:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('[MiniMax] API错误:', response.status, errText)
      metrics.text.failed++
      throw new Error(`MiniMax text API error: ${response.status} - ${errText}`)
    }

    const result = await response.json()
    console.log('[MiniMax] 响应结果:', JSON.stringify(result).substring(0, 200))

    // MiniMax M2.7 可能返回多个位置的响应内容，按优先级尝试获取
    const content = 
      result.choices?.[0]?.message?.content?.trim() ||
      result.choices?.[0]?.message?.reasoning_content?.trim() ||
      result.choices?.[0]?.text?.trim() ||
      result.text?.trim() ||
      result.output?.text?.trim() ||
      ''
    
    if (!content) {
      console.warn('[MiniMax] 警告: 未能从响应中提取到有效内容')
      console.warn('[MiniMax] choices[0]:', JSON.stringify(result.choices?.[0])?.substring(0, 500))
    }
    
    console.log('[MiniMax] 生成内容长度:', content.length)

    const duration = Date.now() - startTime
    metrics.text.success++
    metrics.text.totalTime += duration
    console.log(`[MiniMax] 文本生成成功，耗时: ${duration}ms`)

    return content
  } catch (error) {
    const duration = Date.now() - startTime
    metrics.text.failed++
    metrics.text.totalTime += duration
    console.error('[MiniMax] 文本生成异常:', error.message)
    throw error
  }
}

// 图片生成 - 使用MiniMax T2I（优化版 + 备选方案）
export async function generateImage(prompt, options = {}) {
  const {
    aspect_ratio = '1:1',
    n = 1,
    style = 'flat_design',
    composition = 'centered',
    colorScheme = 'xiaohongshu',
    detail = 'icon_style'
  } = options

  const startTime = Date.now()
  metrics.image.total++

  console.log('[MiniMax] 开始图片生成...')

  try {
    // 如果是主题而不是完整提示词，使用优化策略生成
    let finalPrompt = prompt
    if (!prompt.includes('style:') && !prompt.includes('composition:')) {
      finalPrompt = generateOptimizedImagePrompt(prompt, {
        style,
        composition,
        colorScheme,
        detail,
        aspectRatio: aspect_ratio
      })
    }

    console.log('[MiniMax] 优化后的提示词:', finalPrompt.substring(0, 100) + '...')

    const response = await fetch(MINIMAX_IMAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt: finalPrompt,
        aspect_ratio: aspect_ratio,
        response_format: 'url',
        n: n,
        prompt_optimizer: true,
        quality: 'high',
        style: 'illustration'
      })
    })

    console.log('[MiniMax] 图片响应状态:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('[MiniMax] 图片API错误:', response.status, errText)
      
      // API失败时使用备选图片
      console.log('[MiniMax] 使用备选网络图片...')
      return getFallbackImageUrl(prompt)
    }

    const result = await response.json()
    console.log('[MiniMax] 图片响应:', JSON.stringify(result).substring(0, 300))

    // 检查是否成功
    if (result.base_resp?.status_code !== 0) {
      console.warn('[MiniMax] 图片生成返回错误:', result.base_resp?.status_msg)
      return getFallbackImageUrl(prompt)
    }

    const imageUrl = result.data?.image_urls?.[0] || result.data?.[0]?.url || result.images?.[0]?.url || ''

    if (!imageUrl) {
      console.warn('[MiniMax] 响应中无图片URL，使用备选图片')
      return getFallbackImageUrl(prompt)
    }

    const duration = Date.now() - startTime
    metrics.image.success++
    metrics.image.totalTime += duration
    console.log(`[MiniMax] 图片生成成功，耗时: ${duration}ms`)

    return imageUrl
  } catch (error) {
    const duration = Date.now() - startTime
    metrics.image.failed++
    metrics.image.totalTime += duration
    console.error('[MiniMax] 图片生成异常:', error.message)
    
    // 异常时也返回备选图片
    console.log('[MiniMax] 异常情况使用备选网络图片...')
    return getFallbackImageUrl(prompt)
  }
}

// 备选图片URL生成器（使用Picsum随机图片）
function getFallbackImageUrl(prompt) {
  const seed = prompt ? encodeURIComponent(prompt.substring(0, 30)) : Math.random().toString(36).substring(7)
  const width = 400
  const height = 300
  
  // 根据提示词选择不同的图片主题
  let category = ''
  if (prompt?.toLowerCase().includes('code') || prompt?.includes('编程')) {
    category = 'tech'
  } else if (prompt?.toLowerCase().includes('design') || prompt?.includes('设计')) {
    category = 'design'
  } else if (prompt?.toLowerCase().includes('data') || prompt?.includes('数据')) {
    category = 'abstract'
  }
  
  const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`
  console.log(`[MiniMax] 备选图片URL: ${imageUrl}`)
  
  return imageUrl
}

// 生成深度技术文章
export async function generateDeepContent(topic, options = {}) {
  const {
    style = 'friendly',
    length = 'medium',
    includeCode = true,
    difficulty = 'beginner'
  } = options

  const startTime = Date.now()
  console.log(`[MiniMax] 开始生成深度内容: ${topic}`)

  try {
    // 使用深度提示词生成内容
    const prompt = generateOptimizedContentPrompt(topic, {
      style,
      length,
      includeCode,
      difficulty
    })

    const content = await generateText(prompt, {
      maxTokens: 4000,
      temperature: 0.7
    })

    if (!content || content.length < 500) {
      throw new Error('内容生成失败或太短')
    }

    // 提取标题
    const titleMatch = content.match(/^#\s*(.+)/m)
    const title = titleMatch ? titleMatch[1].trim() : `${topic}深度解析`

    const duration = Date.now() - startTime
    console.log(`[MiniMax] 深度内容生成成功 (${duration}ms): ${title.substring(0, 50)}...`)
    console.log(`[MiniMax] 内容长度: ${content.length}字`)

    return {
      success: true,
      title,
      content,
      topic,
      duration,
      type: 'deep_article'
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[MiniMax] 深度内容生成失败:`, error.message)
    return {
      success: false,
      error: error.message,
      topic,
      duration
    }
  }
}

// 生成快速参考卡片
export async function generateQuickReference(topic) {
  const startTime = Date.now()
  console.log(`[MiniMax] 开始生成速查卡: ${topic}`)

  try {
    const prompt = generateQuickReferencePrompt(topic)
    const content = await generateText(prompt, {
      maxTokens: 1500,
      temperature: 0.5
    })

    const duration = Date.now() - startTime
    console.log(`[MiniMax] 速查卡生成成功 (${duration}ms)`)

    return {
      success: true,
      title: `${topic} 速查卡`,
      content,
      topic,
      duration,
      type: 'quick_reference'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      topic,
      duration: Date.now() - startTime
    }
  }
}

// 生成面试题
export async function generateInterviewQuestions(topic) {
  const startTime = Date.now()
  console.log(`[MiniMax] 开始生成面试题: ${topic}`)

  try {
    const prompt = generateInterviewQuestionsPrompt(topic)
    const content = await generateText(prompt, {
      maxTokens: 2000,
      temperature: 0.6
    })

    const duration = Date.now() - startTime
    console.log(`[MiniMax] 面试题生成成功 (${duration}ms)`)

    return {
      success: true,
      title: `${topic} 面试题精选`,
      content,
      topic,
      duration,
      type: 'interview'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      topic,
      duration: Date.now() - startTime
    }
  }
}

// 生成实战项目教程
export async function generateProjectTutorial(topic) {
  const startTime = Date.now()
  console.log(`[MiniMax] 开始生成项目教程: ${topic}`)

  try {
    const prompt = generateProjectTutorialPrompt(topic)
    const content = await generateText(prompt, {
      maxTokens: 3000,
      temperature: 0.7
    })

    const duration = Date.now() - startTime
    console.log(`[MiniMax] 项目教程生成成功 (${duration}ms)`)

    return {
      success: true,
      title: `${topic} 实战项目`,
      content,
      topic,
      duration,
      type: 'project'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      topic,
      duration: Date.now() - startTime
    }
  }
}

// 批量生成深度内容
export async function batchGenerateContent(topics, options = {}) {
  const results = []
  const {
    style = 'friendly',
    length = 'medium',
    contentType = 'deep_article' // deep_article, quick_reference, interview, project
  } = options

  console.log(`[MiniMax] 开始批量生成 ${topics.length} 篇内容 (类型: ${contentType})...`)

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]

    try {
      let result
      switch (contentType) {
        case 'quick_reference':
          result = await generateQuickReference(topic)
          break
        case 'interview':
          result = await generateInterviewQuestions(topic)
          break
        case 'project':
          result = await generateProjectTutorial(topic)
          break
        case 'deep_article':
        default:
          result = await generateDeepContent(topic, { style, length })
          break
      }

      results.push(result)

      if (result.success) {
        console.log(`[MiniMax] [${i + 1}/${topics.length}] ✅ ${result.title?.substring(0, 50)}... (${result.duration}ms)`)
      } else {
        console.log(`[MiniMax] [${i + 1}/${topics.length}] ❌ ${topic}: ${result.error}`)
      }
    } catch (error) {
      console.error(`[MiniMax] [${i + 1}/${topics.length}] ❌ ${topic}: ${error.message}`)
      results.push({
        success: false,
        error: error.message,
        topic
      })
    }

    // 避免请求过快
    if (i < topics.length - 1) {
      await sleep(2000)
    }
  }

  // 输出统计
  const successCount = results.filter(r => r.success).length
  const failedCount = results.filter(r => !r.success).length
  const avgTime = results.filter(r => r.success).reduce((sum, r) => sum + (r.duration || 0), 0) / successCount || 0

  console.log(`[MiniMax] 批量生成完成: 成功 ${successCount}/${topics.length}, 失败 ${failedCount}, 平均耗时 ${Math.round(avgTime)}ms/篇`)

  return results
}

// 批量生成图片（优化版）
export async function batchGenerateImages(topics, options = {}) {
  const results = []
  const {
    style = 'flat_design',
    composition = 'centered',
    colorScheme = 'xiaohongshu',
    detail = 'icon_style',
    aspect_ratio = '1:1'
  } = options

  console.log(`[MiniMax] 开始批量生成 ${topics.length} 张图片...`)

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    const itemStart = Date.now()

    try {
      // 使用优化的提示词
      const prompt = generateOptimizedImagePrompt(topic, {
        style,
        composition,
        colorScheme,
        detail,
        aspectRatio: aspect_ratio
      })

      const imageUrl = await generateImage(prompt, { aspect_ratio })

      const itemTime = Date.now() - itemStart
      console.log(`[MiniMax] [${i + 1}/${topics.length}] 图片成功 (${itemTime}ms): ${topic}`)

      results.push({
        success: true,
        url: imageUrl,
        topic,
        index: i,
        duration: itemTime
      })
    } catch (error) {
      const itemTime = Date.now() - itemStart
      console.error(`[MiniMax] [${i + 1}/${topics.length}] 图片异常: ${topic}`, error.message)
      results.push({
        success: false,
        error: error.message,
        topic,
        index: i,
        duration: itemTime
      })
    }

    // 避免请求过快
    if (i < topics.length - 1) {
      await sleep(3000)
    }
  }

  // 输出统计
  const successCount = results.filter(r => r.success).length
  const failedCount = results.filter(r => !r.success).length
  const avgTime = results.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / successCount || 0

  console.log(`[MiniMax] 批量图片生成完成: 成功 ${successCount}/${topics.length}, 失败 ${failedCount}, 平均耗时 ${Math.round(avgTime)}ms/张`)

  return results
}

// 生成内容并配图（完整流程）
export async function generateContentWithImage(topic, options = {}) {
  const startTime = Date.now()

  try {
    // 1. 生成深度内容
    console.log(`[MiniMax] 开始为 "${topic}" 生成深度内容和图片...`)

    const contentResult = await generateDeepContent(topic, {
      style: options.contentStyle || 'friendly',
      length: options.contentLength || 'medium',
      difficulty: options.difficulty || 'beginner'
    })

    if (!contentResult.success) {
      throw new Error(contentResult.error || '内容生成失败')
    }

    // 2. 生成配图
    const imagePrompt = generateOptimizedImagePrompt(topic, {
      style: options.imageStyle || 'flat_design',
      composition: options.composition || 'centered',
      colorScheme: options.colorScheme || 'xiaohongshu',
      detail: options.detail || 'icon_style'
    })

    const imageUrl = await generateImage(imagePrompt, {
      aspect_ratio: options.aspectRatio || '1:1'
    })

    const totalTime = Date.now() - startTime
    console.log(`[MiniMax] "${topic}" 深度内容和图片生成完成，总耗时: ${totalTime}ms`)

    return {
      success: true,
      title: contentResult.title,
      content: contentResult.content,
      imageUrl,
      topic,
      duration: totalTime,
      type: 'deep_article'
    }
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[MiniMax] "${topic}" 生成失败:`, error.message)
    return {
      success: false,
      error: error.message,
      topic,
      duration: totalTime
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  generateText,
  generateImage,
  generateDeepContent,
  generateQuickReference,
  generateInterviewQuestions,
  generateProjectTutorial,
  batchGenerateContent,
  batchGenerateImages,
  generateContentWithImage,
  getMetrics,
  resetMetrics
}
