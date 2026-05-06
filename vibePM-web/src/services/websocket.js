class WebSocketClient {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000
    this.listeners = new Map()
    this.isConnected = false
    this.url = null
    this.connectionStartTime = null
    this.lastMessageTime = null
    this.messageCount = { sent: 0, received: 0, errors: 0 }
    this.latencySamples = []
    this.healthCheckInterval = null
    this.pingInterval = null
    this.subscriptions = new Set()
  }

  connect(url) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('[WS] Already connected or connecting')
      return
    }

    this.url = url || `ws://${window.location.host}/ws`
    this.connectionStartTime = Date.now()

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log('[WS] Connected to server')
        this.isConnected = true
        this.reconnectAttempts = 0
        this.emit('connected', { message: 'Connected to WebSocket server' })
        this.subscribe('posts')
        this.startPing()
        this.startHealthCheck()
      }

      this.ws.onmessage = (event) => {
        try {
          this.lastMessageTime = Date.now()
          this.messageCount.received++
          const data = JSON.parse(event.data)
          console.log('[WS] Received:', data.type)
          if (data.type === 'pong') {
            this.handlePong()
          }
          this.emit(data.type, data)
        } catch (error) {
          console.error('[WS] Message parse error:', error)
          this.messageCount.errors++
        }
      }

      this.ws.onclose = (event) => {
        console.log('[WS] Disconnected:', event.code, event.reason)
        this.isConnected = false
        this.stopPing()
        this.stopHealthCheck()
        this.emit('disconnected', { code: event.code, reason: event.reason })

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect()
        } else {
          console.error('[WS] Max reconnect attempts reached')
          this.emit('max_reconnect_reached', { attempts: this.reconnectAttempts })
        }
      }

      this.ws.onerror = (error) => {
        console.error('[WS] Error:', error)
        this.messageCount.errors++
        this.emit('error', error)
      }
    } catch (error) {
      console.error('[WS] Connection error:', error)
      this.scheduleReconnect()
    }
  }

  scheduleReconnect() {
    this.reconnectAttempts++
    const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1), 30000)

    console.log(`[WS] Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    this.emit('reconnecting', { attempt: this.reconnectAttempts, delay })

    setTimeout(() => {
      this.connect()
    }, delay)
  }

  startPing() {
    this.stopPing()
    this.pingInterval = setInterval(() => {
      if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: Date.now() })
      }
    }, 30000)
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  handlePong() {
    const now = Date.now()
    const lastPingTime = this._lastPingTime || now
    const latency = now - lastPingTime
    this.latencySamples.push(latency)
    if (this.latencySamples.length > 10) {
      this.latencySamples.shift()
    }
  }

  startHealthCheck() {
    this.stopHealthCheck()
    this.healthCheckInterval = setInterval(() => {
      const stats = this.getStats()
      if (stats.connectionAge > 60000) {
        console.log('[WS] Health check:', stats)
      }
      if (this.lastMessageTime && Date.now() - this.lastMessageTime > 120000) {
        console.warn('[WS] No messages received for 2 minutes')
        this.emit('timeout', { lastMessageTime: this.lastMessageTime })
      }
    }, 60000)
  }

  stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }
  }

  disconnect() {
    if (this.ws) {
      this.reconnectAttempts = this.maxReconnectAttempts
      this.stopPing()
      this.stopHealthCheck()
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
      this.isConnected = false
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      this.ws.send(message)
      this.messageCount.sent++
      if (data.type === 'ping') {
        this._lastPingTime = Date.now()
      }
    } else {
      console.warn('[WS] Cannot send: not connected')
    }
  }

  subscribe(channel) {
    this.subscriptions.add(channel)
    this.send({
      type: 'subscribe',
      channel
    })
  }

  unsubscribe(channel) {
    this.subscriptions.delete(channel)
    this.send({
      type: 'unsubscribe',
      channel
    })
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)

    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[WS] Event handler error for ${event}:`, error)
        }
      })
    }
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      callback(data)
      unsubscribe()
    })
    return unsubscribe
  }

  removeListener(event, callback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  getStats() {
    const avgLatency = this.latencySamples.length > 0
      ? this.latencySamples.reduce((a, b) => a + b, 0) / this.latencySamples.length
      : 0

    return {
      isConnected: this.isConnected,
      readyState: this.ws?.readyState,
      reconnectAttempts: this.reconnectAttempts,
      url: this.url,
      connectionAge: this.connectionStartTime ? Date.now() - this.connectionStartTime : 0,
      lastMessageTime: this.lastMessageTime,
      messages: { ...this.messageCount },
      avgLatency: Math.round(avgLatency),
      subscriptions: Array.from(this.subscriptions)
    }
  }

  getStatus() {
    return this.getStats()
  }
}

// 创建单例实例
export const wsClient = new WebSocketClient()

// 便捷方法
export function useWebSocket() {
  return {
    connect: (url) => wsClient.connect(url),
    disconnect: () => wsClient.disconnect(),
    subscribe: (channel) => wsClient.subscribe(channel),
    unsubscribe: (channel) => wsClient.unsubscribe(channel),
    onNewPost: (callback) => wsClient.on('new_post', callback),
    onPostUpdate: (callback) => wsClient.on('post_update', callback),
    onConnected: (callback) => wsClient.on('connected', callback),
    onDisconnected: (callback) => wsClient.on('disconnected', callback),
    onError: (callback) => wsClient.on('error', callback),
    getStatus: () => wsClient.getStatus(),
    isConnected: () => wsClient.isConnected
  }
}

export default wsClient
