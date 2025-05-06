import db from '../models/index.js'

const { Employee, Attendance, WorkRule, EmployeeTax, SalaryAdvance, Salary } = db

export const createAttendance = async (req, res) => {
  try {
    const { employee_id, apply_date, total_work_hours, work_rule_id } = req.body

    const [yearStr, monthStr] = apply_date?.split('-') || []
    const month = parseInt(monthStr)
    const year = parseInt(yearStr)

    if (!employee_id || !apply_date || !total_work_hours || !work_rule_id) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    const employee = await Employee.findByPk(employee_id)
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    const existing = await Attendance.findOne({
      where: { employee_id, month, year }
    })

    if (existing) {
      return res.status(400).json({ message: 'Nhân viên đã được chấm công cho tháng này' })
    }

    const salary = await Salary.findOne({ where: { employee_id, month, year } })
    if (!salary) {
      return res.status(404).json({ message: 'Không tìm thấy bảng lương cho nhân viên' })
    }

    const employeeTax = await EmployeeTax.findOne({
      where: { employee_id, month, year }
    })
    if (!employeeTax) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi thuế cho nhân viên' })
    }

    const advances = await SalaryAdvance.findAll({
      where: { employee_id, month, year }
    })

    const total_advance = advances.reduce(
      (acc, item) => acc + parseFloat(item.amount || 0),
      0
    )

    const workRule = await WorkRule.findByPk(work_rule_id)
    if (!workRule || !workRule.min_work_hours || workRule.min_work_hours <= 0) {
      return res.status(400).json({ message: 'Quy tắc làm việc không hợp lệ' })
    }

    const basic_salary = parseFloat(salary.basic_salary || 0)
    const bonus = parseFloat(salary.total_bonus || 0)
    const deduction = parseFloat(salary.total_deductions || 0)
    const tax_amount = parseFloat(employeeTax.tax_amount || 0)
    const min_work_hours = parseFloat(workRule.min_work_hours || 1)
    const hourly_rate = basic_salary / min_work_hours

    const earned_amount = (hourly_rate * parseFloat(total_work_hours)) + bonus - tax_amount - deduction - total_advance

    console.table({
      basic_salary,
      bonus,
      tax_amount,
      deduction,
      total_advance,
      min_work_hours,
      total_work_hours,
      hourly_rate,
      earned_amount
    })

    const attendance = await Attendance.create({
      employee_id,
      month,
      year,
      total_work_hours,
      work_type: employee.type,
      work_rule_id,
      earned_amount
    })

    return res.status(200).json({
      message: 'Đã tạo mới chấm công',
      attendance,
      calculatedData: {
        basic_salary,
        bonus,
        tax_amount,
        deduction,
        total_advance,
        min_work_hours,
        total_work_hours,
        hourly_rate,
        earned_amount
      }
    })
  } catch (error) {
    console.error('Lỗi khi tạo chấm công:', error)
    return res.status(500).json({
      message: 'Lỗi máy chủ',
      error: error.message
    })
  }
}

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params
    const { employee_id, apply_date, total_work_hours, work_rule_id } = req.body

    const [yearStr, monthStr] = apply_date?.split('-') || []
    const month = parseInt(monthStr)
    const year = parseInt(yearStr)

    const employee = await Employee.findByPk(employee_id)
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    const salary = await Salary.findOne({ where: { employee_id, month, year } })
    if (!salary) {
      return res.status(404).json({ message: 'Không tìm thấy bảng lương cho nhân viên' })
    }

    const employeeTax = await EmployeeTax.findOne({ where: { employee_id, month, year } })
    if (!employeeTax) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi thuế cho nhân viên' })
    }

    const advances = await SalaryAdvance.findAll({ where: { employee_id, month, year } })
    const total_advance = advances.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0)

    const workRule = await WorkRule.findByPk(work_rule_id)
    if (!workRule || !workRule.min_work_hours || workRule.min_work_hours <= 0) {
      return res.status(400).json({ message: 'Quy tắc làm việc không hợp lệ' })
    }

    const basic_salary = parseFloat(salary.basic_salary || 0)
    const bonus = parseFloat(salary.total_bonus || 0)
    const deduction = parseFloat(salary.total_deductions || 0)
    const tax_amount = parseFloat(employeeTax.tax_amount || 0)
    const min_work_hours = parseFloat(workRule.min_work_hours)
    const hourly_rate = basic_salary / min_work_hours

    const earned_amount = (hourly_rate * parseFloat(total_work_hours)) + bonus - tax_amount - deduction - total_advance

    console.table({
      basic_salary,
      bonus,
      tax_amount,
      deduction,
      total_advance,
      min_work_hours,
      total_work_hours,
      hourly_rate,
      earned_amount
    })

    const attendance = await Attendance.findByPk(id)
    if (!attendance) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi chấm công' })
    }

    await attendance.update({
      total_work_hours,
      work_type: employee.type,
      work_rule_id,
      earned_amount
    })

    return res.status(200).json({
      message: 'Đã cập nhật chấm công',
      attendance,
      calculatedData: {
        basic_salary,
        bonus,
        tax_amount,
        deduction,
        total_advance,
        min_work_hours,
        total_work_hours,
        hourly_rate,
        earned_amount
      }
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật chấm công:', error)
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message })
  }
}

export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['code', 'name', 'type']
        },
        {
          model: WorkRule,
          as: 'workRule',
          attributes: ['id', 'name', 'min_work_hours']
        }
      ],
      order: [
        ['year', 'DESC'],
        ['month', 'DESC'],
        [{ model: Employee, as: 'employee' }, 'code', 'ASC']
      ]
    })

    res.status(200).json(attendances)
  } catch (error) {
    console.error('Error fetching attendances:', error)
    res.status(500).json({
      message: 'Có lỗi khi lấy danh sách chấm công',
      error: error.message
    })
  }
}

export const deleteAttendance = async (req, res) => {
  const { id } = req.params

  try {
    const attendance = await Attendance.findByPk(id)

    if (!attendance) {
      return res.status(404).json({
        message: 'Không tìm thấy bản ghi chấm công'
      })
    }

    await attendance.destroy()

    res.status(200).json({
      message: 'Đã xóa chấm công thành công'
    })
  } catch (error) {
    console.error('Lỗi khi xóa chấm công:', error)
    res.status(500).json({
      message: 'Có lỗi khi xóa chấm công',
      error: error.message
    })
  }
}