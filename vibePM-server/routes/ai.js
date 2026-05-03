import { Router } from 'express'
import { generateImage, getQuotaStatus, matchImageToCard } from '../controllers/aiController.js'

const router = Router()

router.post('/generate-image', generateImage)
router.get('/quota', getQuotaStatus)
router.post('/match-image', matchImageToCard)

export default router
