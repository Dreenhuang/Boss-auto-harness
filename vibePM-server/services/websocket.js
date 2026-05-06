import { WebSocketServer, WebSocket } from 'ws'
import { supabase } from './server.js'

class WebSocketService {
  constructor() {
    this.wss = null
    this.clients = new Set()
    this.heartbeatInterval = null
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' })

    this.wss.on('connection', (ws, req) => {
      console.log('[WebSocket] Client connected:', req.socket.remoteAddress)
      this.clients.add(ws)

      // 发送欢迎消息
      this.sendToClient(ws, {
        type: 'connected',
        message: 'WebSocket connection established',
        timestamp: new Date().toISOString()
      })

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString())
          await this.handleMessage(ws, data)
        } catch (error) {
          console.error('[WebSocket] Message parse error:', error)
          this.sendToClient(ws, {
            type: 'error',
            message: 'Invalid message format'
          })
        }
      })

      ws.on('close', () => {
        console.log('[WebSocket] Client disconnected')
        this.clients.delete(ws)
      })

      ws.on('error', (error) => {
        console.error('[WebSocket] Error:', error)
        this.clients.delete(ws)
      })

      // 发送心跳检测
      ws.isAlive = true
      ws.on('pong', () => {
        ws.isAlive = true
      })
    })

    // 启动心跳检测
    this.startHeartbeat()

    console.log(`[WebSocket] Server initialized on path /ws`)
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
          this.clients.delete(ws)
          return ws.terminate()
        }

        ws.isAlive = false
        ws.ping()
      })
    }, 30000)

    this.wss.on('close', () => {
      clearInterval(this.heartbeatInterval)
    })
  }

  async handleMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        await this.handleSubscribe(ws, data)
        break

      case 'unsubscribe':
        await this.handleUnsubscribe(ws, data)
        break

      case 'ping':
        this.sendToClient(ws, { type: 'pong' })
        break

      default:
        console.log('[WebSocket] Unknown message type:', data.type)
    }
  }

  async handleSubscribe(ws, data) {
    const { channel } = data

    if (!channel) {
      return this.sendToClient(ws, {
        type: 'error',
        message: 'Channel is required'
      })
    }

    // 订阅频道
    if (!ws.channels) {
      ws.channels = new Set()
    }
    ws.channels.add(channel)

    this.sendToClient(ws, {
      type: 'subscribed',
      channel,
      message: `Subscribed to ${channel}`
    })

    console.log(`[WebSocket] Client subscribed to: ${channel}`)
  }

  async handleUnsubscribe(ws, data) {
    const { channel } = data

    if (ws.channels && channel) {
      ws.channels.delete(channel)
      this.sendToClient(ws, {
        type: 'unsubscribed',
        channel,
        message: `Unsubscribed from ${channel}`
      })
    }
  }

  sendToClient(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data))
    }
  }

  broadcast(data, channel = null) {
    const message = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    })

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // 如果指定了频道，只发送给订阅该频道的客户端
        if (channel && client.channels && !client.channels.has(channel)) {
          return
        }
        client.send(message)
      }
    })
  }

  broadcastNewPost(post) {
    this.broadcast(
      {
        type: 'new_post',
        data: post
      },
      'posts'
    )
  }

  broadcastPostUpdate(postId, updates) {
    this.broadcast(
      {
        type: 'post_update',
        postId,
        data: updates
      },
      'posts'
    )
  }

  getStats() {
    return {
      connectedClients: this.clients.size,
      uptime: process.uptime()
    }
  }
}

export const wsService = new WebSocketService()
export default wsService
