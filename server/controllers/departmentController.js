import db from '../models/index.js'

const { Department } = db

export const createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body)

        res.status(201).json(department)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Có lỗi khi tạo Phòng ban',
            error
        })
    }
}

export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll()
        res.status(200).json(departments)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi lấy danh sách phòng ban',
            error
        })
    }
}

export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params
        const department = await Department.findByPk(id)

        if (!department) {
            return res.status(404).json({ message: 'Không tìm thấy phòng ban' })
        }

        res.status(200).json(department)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi lấy phòng ban',
            error
        })
    }
}

export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const department = await Department.findByPk(id)

        if (!department) {
            return res.status(404).json({ message: 'Không tìm thấy phòng ban' })
        }

        const {
            code,
            name,
            email,
            status
        } = req.body

        await department.update({
            code,
            name,
            email,
            status
        })

        res.status(200).json(department)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi cập nhật phòng ban',
            error
        })
    }
}

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const department = await Department.findByPk(id)

        if (!department) {
            return res.status(404).json({ message: 'Không tìm thấy phòng ban' })
        }

        await department.destroy()
        res.status(200).json({ message: 'Xoá phòng ban thành công' })
    } catch (error) {
        if (
            error.name === 'SequelizeForeignKeyConstraintError' ||
            error.parent?.code === 'ER_ROW_IS_REFERENCED_2'
        ) {
            return res.status(400).json({
                message: 'Không thể xóa phòng ban vì đang có nhân viên thuộc phòng ban này',
            })
        }
        console.error(error)
        res.status(500).json({
            message: 'Có lỗi khi xoá phòng ban',
            error
        })
    }
}