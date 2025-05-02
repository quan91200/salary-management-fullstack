import express from 'express'
import {
    createPersonalIncomeTax,
    updatePersonalIncomeTax,
    deletePersonalIncomeTax,
    getPersonalIncomeTaxByEmployee,
    getAllPersonalIncomeTax
} from '../controllers/personalTaxController.js'

const router = express.Router()

router.get('/', getAllPersonalIncomeTax)
router.post('/', createPersonalIncomeTax)
router.get('/:employee_id', getPersonalIncomeTaxByEmployee)
router.put('/:employee_id', updatePersonalIncomeTax)
router.delete('/:employee_id', deletePersonalIncomeTax)

export default router