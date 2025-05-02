import db from '../models/index.js'

const { Position } = db

export const createPosition = async (req, res) => {
    try {
        console.log('Request Body:', req.body)
        const position = await Position.create(req.body)
        res.status(201).json(position)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi tạo Chức vụ',
            error: error.message
        })
    }
}

export const updatePosition = async (req, res) => {
    try {
        const { id } = req.params
        const position = await Position.findByPk(id)

        if (!position) {
            return res.status(404).json({
                message: 'Không tìm thấy Chức vụ'
            })
        }

        const {
            code,
            name,
            status,
        } = req.body

        await position.update({
            code,
            name,
            status,
        })

        res.status(200).json(position)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi cập nhật Chức vụ',
            error
        })
    }
}

export const deletePosition = async (req, res) => {
    try {
        const { id } = req.params
        const position = await Position.findByPk(id)

        if (!position) {
            return res.status(404).json({
                message: 'Không tìm thấy Chức vụ'
            })
        }

        await position.destroy()
        res.status(200).json({
            message: 'Xoá Chức vụ thành công'
        })
    } catch (error) {
        if (
            error.name === 'SequelizeForeignKeyConstraintError' ||
            error.parent?.code === 'ER_ROW_IS_REFERENCED_2'
        ) {
            return res.status(400).json({
                message: 'Không thể xóa chức vụ vì đang có nhân viên thuộc chức vụ này',
            })
        }
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi xoá Chức vụ',
            error
        })
    }
}

export const getAllPositions = async (req, res) => {
    try {
        const position = await Position.findAll()
        res.status(200).json(position)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi lấy danh sách Chức vụ',
            error
        })
    }
}

export const getPositionById = async (req, res) => {
    try {
        const { id } = req.params
        const position = await Position.findByPk(id)

        if (!position) {
            return res.status(404).json({
                message: 'Không tìm thấy Chức vụ'
            })
        }

        res.status(200).json(position)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi lấy Chức vụ',
            error
        })
    }
}