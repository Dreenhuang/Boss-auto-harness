import { supabase } from '../server.js'

export async function searchContent(req, res) {
  try {
    const { q = '', limit = 20 } = req.query

    if (!q.trim()) {
      return res.json({ code: 200, message: 'success', data: [] })
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${q}%,content.ilike.%${q}%,category.ilike.%${q}%`)
      .limit(limit)

    if (error) throw error

    const results = data.map(post => ({
      id: post.id,
      type: 'post',
      title: post.title,
      description: post.content ? post.content.substring(0, 100) + '...' : '',
      image: post.image,
      category: post.category,
      relevanceScore: 0.9,
      highlightFields: {
        title: post.title,
        description: post.content ? post.content.substring(0, 100) + '...' : ''
      }
    }))

    res.json({ code: 200, message: 'success', data: results })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function getHotSearches(req, res) {
  try {
    const { data, error } = await supabase
      .from('hot_searches')
      .select('*')
      .order('count', { ascending: false })
      .limit(10)

    if (error) throw error

    res.json({ code: 200, message: 'success', data: data.map(d => d.keyword) })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
