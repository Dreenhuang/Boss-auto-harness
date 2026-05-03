import { Router } from 'express'
import { getRecommendations } from '../controllers/recommendController.js'

const router = Router()

router.get('/', getRecommendations)

export default router
