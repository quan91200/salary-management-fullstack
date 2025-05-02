import express from 'express'
import {
  createEmployeeBonus,
  updateEmployeeBonus,
  deleteEmployeeBonus,
  getAllEmployeeBonuses
} from '../controllers/employeeBonusController.js'

const router = express.Router()

router.post('', createEmployeeBonus)
router.get('/', getAllEmployeeBonuses)
router.put('/:id', updateEmployeeBonus)
router.delete('/:employee_id/:month/:year', deleteEmployeeBonus)

export default router