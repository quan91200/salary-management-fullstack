import express from 'express'
import {
  createWorkRule,
  updateWorkRule,
  getAllWorkRules,
  deleteWorkRule
} from '../controllers/workRuleController.js'

const router = express.Router()

router.post('/', createWorkRule)
router.get('/', getAllWorkRules)
router.put('/:id', updateWorkRule)
router.delete('/:id', deleteWorkRule)

export default router