import db from '../models/index.js'

const { Employee, Attendance, WorkRule, EmployeeTax } = db

export const createAttendance = async (req, res) => {
  try {
    const { employee_id, apply_date, total_work_hours, work_rule_id } = req.body
    const [yearStr, monthStr] = apply_date?.split('-') || []
    const month = parseInt(monthStr)
    const year = parseInt(yearStr)

    const employee = await Employee.findByPk(employee_id)
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    const employeeTax = await EmployeeTax.findOne({ where: { employee_id, month, year } })
    if (!employeeTax) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi thuế cho nhân viên' })
    }

    const workRule = await WorkRule.findOne({ where: { id: work_rule_id } })
    if (!workRule) {
      return res.status(404).json({ message: 'Không tìm thấy quy tắc làm việc' })
    }

    const hourly_rate = parseFloat(employeeTax.gross_income) / parseFloat(workRule.min_work_hours)
    const earn_money = hourly_rate * parseFloat(total_work_hours)

    const attendance = await Attendance.create({
      employee_id,
      month,
      year,
      total_work_hours,
      work_type: employee.type,
      work_rule_id: workRule.id,
      earned_amount: earn_money
    })

    return res.status(200).json({ message: 'Đã tạo mới chấm công', attendance })
  } catch (error) {
    console.error('Lỗi khi tạo chấm công:', error)
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message })
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

    const employeeTax = await EmployeeTax.findOne({ where: { employee_id, month, year } })
    if (!employeeTax) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi thuế cho nhân viên' })
    }

    const workRule = await WorkRule.findOne({ where: { id: work_rule_id } })
    if (!workRule) {
      return res.status(404).json({ message: 'Không tìm thấy quy tắc làm việc' })
    }

    const hourly_rate = parseFloat(employeeTax.gross_income) / parseFloat(workRule.min_work_hours)
    const earn_money = hourly_rate * parseFloat(total_work_hours)

    const attendance = await Attendance.findByPk(id)
    if (!attendance) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi chấm công' })
    }

    await attendance.update({
      total_work_hours,
      work_type: employee.type,
      work_rule_id: workRule.id,
      earned_amount: earn_money
    })

    return res.status(200).json({ message: 'Đã cập nhật chấm công', attendance })
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