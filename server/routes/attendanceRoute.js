import express from 'express'
import multer from 'multer'
import {
  createAttendance,
  updateAttendance,
  getAllAttendances,
  deleteAttendance
} from '../controllers/attendanceController.js'
import { uploadAttendanceMiddleware } from '../middleware/validateAttendanceExcel.js'

const storage = multer.memoryStorage()
const upload = multer({ storage }).single('file')
const router = express.Router()

router.post('/upload', upload, uploadAttendanceMiddleware)
router.post('/', createAttendance)
router.put('/:id', updateAttendance)
router.get('/', getAllAttendances)
router.delete('/:id', deleteAttendance)

export default router