import { supabase } from '../server.js'

export async function getUserProfile(req, res) {
  try {
    const userId = req.user?.id || 'guest'

    // 如果是游客，返回默认资料
    if (userId === 'guest' || req.user?.isGuest) {
      return res.json({
        code: 200,
        message: 'success',
        data: {
          id: 'guest',
          phone: '',
          nickname: '游客',
          avatar: '',
          level: '新手',
          joinDate: '',
          preferences: { interests: [], experience: '零基础', goals: [], timeSlot: '', notificationEnabled: true },
          stats: {
            totalCardsLearned: 0,
            totalFavorites: 0,
            totalLearningHours: 0,
            streakDays: 0,
            completedPaths: 0
          }
        }
      })
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) {
      if (userError.code === 'PGRST116') {
        return res.status(404).json({ code: 404, message: '用户不存在', data: null })
      }
      throw userError
    }

    const { count: favCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const { count: pathCount } = await supabase
      .from('user_paths')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const profile = {
      id: user.id,
      phone: user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '',
      nickname: user.nickname || '学习者',
      avatar: user.avatar || '',
      level: user.level || '新手',
      joinDate: user.created_at ? user.created_at.split('T')[0] : '',
      preferences: user.preferences || { interests: [], experience: '零基础', goals: [], timeSlot: '', notificationEnabled: true },
      stats: {
        totalCardsLearned: user.cards_learned || 0,
        totalFavorites: favCount || 0,
        totalLearningHours: user.learning_hours || 0,
        streakDays: user.streak_days || 0,
        completedPaths: pathCount || 0
      }
    }

    res.json({ code: 200, message: 'success', data: profile })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function updateUserProfile(req, res) {
  try {
    const userId = req.user?.id || 'guest'
    const updates = req.body

    const allowedFields = ['nickname', 'avatar', 'level', 'preferences']
    const filteredUpdates = {}
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    }

    const { data, error } = await supabase
      .from('users')
      .update(filteredUpdates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({ code: 200, message: 'success', data })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
