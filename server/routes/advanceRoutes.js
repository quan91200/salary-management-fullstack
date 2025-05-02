import express from 'express'
import {
    createSalaryAdvance,
    updateSalaryAdvance,
    deleteSalaryAdvance,
    getAllSalaryAdvances,
    getSalaryAdvanceById,
} from '../controllers/advanceController.js'

const router = express.Router()

router.post('/', createSalaryAdvance)
router.get('/', getAllSalaryAdvances)
router.get('/:id', getSalaryAdvanceById)
router.put('/:id', updateSalaryAdvance)
router.delete('/:id', deleteSalaryAdvance)

export default router