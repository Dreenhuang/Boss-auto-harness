import { supabase } from '../server.js'

export async function addFavorite(req, res) {
  try {
    const { cardId } = req.body
    const userId = req.user?.id || 'guest'

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, post_id: cardId })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return res.json({ code: 200, message: 'Already favorited', data: { success: true } })
      }
      throw error
    }

    res.json({ code: 200, message: 'success', data: { success: true, id: data.id } })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function removeFavorite(req, res) {
  try {
    const { id } = req.params
    const userId = req.user?.id || 'guest'

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('post_id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ code: 200, message: 'success', data: { success: true } })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function getFavorites(req, res) {
  try {
    const userId = req.user?.id || 'guest'
    const { page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize

    const { data, count, error } = await supabase
      .from('favorites')
      .select('post_id, created_at, posts(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw error

    const list = data.map(fav => {
      const post = fav.posts
      return {
        id: post.id,
        title: post.title,
        author: post.author,
        avatar: post.avatar,
        likes: post.likes,
        image: post.image,
        height: post.height || '220px',
        category: post.category,
        type: post.type,
        content: post.content,
        tags: post.tags || [],
        createdAt: post.created_at,
        updatedAt: post.updated_at
      }
    })

    res.json({
      code: 200,
      message: 'success',
      data: {
        list,
        total: count || 0,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
