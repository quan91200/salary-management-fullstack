import db from '../models/index.js'

const { WorkRule } = db

export const createWorkRule = async (req, res) => {
  try {
    const data = req.body
    const newWorkRule = await WorkRule.create(data)
    res.status(201).json({
      ...newWorkRule.toJSON(),
      min_work_hours: parseFloat(newWorkRule.min_work_hours)
    })
  } catch (error) {
    console.error('Error creating work rule:', error)
    res.status(500).json({
      message: 'Có lỗi khi tạo quy tắc làm việc',
      error: error.message
    })
  }
}

export const updateWorkRule = async (req, res) => {
  const { id } = req.params
  const { name, work_type, min_work_hours } = req.body
  try {
    const workRule = await WorkRule.findByPk(id)
    if (!workRule) {
      return res.status(404).json({ message: 'Quy tắc làm việc không tồn tại' })
    }
    workRule.name = name || workRule.name
    workRule.work_type = work_type || workRule.work_type
    workRule.min_work_hours =
      min_work_hours !== undefined
        ? parseFloat(min_work_hours) : workRule.min_work_hours

    await workRule.save()

    res.status(200).json(workRule)
  } catch (error) {
    console.error('Error updating work rule:', error)
    res.status(500).json({
      message: 'Có lỗi khi cập nhật quy tắc làm việc',
      error: error.message
    })
  }
}

export const deleteWorkRule = async (req, res) => {
  const { id } = req.params

  try {
    const workRule = await WorkRule.findByPk(id)

    if (!workRule) {
      return res.status(404).json({
        message: 'Quy tắc làm việc không tồn tại'
      })
    }

    await workRule.destroy()
    res.status(200).json({
      message: 'Đã xóa quy tắc làm việc thành công'
    })
  } catch (error) {
    console.error('Error deleting work rule:', error)
    res.status(500).json({
      message: 'Có lỗi khi xóa quy tắc làm việc',
      error: error.message
    })
  }
}

export const getAllWorkRules = async (req, res) => {
  try {
    const workRules = await WorkRule.findAll()

    const formattedRules = workRules.map(rule => ({
      ...rule.toJSON(),
      min_work_hours: parseFloat(rule.min_work_hours)
    }))

    res.status(200).json(formattedRules)
  } catch (error) {
    console.error('Error fetching work rules:', error)
    res.status(500).json({
      message: 'Có lỗi khi lấy danh sách quy tắc làm việc',
      error: error.message
    })
  }
}