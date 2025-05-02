import xlsx from 'xlsx'
import db from '../models/index.js'
import path from 'path'
import fs from 'fs'

const { Employee, WorkRule, EmployeeTax, Attendance } = db

export async function uploadAttendanceMiddleware(req, res) {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: 'Không có file được tải lên' })
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawData = xlsx.utils.sheet_to_json(sheet)

    const invalidRows = []

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i]
      const rowIndex = i + 2 // Header là dòng 1

      try {
        const { employee_code, month, year, total_work_hours, min_work_hours, work_type } = row

        if (!employee_code || !month || !year || !total_work_hours || !min_work_hours || !work_type) {
          invalidRows.push({ ...row, Lỗi: 'Thiếu thông tin bắt buộc' })
          continue
        }

        const monthInt = parseInt(month)
        const yearInt = parseInt(year)

        if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
          invalidRows.push({ ...row, Lỗi: `Tháng không hợp lệ: ${month}` })
          continue
        }

        if (isNaN(yearInt) || yearInt < 2000 || yearInt > new Date().getFullYear() + 1) {
          invalidRows.push({ ...row, Lỗi: `Năm không hợp lệ: ${year}` })
          continue
        }

        const employee = await Employee.findOne({
          where: { code: employee_code.toLowerCase() }
        })

        if (!employee) {
          invalidRows.push({ ...row, Lỗi: `Không tìm thấy nhân viên với mã ${employee_code}` })
          continue
        }

        const workRule = await WorkRule.findOne({
          where: { min_work_hours }
        })

        if (!workRule) {
          invalidRows.push({ ...row, Lỗi: `Không tìm thấy Work Rule với min_work_hours = ${min_work_hours}` })
          continue
        }

        const employeeTax = await EmployeeTax.findOne({
          where: {
            employee_id: employee.id,
            month: monthInt,
            year: yearInt
          }
        })

        if (!employeeTax) {
          const taxCheck = await EmployeeTax.findOne({ where: { employee_id: employee.id } })
          const reason = taxCheck
            ? `Không có bảng thuế cho tháng ${monthInt}/${yearInt}`
            : `Nhân viên ${employee_code} chưa có bất kỳ bảng thuế nào`
          invalidRows.push({ ...row, Lỗi: reason })
          continue
        }

        const gross = parseFloat(employeeTax.gross_income)
        const minHours = parseFloat(min_work_hours)
        const workHours = parseFloat(total_work_hours)

        if (isNaN(gross) || isNaN(minHours) || isNaN(workHours)) {
          invalidRows.push({ ...row, Lỗi: 'Dữ liệu số không hợp lệ (gross_income hoặc giờ công)' })
          continue
        }

        const hourly_rate = gross / minHours
        const earned_amount = hourly_rate * workHours

        await Attendance.upsert({
          employee_id: employee.id,
          month: monthInt,
          year: yearInt,
          total_work_hours,
          work_type,
          work_rule_id: workRule.id,
          earned_amount
        })
      } catch (err) {
        invalidRows.push({ ...row, Lỗi: `Lỗi xử lý dòng ${rowIndex}: ${err.message}` })
        continue
      }
    }

    if (invalidRows.length > 0) {
      // Lưu file lỗi
      const errorWorkbook = xlsx.utils.book_new()
      const errorSheet = xlsx.utils.json_to_sheet(invalidRows)
      xlsx.utils.book_append_sheet(errorWorkbook, errorSheet, 'Lỗi')
      const errorPath = path.join('uploads', `attendance-errors-${Date.now()}.xlsx`)
      xlsx.writeFile(errorWorkbook, errorPath)

      return res.status(400).json({
        message: 'Một số dòng không hợp lệ',
        invalidRows: invalidRows.length,
        errorFile: errorPath
      })
    }

    return res.status(200).json({
      message: 'Import dữ liệu chấm công thành công'
    })
  } catch (error) {
    console.error('Lỗi trong uploadAttendanceMiddleware:', error)
    return res.status(500).json({
      message: 'Lỗi máy chủ khi xử lý file chấm công',
      error: error.message
    })
  }
}