import { Router } from 'express'
import { searchContent, getHotSearches } from '../controllers/searchController.js'

const router = Router()

router.get('/', searchContent)
router.get('/hot', getHotSearches)

export default router
