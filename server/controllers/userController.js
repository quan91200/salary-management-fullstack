import db from '../models/index.js'
import bcrypt from 'bcrypt'

const { User } = db
const allowedRoles = ['admin', 'hr', 'ketoan']

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        })

        res.status(200).json({ success: true, data: users })
    } catch (error) {
        console.error("getAllUsers error:", error)
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

export const createUser = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body

        if (!fullname || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" })
        }

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Vai trò không hợp lệ" })
        }

        const existing = await User.findOne({ where: { email } })
        if (existing) {
            return res.status(409).json({ success: false, message: "Email đã tồn tại" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role
        })

        const { password: _, ...safeUser } = newUser.toJSON()

        res.status(201).json({ success: true, message: "Tạo người dùng thành công", data: safeUser })
    } catch (error) {
        console.error("createUser error:", error)
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" })
        }

        res.status(200).json({ success: true, data: user })
    } catch (error) {
        console.error("getUserById error:", error)
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, email, password, role } = req.body

        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" })
        }

        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Vai trò không hợp lệ" })
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined

        await user.update({
            fullname: fullname ?? user.fullname,
            email: email ?? user.email,
            password: hashedPassword ?? user.password,
            role: role ?? user.role
        })

        const { password: _, ...safeUser } = user.toJSON()

        res.status(200).json({ success: true, message: "Cập nhật người dùng thành công", data: safeUser })
    } catch (error) {
        console.error("updateUser error:", error)
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" })
        }

        await user.destroy()

        res.status(200).json({ success: true, message: "Xóa người dùng thành công" })
    } catch (error) {
        console.error("deleteUser error:", error)
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}