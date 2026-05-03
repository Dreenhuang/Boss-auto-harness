import { Router } from 'express'
import { getMessages, markAsRead, clearAllUnread } from '../controllers/messageController.js'

const router = Router()

router.get('/', getMessages)
router.put('/:id/read', markAsRead)
router.put('/clear-unread', clearAllUnread)

export default router
