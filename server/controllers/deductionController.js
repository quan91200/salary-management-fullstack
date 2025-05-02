import db from '../models/index.js'

const { Deduction } = db

export const createDeduction = async (req, res) => {
    try {
        const deduction = await Deduction.create(req.body)
        res.status(201).json(deduction)
    } catch (error) {
        await t.rollback()
        console.error(error)
        res.status(500).json({ message: 'Có lỗi khi tạo khấu trừ', error: error.message })
    }
}

export const getAllDeductions = async (req, res) => {
    try {
        const deductions = await Deduction.findAll()
        res.json(deductions)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách khấu trừ', error: error.message })
    }
}

export const getDeductionById = async (req, res) => {
    try {
        const { id } = req.params
        const deduction = await Deduction.findByPk(id)

        if (!deduction) {
            return res.status(404).json({ message: 'Không tìm thấy khấu trừ' })
        }

        res.json(deduction)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin khấu trừ', error: error.message })
    }
}

export const updateDeduction = async (req, res) => {
    try {
        const { id } = req.params
        const { code, name, percentage } = req.body

        const deduction = await Deduction.findByPk(id)
        res.json(deduction)
    } catch (error) {
        await t.rollback()
        res.status(500).json({ message: 'Lỗi khi cập nhật khấu trừ', error: error.message })
    }
}

export const deleteDeduction = async (req, res) => {
    try {
        const { id } = req.params
        const deduction = await Deduction.findByPk(id)
        res.json({ message: 'Đã xóa khấu trừ thành công' })
    } catch (error) {
        await t.rollback()
        res.status(500).json({ message: 'Lỗi khi xóa khấu trừ', error: error.message })
    }
}