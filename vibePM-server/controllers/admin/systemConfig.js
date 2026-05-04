import { supabase } from '../../server.js'

// 默认配置
let systemConfig = {
  siteName: 'Vibe PM',
  logo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=VibePM&backgroundColor=FF2442',
  icp: '京ICP备12345678号',
  email: 'support@vibepm.com',
  registerEnabled: true,
  captchaEnabled: true,
  inviteCodeRequired: false,
  autoAudit: false,
  sensitiveWordFilter: true,
  manualReview: true,
  maintenanceMode: false,
  maintenanceMessage: '系统维护中，请稍后再试'
}

// 获取系统配置
export async function getSystemConfig(req, res) {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: systemConfig
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}

// 更新系统配置
export async function updateSystemConfig(req, res) {
  try {
    const updates = req.body

    systemConfig = {
      ...systemConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    res.json({
      code: 200,
      message: '配置更新成功',
      data: systemConfig
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, data: null })
  }
}
