import { Router } from 'express'
import { register, login, guestLogin } from '../controllers/authController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/guest', guestLogin)

export default router
