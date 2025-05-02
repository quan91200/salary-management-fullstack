import express from 'express'
import {
	generateSalary,
	getAllSalary,
	deleteSalary
} from '../controllers/salaryController.js'

const router = express.Router()

router.post('/generate', generateSalary)
router.get('/', getAllSalary)
router.delete('/', deleteSalary)

export default router
