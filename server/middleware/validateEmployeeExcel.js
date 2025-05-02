import xlsx from 'xlsx'
import db from '../models/index.js'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const { Department, Position, Employee } = db

export async function uploadExcelMiddleware(req, res, next) {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({
        message: 'Không có file được tải lên'
      })
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const rawData = xlsx.utils.sheet_to_json(sheet, { defval: '' })
    const employeesData = rawData.map(row => ({
      code: row['Mã nhân viên'],
      name: row['Họ tên'],
      phone: row['SĐT'],
      email: row['Email'],
      department_code: row['Phòng ban'],
      position_code: row['Chức vụ'],
      default_basic_salary: row['Lương cơ bản'],
      default_number_of_dependents: row['Số người phụ thuộc']
    }))

    const invalidRows = []

    for (let i = 0; i < employeesData.length; i++) {
      const row = employeesData[i]

      if (!row.code || !row.name || !row.phone || !row.email || !row.department_code || !row.position_code || !row.default_basic_salary || row.default_number_of_dependents === '') {
        invalidRows.push({
          ...rawData[i],
          Lỗi: 'Thiếu thông tin bắt buộc'
        })
        continue
      }

      const department = await Department.findOne({
        where: { code: row.department_code.toLowerCase() }
      })

      if (!department) {
        invalidRows.push({
          ...rawData[i],
          Lỗi: `Không tìm thấy phòng ban với mã ${row.department_code}`
        })
        continue
      }

      const position = await Position.findOne({
        where: { code: row.position_code.toLowerCase() }
      })
      if (!position) {
        invalidRows.push({
          ...rawData[i],
          Lỗi: `Không tìm thấy chức vụ với mã ${row.position_code}`
        })
        continue
      }

      row.department_id = department.id
      row.position_id = position.id
    }

    if (invalidRows.length > 0) {
      // Tạo file Excel chứa các dòng lỗi
      const errorSheet = xlsx.utils.json_to_sheet(invalidRows)
      const errorWorkbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(errorWorkbook, errorSheet, 'Lỗi')

      const filePath = resolve('uploads', `loi_import_nhan_su_${Date.now()}.xlsx`)
      writeFileSync(filePath, xlsx.write(errorWorkbook, { type: 'buffer', bookType: 'xlsx' }))

      return res.status(400).json({
        message: 'Có lỗi trong các dòng của file Excel',
        errorFile: filePath.replace(/\\/g, '/')
      })
    }

    await Employee.bulkCreate(employeesData)

    return res.status(200).json({
      message: 'Thêm nhân viên thành công'
    })
  } catch (error) {
    console.error('Lỗi trong uploadExcelMiddleware:', error)
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi xử lý file Excel',
      error: error.message
    })
  }
}