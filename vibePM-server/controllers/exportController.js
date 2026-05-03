import { supabase } from '../server.js'

export async function exportContent(req, res) {
  try {
    const { format = 'md', ids = [], settings = {} } = req.body
    const userId = req.user?.id || 'guest'

    let query = supabase.from('posts').select('*')

    if (ids.length > 0) {
      query = query.in('id', ids)
    } else {
      const { data: favs } = await supabase
        .from('favorites')
        .select('post_id')
        .eq('user_id', userId)
      const favIds = (favs || []).map(f => f.post_id)
      if (favIds.length > 0) {
        query = query.in('id', favIds)
      }
    }

    const { data: posts, error } = await query
    if (error) throw error

    let content = ''
    const timestamp = new Date().toISOString().split('T')[0]

    if (format === 'md' || format === 'markdown') {
      content = `# Vibe PM 学习笔记导出\n\n> 导出时间：${timestamp}\n\n---\n\n`
      posts.forEach((post, i) => {
        content += `## ${i + 1}. ${post.title}\n\n`
        if (settings.includeTags && post.tags?.length) {
          content += `**标签**: ${post.tags.join(', ')}\n\n`
        }
        if (settings.includeDates && post.created_at) {
          content += `**日期**: ${post.created_at.split('T')[0]}\n\n`
        }
        content += `${post.content || '暂无内容'}\n\n---\n\n`
      })
    } else if (format === 'html') {
      content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Vibe PM 学习笔记</title><style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px}h1{color:#6366f1}h2{border-bottom:2px solid #f0f0f0;padding-bottom:8px}.tag{background:#f5f5f5;padding:2px 8px;border-radius:10px;font-size:12px}</style></head><body><h1>Vibe PM 学习笔记导出</h1><p>导出时间：${timestamp}</p><hr>`
      posts.forEach((post, i) => {
        content += `<h2>${i + 1}. ${post.title}</h2>`
        if (settings.includeTags && post.tags?.length) {
          content += `<p>${post.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</p>`
        }
        content += `<div>${post.content || '暂无内容'}</div><hr>`
      })
      content += `</body></html>`
    } else {
      content = JSON.stringify({ exportDate: timestamp, posts }, null, 2)
    }

    const fileName = `vibe-pm-export-${timestamp}.${format === 'markdown' ? 'md' : format}`

    res.json({
      code: 200,
      message: 'success',
      data: {
        content,
        fileName,
        format,
        downloadUrl: `data:text/${format === 'html' ? 'html' : 'plain'};charset=utf-8,${encodeURIComponent(content)}`
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
