import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { supabase } from '../server.js'

const JWT_SECRET = process.env.JWT_SECRET || 'vibe-pm-jwt-secret-2026'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex')
}

function validatePhone(phone) {
  return /^1\d{10}$/.test(phone)
}

function validatePassword(password) {
  if (!password || password.length < 8) return false
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  return hasLetter && hasNumber
}

export async function register(req, res) {
  try {
    const { phone, password } = req.body

    if (!phone || !password) {
      return res.status(400).json({ code: 400, message: '手机号和密码不能为空', data: null })
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ code: 400, message: '手机号格式不正确，请输入11位手机号', data: null })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ code: 400, message: '密码至少8位，必须包含字母和数字', data: null })
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single()

    if (existingUser) {
      return res.status(409).json({ code: 409, message: '该手机号已注册', data: null })
    }

    const hashedPassword = hashPassword(password)
    const nickname = `用户${phone.slice(-4)}`

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone,
        password: hashedPassword,
        nickname,
        level: '新手',
        preferences: { interests: [], experience: '零基础', goals: [], timeSlot: '', notificationEnabled: true }
      })
      .select()
      .single()

    if (createError) throw createError

    const token = jwt.sign(
      { id: newUser.id, phone: newUser.phone },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      code: 200,
      message: 'success',
      data: {
        token,
        user: {
          id: newUser.id,
          phone: newUser.phone,
          nickname: newUser.nickname,
          avatar: newUser.avatar,
          level: newUser.level
        }
      }
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

export async function login(req, res) {
  try {
    const { phone, password } = req.body

    if (!phone || !password) {
      return res.status(400).json({ code: 400, message: '手机号和密码不能为空', data: null })
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (userError || !user) {
      return res.status(401).json({ code: 401, message: '手机号未注册', data: null })
    }

    const hashedPassword = hashPassword(password)
    if (user.password !== hashedPassword) {
      return res.status(401).json({ code: 401, message: '密码错误', data: null })
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

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
