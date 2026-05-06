class PerformanceMonitor {
  constructor() {
    this.metrics = {
      api: {
        requests: 0,
        errors: 0,
        totalLatency: 0,
        minLatency: Infinity,
        maxLatency: 0,
        lastRequestTime: null,
        lastErrorTime: null,
        endpoints: {}
      },
      sync: {
        lastSyncTime: null,
        lastSyncPostCount: 0,
        syncErrors: 0,
        consecutiveEmptySyncs: 0
      },
      data: {
        lastKnownPostId: null,
        localPostCount: 0,
        serverPostCount: 0,
        dataFreshnessAge: 0
      }
    }
    this.syncCheckInterval = null
  }

  recordApiRequest(endpoint, latency, success = true) {
    this.metrics.api.requests++
    this.metrics.api.totalLatency += latency
    this.metrics.api.lastRequestTime = Date.now()

    if (latency < this.metrics.api.minLatency) {
      this.metrics.api.minLatency = latency
    }
    if (latency > this.metrics.api.maxLatency) {
      this.metrics.api.maxLatency = latency
    }

    if (!this.metrics.api.endpoints[endpoint]) {
      this.metrics.api.endpoints[endpoint] = {
        requests: 0,
        errors: 0,
        totalLatency: 0,
        avgLatency: 0
      }
    }
    this.metrics.api.endpoints[endpoint].requests++
    this.metrics.api.endpoints[endpoint].totalLatency += latency
    this.metrics.api.endpoints[endpoint].avgLatency =
      Math.round(this.metrics.api.endpoints[endpoint].totalLatency /
                 this.metrics.api.endpoints[endpoint].requests)

    if (!success) {
      this.metrics.api.errors++
      this.metrics.api.lastErrorTime = Date.now()
      this.metrics.api.endpoints[endpoint].errors++
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${endpoint}: ${latency}ms ${success ? 'OK' : 'ERROR'}`)
    }
  }

  recordSync(postCount, hasNewData = false) {
    this.metrics.sync.lastSyncTime = Date.now()
    this.metrics.sync.lastSyncPostCount = postCount

    if (!hasNewData && postCount === this.metrics.sync.lastSyncPostCount) {
      this.metrics.sync.consecutiveEmptySyncs++
    } else {
      this.metrics.sync.consecutiveEmptySyncs = 0
    }

    this.metrics.data.localPostCount = postCount
  }

  recordSyncError() {
    this.metrics.sync.syncErrors++
  }

  updateDataFresness(postId, serverCount) {
    this.metrics.data.lastKnownPostId = postId
    this.metrics.data.serverPostCount = serverCount
    this.metrics.data.dataFreshnessAge = 0
  }

  incrementDataFreshnessAge() {
    this.metrics.data.dataFreshnessAge++
  }

  getApiStats() {
    const { api } = this.metrics
    const avgLatency = api.requests > 0
      ? Math.round(api.totalLatency / api.requests)
      : 0

    return {
      requests: api.requests,
      errors: api.errors,
      errorRate: api.requests > 0
        ? ((api.errors / api.requests) * 100).toFixed(2) + '%'
        : '0%',
      avgLatency: avgLatency + 'ms',
      minLatency: api.minLatency === Infinity ? 0 : api.minLatency + 'ms',
      maxLatency: api.maxLatency + 'ms',
      lastRequestTime: api.lastRequestTime
        ? new Date(api.lastRequestTime).toISOString()
        : null,
      lastErrorTime: api.lastErrorTime
        ? new Date(api.lastErrorTime).toISOString()
        : null,
      endpoints: api.endpoints
    }
  }

  getSyncStats() {
    const { sync } = this.metrics
    return {
      lastSyncTime: sync.lastSyncTime
        ? new Date(sync.lastSyncTime).toISOString()
        : null,
      lastSyncPostCount: sync.lastSyncPostCount,
      syncErrors: sync.syncErrors,
      consecutiveEmptySyncs: sync.consecutiveEmptySyncs,
      syncHealth: this.evaluateSyncHealth()
    }
  }

  getDataStats() {
    return { ...this.metrics.data }
  }

  getAllStats() {
    return {
      api: this.getApiStats(),
      sync: this.getSyncStats(),
      data: this.getDataStats(),
      timestamp: new Date().toISOString()
    }
  }

  evaluateSyncHealth() {
    const { sync } = this.metrics
    if (sync.syncErrors > 5) return 'critical'
    if (sync.consecutiveEmptySyncs > 3) return 'warning'
    if (sync.lastSyncTime && Date.now() - sync.lastSyncTime > 120000) return 'stale'
    return 'healthy'
  }

  startPeriodicMonitor(intervalMs = 30000) {
    this.stopPeriodicMonitor()
    this.syncCheckInterval = setInterval(() => {
      this.incrementDataFreshnessAge()
      const stats = this.getAllStats()
      if (process.env.NODE_ENV === 'development') {
        console.log('[Performance Monitor]', stats)
      }
    }, intervalMs)
  }

  stopPeriodicMonitor() {
    if (this.syncCheckInterval) {
      clearInterval(this.syncCheckInterval)
      this.syncCheckInterval = null
    }
  }

  reset() {
    this.metrics.api = {
      requests: 0,
      errors: 0,
      totalLatency: 0,
      minLatency: Infinity,
      maxLatency: 0,
      lastRequestTime: null,
      lastErrorTime: null,
      endpoints: {}
    }
    this.metrics.sync = {
      lastSyncTime: null,
      lastSyncPostCount: 0,
      syncErrors: 0,
      consecutiveEmptySyncs: 0
    }
  }
}

export const perfMonitor = new PerformanceMonitor()
export default perfMonitor
