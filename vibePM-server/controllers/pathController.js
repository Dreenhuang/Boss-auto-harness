import { supabase } from '../server.js'

export async function getPaths(req, res) {
  try {
    const userId = req.user?.id || 'guest'
    const { status } = req.query

    let query = supabase
      .from('learning_paths')
      .select('*, user_paths!left(user_id, progress, status)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('user_paths.status', status)
    }

    const { data, error } = await query

    if (error) throw error

    const paths = data.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      coverImage: p.cover_image,
      difficulty: p.difficulty,
      totalSteps: p.total_steps,
      estimatedHours: p.estimated_hours,
      progress: p.user_paths?.[0]?.progress || 0,
      status: p.user_paths?.[0]?.status || 'not_started',
      steps: [],
      createdAt: p.created_at,
      tags: p.tags || []
    }))

    res.json({ code: 200, message: 'success', data: paths })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function getPathById(req, res) {
  try {
    const { id } = req.params

    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('id', id)
      .single()

    if (pathError) throw pathError
    if (!path) return res.status(404).json({ code: 404, message: 'Path not found', data: null })

    const { data: steps } = await supabase
      .from('learning_steps')
      .select('*')
      .eq('path_id', id)
      .order('step_order', { ascending: true })

    const result = {
      id: path.id,
      title: path.title,
      description: path.description,
      coverImage: path.cover_image,
      difficulty: path.difficulty,
      totalSteps: path.total_steps,
      estimatedHours: path.estimated_hours,
      progress: 0,
      status: 'not_started',
      steps: (steps || []).map(s => ({
        id: s.id,
        order: s.step_order,
        title: s.title,
        type: s.step_type,
        contentId: s.content_id,
        duration: s.duration,
        isCompleted: s.is_completed || false,
        locked: s.locked || false
      })),
      createdAt: path.created_at,
      tags: path.tags || []
    }

    res.json({ code: 200, message: 'success', data: result })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function getPathProgress(req, res) {
  try {
    const userId = req.user?.id || 'guest'

    const { data, error } = await supabase
      .from('user_paths')
      .select('*, learning_paths(title, total_steps)')
      .eq('user_id', userId)

    if (error) throw error

    const progressList = data.map(up => {
      const path = up.learning_paths
      const progress = up.progress || 0
      let status = '进行中'
      let statusType = 'active'
      let action = '继续学习'

      if (progress === 100) {
        status = '已完成'
        statusType = 'completed'
        action = '查看证书'
      } else if (progress >= 60) {
        status = '快完成了'
      }

      return {
        id: up.path_id,
        title: path?.title || '',
        progress,
        status,
        statusType,
        action,
        totalSteps: path?.total_steps || 0,
        completedSteps: Math.floor((path?.total_steps || 0) * progress / 100),
        lastAccessedAt: up.last_accessed_at || ''
      }
    })

    res.json({ code: 200, message: 'success', data: progressList })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
