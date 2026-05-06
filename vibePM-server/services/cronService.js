import cron from 'node-cron'
import { supabase } from '../server.js'
import minimaxService from './minimaxService.js'
import promptStrategies from './promptStrategies.js'

// 扩展技术主题池到100个
const TECH_TOPICS = [
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'Ruby',
  'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub Actions', 'Jenkins',
  'Node.js', 'Express', 'NestJS', 'Fastify', 'Django', 'Flask', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'SQLite',
  'AWS', 'Azure', 'Google Cloud', '阿里云', '腾讯云', '华为云',
  'GraphQL', 'REST API', 'gRPC', 'WebSocket', 'tRPC',
  'Tailwind CSS', 'Sass', 'Less', 'CSS Grid', 'Flexbox', 'Bootstrap',
  'Webpack', 'Vite', 'Rollup', 'esbuild', 'Parcel',
  'Jest', 'Cypress', 'Playwright', 'Selenium', 'Mocha',
  'Figma', 'Sketch', 'Adobe XD', 'Axure', 'Framer',
  '产品经理', '需求分析', '用户研究', '数据分析', '项目管理', '敏捷开发',
  'AI', 'ChatGPT', 'Midjourney', 'Stable Diffusion', 'LLM', 'Prompt Engineering',
  '机器学习', '深度学习', '神经网络', '计算机视觉', '自然语言处理',
  '微服务', 'Serverless', '边缘计算', '区块链', 'Web3',
  'Linux', 'Nginx', 'Apache', 'Tomcat', 'CDN',
  'OAuth', 'JWT', 'HTTPS', '网络安全', '渗透测试'
]

const CATEGORIES = ['基础概念', '技术选型', '学习路径', '框架对比', '实战方案']
const TYPES = ['recommend', 'practice', 'tech', 'ai', 'guide']

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
  console.log('[Cron] 每日内容生成: 03:00 (50篇)')
  console.log('[Cron] 每日图片生成: 04:00 (50张)')
}

// 生成每日内容（50篇）
async function generateDailyContent() {
  if (isRunning) {
    console.log('[Cron] 任务正在运行中，跳过')
    return
  }

  isRunning = true
  const stats = { success: 0, failed: 0, totalTime: 0 }
  const startTime = Date.now()

  try {
    // 随机选择50个主题
    const shuffled = [...TECH_TOPICS].sort(() => Math.random() - 0.5)
    const selectedTopics = shuffled.slice(0, 50)

    console.log(`[Cron] 开始生成 ${selectedTopics.length} 篇内容...`)

    for (let i = 0; i < selectedTopics.length; i++) {
      const topic = selectedTopics[i]
      const itemStart = Date.now()

      try {
        // 使用优化的提示词生成内容
        const prompt = promptStrategies.generateOptimizedContentPrompt(topic, {
          style: 'friendly',
          length: 'medium'
        })

        const content = await minimaxService.generateText(prompt, {
          maxTokens: 2500,
          temperature: 0.8
        })

        if (!content || content.length < 200) {
          console.log(`[Cron] 内容生成失败或太短: ${topic}`)
          stats.failed++
          continue
        }

        // 提取标题（第一行）
        const titleMatch = content.match(/^#\s*(.+)/m)
        const title = titleMatch ? titleMatch[1].trim() : `${topic}入门指南`

        // 保存到数据库
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
          console.error(`[Cron] 保存失败: ${topic}`, error.message)
          stats.failed++
        } else {
          const itemTime = Date.now() - itemStart
          stats.success++
          stats.totalTime += itemTime
          console.log(`[Cron] [${i + 1}/50] 成功 (${itemTime}ms): ${title.substring(0, 40)}...`)
        }
      } catch (error) {
        console.error(`[Cron] [${i + 1}/50] 异常: ${topic}`, error.message)
        stats.failed++
      }

      // 避免请求过快
      await sleep(2000)
    }

    const totalTime = Date.now() - startTime
    const avgTime = stats.success > 0 ? Math.round(stats.totalTime / stats.success) : 0

    console.log(`[Cron] 内容生成完成: 成功 ${stats.success}/50, 失败 ${stats.failed}, 总耗时 ${totalTime}ms, 平均 ${avgTime}ms/篇`)
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
  const stats = { success: 0, failed: 0, totalTime: 0 }
  const startTime = Date.now()

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

    console.log(`[Cron] 开始为 ${posts.length} 篇内容生成图片...`)

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const topic = post.tags?.[0] || post.category || '技术'
      const itemStart = Date.now()

      try {
        // 使用优化的提示词生成图片
        const prompt = promptStrategies.generateOptimizedImagePrompt(topic, {
          style: 'flat_design',
          composition: 'centered',
          colorScheme: 'xiaohongshu',
          detail: 'icon_style'
        })

        const imageUrl = await minimaxService.generateImage(prompt)

        if (!imageUrl) {
          stats.failed++
          continue
        }

        // 更新内容图片
        const { error: updateError } = await supabase
          .from('posts')
          .update({ image: imageUrl })
          .eq('id', post.id)

        if (updateError) {
          console.error(`[Cron] 更新图片失败: ${post.id}`, updateError.message)
          stats.failed++
        } else {
          const itemTime = Date.now() - itemStart
          stats.success++
          stats.totalTime += itemTime
          console.log(`[Cron] [${i + 1}/${posts.length}] 图片成功 (${itemTime}ms): ${topic}`)
        }
      } catch (error) {
        console.error(`[Cron] [${i + 1}/${posts.length}] 图片异常: ${topic}`, error.message)
        stats.failed++
      }

      // 避免请求过快
      await sleep(3000)
    }

    const totalTime = Date.now() - startTime
    const avgTime = stats.success > 0 ? Math.round(stats.totalTime / stats.success) : 0

    console.log(`[Cron] 图片生成完成: 成功 ${stats.success}/${posts.length}, 失败 ${stats.failed}, 总耗时 ${totalTime}ms, 平均 ${avgTime}ms/张`)
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
    const start = Date.now()
    try {
      const prompt = promptStrategies.generateOptimizedContentPrompt(topic, {
        style: 'friendly',
        length: 'medium'
      })

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
        topic,
        time: Date.now() - start
      })
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        topic,
        time: Date.now() - start
      })
    }

    await sleep(2000)
  }

  return results
}

// 手动触发图片生成（用于测试）
export async function manualGenerateImages(topics) {
  const results = []

  for (const topic of topics) {
    const start = Date.now()
    try {
      const prompt = promptStrategies.generateOptimizedImagePrompt(topic, {
        style: 'flat_design',
        colorScheme: 'xiaohongshu'
      })

      const imageUrl = await minimaxService.generateImage(prompt)

      results.push({
        success: true,
        url: imageUrl,
        topic,
        time: Date.now() - start
      })
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        topic,
        time: Date.now() - start
      })
    }

    await sleep(3000)
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
