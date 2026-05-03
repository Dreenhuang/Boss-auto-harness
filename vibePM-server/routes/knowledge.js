import { Router } from 'express'
import { getKnowledgeStats, getRecentViews } from '../controllers/knowledgeController.js'

const router = Router()

router.get('/stats', getKnowledgeStats)
router.get('/recent', getRecentViews)

export default router
