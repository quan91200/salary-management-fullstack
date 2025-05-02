import express from 'express'
import {
  generateEmployeeTax,
  createEmployeeTaxByMonthYear,
  getAllEmployeeTaxes,
  deleteEmployeeTaxes,
} from '../controllers/employeeTaxController.js'

const router = express.Router()

router.post('/generate', generateEmployeeTax)
router.get('/', getAllEmployeeTaxes)
router.post('/', createEmployeeTaxByMonthYear)
router.delete('/', deleteEmployeeTaxes)

export default router