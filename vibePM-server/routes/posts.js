import { Router } from 'express'
import { getPosts, getPostById, incrementLikes } from '../controllers/postController.js'

const router = Router()

router.get('/', getPosts)
router.get('/:id', getPostById)
router.post('/:id/like', incrementLikes)

export default router
