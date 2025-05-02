import express from 'express'
import {
    createDeduction,
    getAllDeductions,
    getDeductionById,
    updateDeduction,
    deleteDeduction
} from '../controllers/deductionController.js'

const router = express.Router()

router.post('/', createDeduction)
router.get('/', getAllDeductions)
router.get('/:id', getDeductionById)
router.put('/:id', updateDeduction)
router.delete('/:id', deleteDeduction)

export default router