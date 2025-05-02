import express from 'express'
import multer from 'multer'
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployees,
} from '../controllers/employeeController.js'
import { uploadExcelMiddleware } from '../middleware/validateEmployeeExcel.js'

const storage = multer.memoryStorage()
const upload = multer({ storage }).single('file')

const router = express.Router()

router.post('/upload', upload, uploadExcelMiddleware)
router.post('/', createEmployee)
router.get('/', getAllEmployees)
router.get('/', getEmployees)
router.get('/:id', getEmployeeById)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router