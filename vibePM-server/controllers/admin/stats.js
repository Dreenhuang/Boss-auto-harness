import { supabase } from '../../server.js'

// 获取概览数据
export async function getStatsOverview(req, res) {
  try {
    // 用户总数
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 今日新增用户
    const today = new Date().toISOString().split('T')[0]
    const { count: todayNewUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    // 内容总数
    const { count: contentCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    // 今日新增内容
    const { count: todayNewContent } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    res.json({
      code: 200,
      message: 'success',
      data: {
        totalUsers: userCount || 0,
        todayNewUsers: todayNewUsers || 0,
        totalContent: contentCount || 0,
        todayNewContent: todayNewContent || 0,
        activeRate: 89.5,
        completionRate: 78.6,
        avgStudyTime: 45.2
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 用户统计
export async function getUserStats(req, res) {
  try {
    const { days = 30 } = req.query
    const dates = []
    const newUsers = []
    const activeUsers = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dates.push(dateStr)

      // 模拟数据
      newUsers.push(Math.floor(Math.random() * 200) + 50)
      activeUsers.push(Math.floor(Math.random() * 1000) + 500)
    }

    res.json({
      code: 200,
      message: 'success',
      data: { dates, newUsers, activeUsers }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 内容统计
export async function getContentStats(req, res) {
  try {
    const categories = [
      { name: '基础概念', count: 1209, percent: 35 },
      { name: '技术选型', count: 864, percent: 25 },
      { name: '学习路径', count: 691, percent: 20 },
      { name: '框架对比', count: 415, percent: 12 },
      { name: '其他', count: 277, percent: 8 }
    ]

    res.json({
      code: 200,
      message: 'success',
      data: { categories }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 学习统计
export async function getLearningStats(req, res) {
  try {
    const dates = []
    const studyTime = []
    const completionRate = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
      studyTime.push(Math.floor(Math.random() * 300) + 200)
      completionRate.push(Math.floor(Math.random() * 30) + 60)
    }

    res.json({
      code: 200,
      message: 'success',
      data: { dates, studyTime, completionRate }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 导出数据
export async function exportData(req, res) {
  try {
    const { type = 'users' } = req.body

    // 模拟导出
    const csvContent = 'ID,名称,手机号,状态,注册时间\n1,张三,138****1234,active,2026-04-01\n2,李四,139****5678,active,2026-04-02'

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${type}_export.csv"`)
    res.send(csvContent)
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
