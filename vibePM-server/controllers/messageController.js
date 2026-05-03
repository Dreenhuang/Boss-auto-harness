import { supabase } from '../server.js'

export async function getMessages(req, res) {
  try {
    const userId = req.user?.id || 'guest'
    const { type, unreadOnly } = req.query

    let query = supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (type && type !== 'all') {
      if (type === 'interaction') {
        query = query.in('type', ['interaction', 'follow', 'comment'])
      } else {
        query = query.eq('type', type)
      }
    }

    if (unreadOnly === 'true') {
      query = query.eq('unread', true)
    }

    const { data, error } = await query

    if (error) throw error

    const messages = data.map(m => ({
      id: m.id,
      type: m.type,
      name: m.sender_name,
      avatar: m.sender_avatar || '',
      bgColor: m.sender_bg_color || '#F0F0F0',
      content: m.content,
      time: formatTime(m.created_at),
      unread: m.unread,
      targetId: m.target_id,
      actionUrl: m.action_url || ''
    }))

    res.json({ code: 200, message: 'success', data: messages })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('messages')
      .update({ unread: false })
      .eq('id', id)

    if (error) throw error

    res.json({ code: 200, message: 'success', data: { success: true } })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function clearAllUnread(req, res) {
  try {
    const userId = req.user?.id || 'guest'

    const { error } = await supabase
      .from('messages')
      .update({ unread: false })
      .eq('user_id', userId)
      .eq('unread', true)

    if (error) throw error

    res.json({ code: 200, message: 'success', data: { success: true } })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

function formatTime(isoString) {
  if (!isoString) return ''
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}
