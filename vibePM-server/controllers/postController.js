import { supabase } from '../server.js'

export async function getPosts(req, res) {
  try {
    const { tab = 'recommend', page = 1, pageSize = 10 } = req.query
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (tab && tab !== 'recommend') {
      query = query.eq('type', tab)
    }

    const { data, count, error } = await query

    if (error) throw error

    const posts = data.map(post => ({
      id: post.id,
      title: post.title,
      author: post.author || 'AI助手',
      avatar: post.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibepm',
      likes: post.likes || 0,
      image: post.image || `https://picsum.photos/seed/${post.id}/400/300`,
      height: post.height || '220px',
      category: post.category || '未分类',
      type: post.type || 'concept',
      content: post.content || '',
      tags: post.tags || [],
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }))

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: posts,
        total: count || 0,
        page: Number(page),
        pageSize: Number(pageSize),
        hasMore: (offset + (data?.length || 0)) < (count || 0)
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function getPostById(req, res) {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ code: 404, message: 'Post not found', data: null })

    const post = {
      id: data.id,
      title: data.title,
      author: data.author,
      avatar: data.avatar,
      likes: data.likes,
      image: data.image,
      height: data.height || '220px',
      category: data.category,
      type: data.type,
      content: data.content,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }

    res.json({ code: 200, message: 'success', data: post })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function incrementLikes(req, res) {
  try {
    const { id } = req.params
    const { data, error } = await supabase.rpc('increment_likes', { post_id: id })
    if (error) throw error
    res.json({ code: 200, message: 'success', data: { likes: data } })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
