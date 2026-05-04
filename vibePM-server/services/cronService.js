import cron from 'node-cron'
import { supabase } from '../server.js'
import minimaxService from './minimaxService.js'

// 技术主题池
const TECH_TOPICS = [
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java',
  'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub Actions',
  'Node.js', 'Express', 'NestJS', 'Fastify',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
  'AWS', 'Azure', 'Google Cloud', '阿里云', '腾讯云',
  'GraphQL', 'REST API', 'gRPC', 'WebSocket',
  'Tailwind CSS', 'Sass', 'Less', 'CSS Grid', 'Flexbox',
  'Webpack', 'Vite', 'Rollup', 'esbuild',
  'Jest', 'Cypress', 'Playwright', 'Selenium',
  'Figma', 'Sketch', 'Adobe XD', 'Axure',
  '产品经理', '需求分析', '用户研究', '数据分析', '项目管理',
  'AI', 'ChatGPT', 'Midjourney', 'Stable Diffusion', 'LLM',
  '机器学习', '深度学习', '神经网络', '计算机视觉',
  '微服务', 'Serverless', '边缘计算', '区块链'
]

const CATEGORIES = ['基础概念', '技术选型', '学习路径', '框架对比', '实战方案']
const TYPES = ['recommend', 'practice', 'tech', 'ai', 'guide']

// 图片生成提示词模板
const IMAGE_PROMPT_TEMPLATE = '生成一张高质量的技术概念图，主题：{topic}。要求：现代扁平化设计风格，配色以红色(#FF2442)和白色为主，简洁明了，适合作为学习卡片的封面图。不要包含任何文字。'

// 内容生成提示词模板
const CONTENT_PROMPT_TEMPLATE = `请生成一篇关于{topic}的技术入门文章，适合小白用户阅读。

要求：
1. 文章结构清晰，包含：什么是{topic}、为什么学习它、核心概念、实际应用场景
2. 使用通俗易懂的比喻解释技术概念
3. 文章长度800-1200字
4. 在文章末尾添加3个思考问题
5. 语言风格轻松活泼，像朋友聊天一样
6. 使用Markdown格式输出`

let isRunning = false

// 初始化定时任务
export function initCronJobs() {
  // 每天凌晨3点自动生成内容（避开高峰期）
  cron.schedule('0 3 * * *', async () => {
    console.log('[Cron] 开始每日自动内容生成任务...')
    await generateDailyContent()
  }, {
    scheduled: true,
    timezone: 'Asia/Shanghai'
  })

  // 每天凌晨4点自动生成图片
  cron.schedule('0 4 * * *', async () => {
    console.log('[Cron] 开始每日自动图片生成任务...')
    await generateDailyImages()
  }, {
    scheduled: true,
    timezone: 'Asia/Shanghai'
  })

  console.log('[Cron] 定时任务已启动')
  console.log('[Cron] 每日内容生成: 03:00')
  console.log('[Cron] 每日图片生成: 04:00')
}

