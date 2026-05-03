import { Router } from 'express'
import { exportContent } from '../controllers/exportController.js'

const router = Router()

router.post('/', exportContent)

export default router
