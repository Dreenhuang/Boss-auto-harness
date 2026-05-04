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

app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'Vibe PM Server is running', data: { version: '1.0.0', timestamp: new Date().toISOString() } })
})

app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ code: 500, message: err.message || 'Internal Server Error', data: null })
})

app.listen(PORT, () => {
  console.log(`🚀 Vibe PM Server running on http://localhost:${PORT}`)
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)
})

export default app
