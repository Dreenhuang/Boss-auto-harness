import { supabase } from '../server.js'

export async function getKnowledgeStats(req, res) {
  try {
    const userId = req.user?.id || 'guest'

    const { count: favCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const { count: pathCount } = await supabase
      .from('user_paths')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('status', 'not_started')

    res.json({
      code: 200,
      message: 'success',
      data: {
        favorites: favCount || 0,
        paths: pathCount || 0
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function getRecentViews(req, res) {
  try {
    const userId = req.user?.id || 'guest'
    const { limit = 10 } = req.query

    const { data, error } = await supabase
      .from('recent_views')
      .select('*, posts(title, image, category)')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(Number(limit))

    if (error) throw error

    const recentPosts = data.map(rv => ({
      id: rv.post_id,
      title: rv.posts?.title || '',
      image: rv.posts?.image || '',
      category: rv.posts?.category || '',
      time: formatTime(rv.viewed_at)
    }))

    res.json({ code: 200, message: 'success', data: recentPosts })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

function formatTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return `浏览于 ${date.toLocaleDateString('zh-CN')}`
}
