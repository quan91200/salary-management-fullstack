import db from '../models/index.js'

const { Bonus } = db

export const createBonus = async (req, res) => {
    try {
        const data = req.body
        const bonus = await Bonus.create(data)
        res.status(201).json(bonus)
    } catch (error) {
        console.error('Lỗi tạo thưởng', error)
        res.status(500).json({
            message: 'Tạo thưởng thất bại',
            error: error.message
        })
    }
}

export const updateBonus = async (req, res) => {
    try {
        const { code } = req.params
        const data = req.body

        const bonus = await Bonus.findOne({ where: { code } })

        if (!bonus) {
            return res.status(404).json({
                message: 'Không tìm thấy thưởng để cập nhật'
            })
        }

        await bonus.update(data)
        res.status(200).json(bonus)
    } catch (error) {
        console.error('Error updateBonus:', error)
        res.status(500).json({
            message: 'Cập nhật thưởng thất bại',
            error: error.message
        })
    }
}

export const deleteBonus = async (req, res) => {
    try {
        const { code } = req.params

        const bonus = await Bonus.findOne({ where: { code } })

        if (!bonus) {
            return res.status(404).json({
                message: 'Không tìm thấy thưởng để xoá'
            })
        }

        await bonus.destroy()
        res.status(200).json({ message: 'Xoá thưởng thành công' })
    } catch (error) {
        console.error('Error deleteBonus:', error)
        res.status(500).json({
            message: 'Xoá thưởng thất bại',
            error: error.message
        })
    }
}

export const getBonusById = async (req, res) => {
    try {
        const { code } = req.params
        const bonus = await Bonus.findOne({ where: { code } })

        if (!bonus) {
            return res.status(404).json({ message: 'Không tìm thấy thưởng' })
        }

        res.status(200).json(bonus)
    } catch (error) {
        console.error('Error getBonusById:', error)
        res.status(500).json({
            message: 'Lấy thưởng thất bại',
            error: error.message
        })
    }
}

export const getAllBonuses = async (req, res) => {
    try {
        const bonuses = await Bonus.findAll()
        res.status(200).json(bonuses)
    } catch (error) {
        console.error('Error getAllBonuses:', error)
        res.status(500).json({
            message: 'Lấy danh sách thưởng thất bại',
            error: error.message
        })
    }
}