import { Router } from 'express'
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController.js'

const router = Router()

router.post('/', addFavorite)
router.delete('/:id', removeFavorite)
router.get('/list', getFavorites)

export default router
