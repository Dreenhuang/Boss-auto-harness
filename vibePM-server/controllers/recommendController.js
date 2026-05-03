import { supabase } from '../server.js'

const RECOMMENDATION_WEIGHTS = {
  popular: 0.6,
  personalized: 0.3,
  fresh: 0.1
}

export async function getRecommendations(req, res) {
  try {
    const userId = req.user?.id || 'guest'
    const { limit = 10 } = req.query

    const popularCount = Math.ceil(limit * RECOMMENDATION_WEIGHTS.popular)
    const freshCount = Math.ceil(limit * RECOMMENDATION_WEIGHTS.fresh)

    const { data: popularPosts, error: popError } = await supabase
      .from('posts')
      .select('*')
      .order('likes', { ascending: false })
      .limit(popularCount)

    if (popError) throw popError

    let personalizedPosts = []
    if (userId !== 'guest') {
      const { data: userFavs } = await supabase
        .from('favorites')
        .select('post_id')
        .eq('user_id', userId)

      const { data: userViews } = await supabase
        .from('recent_views')
        .select('post_id')
        .eq('user_id', userId)

      const seenIds = new Set([
        ...(userFavs || []).map(f => f.post_id),
        ...(userViews || []).map(v => v.post_id)
      ])

      const { data: allPosts } = await supabase
        .from('posts')
        .select('*')

      if (allPosts) {
        const userTags = new Set()
        for (const seenId of seenIds) {
          const post = allPosts.find(p => p.id === seenId)
          if (post?.tags) {
            post.tags.forEach(t => userTags.add(t))
          }
        }

        const scored = allPosts
          .filter(p => !seenIds.has(p.id))
          .map(p => {
            const tagOverlap = (p.tags || []).filter(t => userTags.has(t)).length
            return { ...p, score: tagOverlap }
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, Math.ceil(limit * RECOMMENDATION_WEIGHTS.personalized))

        personalizedPosts = scored
      }
    }

    const { data: freshPosts, error: freshError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(freshCount)

    if (freshError) throw freshError

    const allRecommended = [
      ...popularPosts.map(p => ({ ...p, reason: 'popular' })),
      ...personalizedPosts.map(p => ({ ...p, reason: 'personalized' })),
      ...freshPosts.map(p => ({ ...p, reason: 'fresh' }))
    ]

    const seen = new Set()
    const unique = allRecommended.filter(p => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    }).slice(0, limit)

    res.json({
      code: 200,
      message: 'success',
      data: unique.map(post => ({
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
        reason: post.reason
      }))
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
