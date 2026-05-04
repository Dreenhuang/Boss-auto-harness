import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:3003', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://192.168.1.16:3003'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
)

import postRoutes from './routes/posts.js'
import favoriteRoutes from './routes/favorites.js'
import searchRoutes from './routes/search.js'
import userRoutes from './routes/users.js'
import pathRoutes from './routes/paths.js'
import messageRoutes from './routes/messages.js'
import authRoutes from './routes/auth.js'
import exportRoutes from './routes/exports.js'
import knowledgeRoutes from './routes/knowledge.js'
import aiRoutes from './routes/ai.js'
import recommendRoutes from './routes/recommend.js'
import adminRoutes from './routes/admin.js'

app.use('/api/posts', postRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/user', userRoutes)
app.use('/api/paths', pathRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/knowledge', knowledgeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/recommend', recommendRoutes)
app.use('/api/admin', adminRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    code: 200,
    message: 'Vibe PM Server is running',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      features: ['ai-content', 'ai-image', 'cron-jobs', 'real-time-data']
    }
  })
})

// 手动触发AI内容生成（测试用）
app.post('/api/admin/cron/generate-content', async (req, res) => {
  try {
    const { count = 5 } = req.body
    const { manualGenerateContent } = await import('./services/cronService.js')
    const results = await manualGenerateContent(Math.min(count, 10))

    // 保存到数据库
    const saved = []
    for (const item of results) {
      if (item.success) {
        const { error } = await supabase.from('posts').insert([{
          title: item.title,
          content: item.content,
          author: 'AI助手',
          category: ['基础概念', '技术选型', '学习路径', '框架对比', '实战方案'][Math.floor(Math.random() * 5)],
          tags: [item.topic, 'AI生成'],
          type: ['recommend', 'practice', 'tech', 'ai', 'guide'][Math.floor(Math.random() * 5)],
          height: '220px',
          likes: 0,
          image: ''
        }])
        if (error) {
          console.error('[API] 保存失败:', error.message)
        } else {
          saved.push(item.title)
        }
      }
    }

    res.json({
      code: 200,
      message: `成功生成 ${saved.length} 条内容`,
      data: { generated: results.length, saved: saved.length, titles: saved }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
})

// 手动触发AI图片生成（测试用）
app.post('/api/admin/cron/generate-images', async (req, res) => {
  try {
    const { topics } = req.body
    const { manualGenerateImages } = await import('./services/cronService.js')
    const results = await manualGenerateImages(topics || ['React', 'Vue', 'Docker'])

    res.json({
      code: 200,
      message: '图片生成完成',
      data: results
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
})

app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ code: 500, message: err.message || 'Internal Server Error', data: null })
})

app.listen(PORT, async () => {
  console.log(`🚀 Vibe PM Server running on http://localhost:${PORT}`)
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)

  // 启动定时任务
  try {
    const { initCronJobs } = await import('./services/cronService.js')
    initCronJobs()
  } catch (error) {
    console.error('[Cron] 定时任务启动失败:', error.message)
  }
})

export default app
