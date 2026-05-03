import { Router } from 'express'
import { getPaths, getPathById, getPathProgress } from '../controllers/pathController.js'

const router = Router()

router.get('/list', getPaths)
router.get('/progress', getPathProgress)
router.get('/:id', getPathById)

export default router
