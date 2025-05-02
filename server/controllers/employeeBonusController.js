import db from '../models/index.js'

const { EmployeeBonus, Employee, Bonus } = db

export const createEmployeeBonus = async (req, res) => {
  const { employee_id, bonuses, month, year } = req.body

  if (!employee_id || !month || !year) {
    return res.status(400).json({ message: 'Thiếu thông tin employee_id, month hoặc year' })
  }

  if (!Array.isArray(bonuses)) {
    return res.status(400).json({ message: 'Bonus phải là mảng' })
  }

  try {
    const allBonuses = await Bonus.findAll()

    if (!Array.isArray(allBonuses) || allBonuses.length === 0) {
      return res.status(400).json({ message: 'Không có thưởng nào được tìm thấy trong hệ thống' })
    }

    const createData = allBonuses.map(bonus => {
      const inputBonus = bonuses.find(b => b.bonus_id === bonus.id)
      return {
        employee_id,
        bonus_id: bonus.id,
        amount: inputBonus ? inputBonus.amount : 0,
        month,
        year,
      }
    })

    const createdBonuses = await EmployeeBonus.bulkCreate(createData)

    res.status(201).json(createdBonuses)
  } catch (error) {
    console.error('Error creating employee bonuses:', error)
    res.status(500).json({
      message: 'Có lỗi khi tạo thưởng nhân viên',
      error: error.message
    })
  }
}

export const updateEmployeeBonus = async (req, res) => {
  const { id } = req.params
  const { amount } = req.body

  try {
    const bonus = await EmployeeBonus.findByPk(id)

    if (!bonus) {
      return res.status(404).json({ message: 'Không tìm thấy khoản thưởng' })
    }

    bonus.amount = amount
    await bonus.save()

    res.json(bonus)
  } catch (error) {
    console.error('Error updating employee bonus:', error)
    res.status(500).json({ message: 'Có lỗi khi cập nhật thưởng', error: error.message })
  }
}

export const deleteEmployeeBonus = async (req, res) => {
  const { employee_id, month, year } = req.params

  try {
    const bonus = await EmployeeBonus.findAll({ where: { employee_id, month, year } })

    if (!bonus) {
      return res.status(404).json({ message: 'Không tìm thấy khoản thưởng' })
    }

    await EmployeeBonus.destroy({
      where: { employee_id, month, year }
    })

    res.json({ message: 'Xoá khoản thưởng thành công' })
  } catch (error) {
    console.error('Error deleting employee bonus:', error)
    res.status(500).json({ message: 'Có lỗi khi xoá khoản thưởng', error: error.message })
  }
}

export const getAllEmployeeBonuses = async (req, res) => {
  try {
    const employeeBonuses = await EmployeeBonus.findAll({
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name', 'code'] },
        { model: Bonus, as: 'bonus', attributes: ['id', 'name', 'code'] }
      ],
      order: [['employee_id', 'ASC'], ['year', 'DESC'], ['month', 'DESC']]
    })

    const grouped = {}
    employeeBonuses.forEach(bonus => {
      const key = `${bonus.employee_id}_${bonus.month}_${bonus.year}`
      if (!grouped[key]) {
        grouped[key] = {
          employee_id: bonus.employee_id,
          employee_name: bonus.employee.name,
          employee_code: bonus.employee.code,
          month: bonus.month,
          year: bonus.year,
          bonuses: []
        }
      }
      grouped[key].bonuses.push({
        bonus_id: bonus.bonus_id,
        bonus_name: bonus.bonus.name,
        bonus_code: bonus.bonus.code,
        amount: bonus.amount
      })
    })

    res.json(Object.values(grouped))
  } catch (error) {
    console.error('Lỗi lấy danh sách thưởng nhân viên:', error)
    res.status(500).json({ message: 'Có lỗi xảy ra' })
  }
}