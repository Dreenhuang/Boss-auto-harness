import { describe, it, expect } from 'vitest'

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api'

describe('Posts API Integration Tests', () => {
  describe('GET /api/posts', () => {
    it('should fetch posts list', async () => {
      const response = await fetch(`${API_BASE}/posts?tab=recommend&page=1&pageSize=5`)
      const result = await response.json()
      
      expect(response.ok).toBe(true)
      expect(result.code).toBe(200)
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data.list)).toBe(true)
    })

    it('should fetch posts by different tabs', async () => {
      const tabs = ['recommend', 'practice', 'tech', 'ai', 'guide']
      
      for (const tab of tabs) {
        const response = await fetch(`${API_BASE}/posts?tab=${tab}&page=1&pageSize=3`)
        const result = await response.json()
        
        expect(response.ok).toBe(true)
        expect(result.code).toBe(200)
      }
    })

    it('should paginate correctly', async () => {
      const page1 = await fetch(`${API_BASE}/posts?tab=recommend&page=1&pageSize=5`)
      const result1 = await page1.json()
      
      const page2 = await fetch(`${API_BASE}/posts?tab=recommend&page=2&pageSize=5`)
      const result2 = await page2.json()
      
      if (result1.data.list.length > 0 && result2.data.list.length > 0) {
        const ids1 = result1.data.list.map(p => p.id)
        const ids2 = result2.data.list.map(p => p.id)
        const overlap = ids1.filter(id => ids2.includes(id))
        expect(overlap.length).toBe(0)
      }
    })
  })

  describe('GET /api/posts/:id', () => {
    it('should fetch single post', async () => {
      const listResponse = await fetch(`${API_BASE}/posts?tab=recommend&page=1&pageSize=1`)
      const listResult = await listResponse.json()
      
      if (listResult.data?.list?.length > 0) {
        const postId = listResult.data.list[0].id
        const response = await fetch(`${API_BASE}/posts/${postId}`)
        const result = await response.json()
        
        expect(response.ok).toBe(true)
        expect(result.code).toBe(200)
        expect(result.data.id).toBe(postId)
      }
    })
  })
})
