import db from '../models/index.js'

const { SalaryAdvance, Employee } = db

export const createSalaryAdvance = async (req, res) => {
    try {
        const data = req.body
        const salaryAdvance = await SalaryAdvance.create(data)
        res.status(201).json(salaryAdvance)
    } catch (error) {
        console.error('Error in createSalaryAdvance:', error)
        res.status(500).json({
            message: 'Có lỗi khi tạo ứng lương',
            error: error.message
        })
    }
}

export const updateSalaryAdvance = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const salaryAdvance = await SalaryAdvance.findByPk(id)

        if (!salaryAdvance) {
            return res.status(404).json({ message: 'Không tìm thấy ứng lương để cập nhật' })
        }

        await salaryAdvance.update(data)
        res.status(200).json(salaryAdvance)
    } catch (error) {
        console.error('Error in updateSalaryAdvance:', error)
        res.status(500).json({
            message: 'Có lỗi khi cập nhật ứng lương',
            error: error.message
        })
    }
}

export const deleteSalaryAdvance = async (req, res) => {
    try {
        const { id } = req.params
        const salaryAdvance = await SalaryAdvance.findByPk(id)

        if (!salaryAdvance) {
            return res.status(404).json({ message: 'Không tìm thấy ứng lương để xoá' })
        }

        await salaryAdvance.destroy()
        res.status(200).json({ message: 'Xoá ứng lương thành công' })
    } catch (error) {
        console.error('Error in deleteSalaryAdvance:', error)
        res.status(500).json({
            message: 'Có lỗi khi xoá ứng lương',
            error: error.message
        })
    }
}

export const getSalaryAdvanceById = async (req, res) => {
    try {
        const { id } = req.params
        const salaryAdvance = await SalaryAdvance.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'name', 'code']
                }
            ]
        })
        if (!salaryAdvance) {
            return res.status(404).json({ message: 'Không tìm thấy ứng lương' })
        }
        res.status(200).json(salaryAdvance)
    } catch (error) {
        console.error('Error in getSalaryAdvanceById:', error)
        res.status(500).json({
            message: 'Có lỗi khi lấy chi tiết ứng lương',
            error: error.message
        })
    }
}

export const getAllSalaryAdvances = async (req, res) => {
    try {
        const advances = await SalaryAdvance.findAll({
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'code', 'name']
                },
            ],
            order: [['year', 'DESC'], ['month', 'DESC']]
        })
        res.status(200).json(advances)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ứng lương', error })
    }
}