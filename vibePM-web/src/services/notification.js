class NotificationService {
  constructor() {
    this.permission = 'default'
    this.swRegistration = null
  }

  async init() {
    if (!('Notification' in window)) {
      console.log('[Notification] Browser does not support notifications')
      return false
    }

    this.permission = Notification.permission

    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready
      } catch {
        this.swRegistration = null
      }
    }

    return true
  }

  async requestPermission() {
    if (!('Notification' in window)) return false

    if (this.permission === 'granted') return true

    const result = await Notification.requestPermission()
    this.permission = result
    return result === 'granted'
  }

  showLocal(title, options = {}) {
    if (this.permission !== 'granted') return null

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
      if (options.onClick) options.onClick()
    }

    return notification
  }

  showLearningReminder() {
    this.showLocal('Vibe PM 学习提醒', {
      body: '今天还没有学习哦，来打卡吧！',
      tag: 'learning-reminder',
      requireInteraction: false
    })
  }

  showNewContent(title) {
    this.showLocal('新内容上线', {
      body: `${title} 已更新，快来看看吧！`,
      tag: 'new-content'
    })
  }

  showMessageNotification(sender, content) {
    this.showLocal(`${sender} 发来消息`, {
      body: content,
      tag: 'message'
    })
  }
}

export const notificationService = new NotificationService()
export default notificationService
