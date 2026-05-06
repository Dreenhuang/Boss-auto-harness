import { describe, it, expect } from 'vitest'

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api'

describe('Post Controller', () => {
  describe('getPosts API', () => {
    it('should return posts with correct structure', async () => {
      const response = await fetch(`${API_BASE}/posts?tab=recommend&page=1&pageSize=10`)
      const result = await response.json()
      
      expect(result).toBeDefined()
      expect(result.code).toBe(200)
      expect(result.data).toBeDefined()
      expect(result.data.list).toBeInstanceOf(Array)
      expect(result.data.total).toBeGreaterThanOrEqual(0)
    })

    it('should filter by tab type', async () => {
      const tabs = ['recommend', 'practice', 'tech', 'ai', 'guide']
      
      for (const tab of tabs) {
        const response = await fetch(`${API_BASE}/posts?tab=${tab}&page=1&pageSize=5`)
        const result = await response.json()
        
        expect(response.ok).toBe(true)
        expect(result.code).toBe(200)
      }
    })

    it('should paginate correctly', async () => {
      const response1 = await fetch(`${API_BASE}/posts?tab=recommend&page=1&pageSize=5`)
      const result1 = await response1.json()
      
      expect(result1.data.list.length).toBeLessThanOrEqual(5)
    })
  })

  describe('getPostById API', () => {
    it('should return single post by id', async () => {
      const listResponse = await fetch(`${API_BASE}/posts?tab=recommend&page=1&pageSize=1`)
      const listResult = await listResponse.json()
      
      if (listResult.data?.list?.length > 0) {
        const postId = listResult.data.list[0].id
        const response = await fetch(`${API_BASE}/posts/${postId}`)
        const result = await response.json()
        
        expect(result).toBeDefined()
        expect(result.code).toBe(200)
        expect(result.data).toBeDefined()
      }
    })
  })
})
