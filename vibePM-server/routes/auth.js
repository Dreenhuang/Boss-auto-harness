import { Router } from 'express'
import { sendCode, login, guestLogin } from '../controllers/authController.js'

const router = Router()

router.post('/send-code', sendCode)
router.post('/login', login)
router.post('/guest', guestLogin)

export default router