// 生成每日内容（50篇）
async function generateDailyContent() {
  if (isRunning) {
    console.log('[Cron] 任务正在运行中，跳过')
    return
  }

  isRunning = true
  const generatedCount = { success: 0, failed: 0 }

  try {
    // 随机选择50个主题
    const shuffled = [...TECH_TOPICS].sort(() => Math.random() - 0.5)
    const selectedTopics = shuffled.slice(0, 50)

    for (let i = 0; i < selectedTopics.length; i++) {
      const topic = selectedTopics[i]
      console.log(`[Cron] 生成内容 ${i + 1}/50: ${topic}`)

      try {
        // 生成文章内容
        const prompt = CONTENT_PROMPT_TEMPLATE.replace(/{topic}/g, topic)
        const content = await minimaxService.generateText(prompt, {
          maxTokens: 2500,
          temperature: 0.8
        })

        if (!content || content.length < 100) {
          console.log(`[Cron] 内容生成失败或太短: ${topic}`)
          generatedCount.failed++
          continue
        }

        // 提取标题（第一行）
        const titleMatch = content.match(/^#\s*(.+)/m)
        const title = titleMatch ? titleMatch[1].trim() : `${topic}入门指南`

        // 保存到数据库（使用现有字段）
        const { error } = await supabase.from('posts').insert([{
          title,
          content,
          author: 'AI助手',
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          tags: [topic, 'AI生成', '每日更新'],
          type: TYPES[Math.floor(Math.random() * TYPES.length)],
          height: '220px',
          likes: Math.floor(Math.random() * 50),
          image: ''
        }])

        if (error) {
          console.error(`[Cron] 保存内容失败: ${topic}`, error.message)
          generatedCount.failed++
        } else {
          console.log(`[Cron] 内容生成成功: ${title}`)
          generatedCount.success++
        }

        // 避免请求过快
        await sleep(3000)
      } catch (error) {
        console.error(`[Cron] 生成内容异常: ${topic}`, error.message)
        generatedCount.failed++
      }
    }

    console.log(`[Cron] 内容生成完成: 成功 ${generatedCount.success}, 失败 ${generatedCount.failed}`)
  } catch (error) {
    console.error('[Cron] 每日内容生成任务异常:', error)
  } finally {
    isRunning = false
  }
}

// 生成每日图片（50张）
async function generateDailyImages() {
  if (isRunning) {
    console.log('[Cron] 图片任务正在运行中，跳过')
    return
  }

  isRunning = true
  const generatedCount = { success: 0, failed: 0 }

  try {
    // 获取最近50篇没有图片的内容
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, category, tags')
      .or('image.is.null,image.eq.""')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[Cron] 获取无图片内容失败:', error.message)
      return
    }

    if (!posts || posts.length === 0) {
      console.log('[Cron] 没有需要生成图片的内容')
      return
    }

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const topic = post.tags?.[0] || post.category || '技术'
      console.log(`[Cron] 生成图片 ${i + 1}/${posts.length}: ${topic}`)

      try {
        const prompt = IMAGE_PROMPT_TEMPLATE.replace(/{topic}/g, topic)
        const imageUrl = await minimaxService.generateImage(prompt)

        if (!imageUrl) {
          generatedCount.failed++
          continue
        }

        // 更新内容图片
        const { error: updateError } = await supabase
          .from('posts')
          .update({ image: imageUrl })
          .eq('id', post.id)

        if (updateError) {
          console.error(`[Cron] 更新图片失败: ${post.id}`, updateError.message)
          generatedCount.failed++
        } else {
          console.log(`[Cron] 图片生成成功: ${topic}`)
          generatedCount.success++
        }

        // 避免请求过快（图片生成较慢）
        await sleep(5000)
      } catch (error) {
        console.error(`[Cron] 生成图片异常: ${topic}`, error.message)
        generatedCount.failed++
      }
    }

    console.log(`[Cron] 图片生成完成: 成功 ${generatedCount.success}, 失败 ${generatedCount.failed}`)
  } catch (error) {
    console.error('[Cron] 每日图片生成任务异常:', error)
  } finally {
    isRunning = false
  }
}

// 手动触发内容生成（用于测试）
export async function manualGenerateContent(count = 5) {
  const shuffled = [...TECH_TOPICS].sort(() => Math.random() - 0.5)
  const selectedTopics = shuffled.slice(0, count)
  const results = []

  for (const topic of selectedTopics) {
    try {
      const prompt = CONTENT_PROMPT_TEMPLATE.replace(/{topic}/g, topic)
      const content = await minimaxService.generateText(prompt, {
        maxTokens: 2500,
        temperature: 0.8
      })

      const titleMatch = content.match(/^#\s*(.+)/m)
      const title = titleMatch ? titleMatch[1].trim() : `${topic}入门指南`

      results.push({
        success: true,
        title,
        content,
        topic
      })
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        topic
      })
    }

    await sleep(3000)
  }

  return results
}

// 手动触发图片生成（用于测试）
export async function manualGenerateImages(topics) {
  const results = []

  for (const topic of topics) {
    try {
      const prompt = IMAGE_PROMPT_TEMPLATE.replace(/{topic}/g, topic)
      const imageUrl = await minimaxService.generateImage(prompt)

      results.push({
        success: true,
        url: imageUrl,
        topic
      })
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        topic
      })
    }

    await sleep(5000)
  }

  return results
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  initCronJobs,
  manualGenerateContent,
  manualGenerateImages
}
