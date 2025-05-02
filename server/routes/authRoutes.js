import express from 'express'
import {
    register,
    login,
    verify,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js'
import { verifyUser } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/', login)
router.get('/verify', verifyUser, verify)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router