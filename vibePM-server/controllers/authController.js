import jwt from 'jsonwebtoken'
import { supabase } from '../server.js'

const JWT_SECRET = process.env.JWT_SECRET || 'vibe-pm-jwt-secret-2026'

export async function sendCode(req, res) {
  try {
    const { phone } = req.body

    if (!phone || !/^1\d{10}$/.test(phone)) {
      return res.status(400).json({ code: 400, message: 'Invalid phone number', data: null })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))

    const { error } = await supabase
      .from('verification_codes')
      .insert({ phone, code, expires_at: new Date(Date.now() + 300000).toISOString() })

    if (error) throw error

    console.log(`[SMS] Code for ${phone}: ${code}`)

    res.json({ code: 200, message: 'success', data: { success: true, expiresIn: 300 } })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function login(req, res) {
  try {
    const { phone, code } = req.body

    if (!phone || !code) {
      return res.status(400).json({ code: 400, message: 'Phone and code required', data: null })
    }

    const { data: records, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (codeError) throw codeError
    if (!records || records.length === 0) {
      return res.status(401).json({ code: 401, message: 'Invalid or expired code', data: null })
    }

    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          phone,
          nickname: `用户${phone.slice(-4)}`,
          level: '新手',
          preferences: { interests: [], experience: '零基础', goals: [], timeSlot: '', notificationEnabled: true }
        })
        .select()
        .single()

      if (createError) throw createError
      user = newUser
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', records[0].id)

    res.json({
      code: 200,
      message: 'success',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          level: user.level
        }
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function guestLogin(req, res) {
  try {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const token = jwt.sign(
      { id: guestId, isGuest: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      code: 200,
      message: 'success',
      data: {
        token,
        user: {
          id: guestId,
          nickname: '游客',
          level: '新手',
          isGuest: true
        }
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: 'guest', isGuest: true }
    return next()
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    req.user = { id: 'guest', isGuest: true }
    next()
  }
}
