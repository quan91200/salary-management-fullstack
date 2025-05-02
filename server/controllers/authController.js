import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../models/index.js'
import dotenv from 'dotenv'
import { Op } from 'sequelize'

dotenv.config()
const { User } = db

const allowedRoles = ['admin', 'nhân sự', 'kế toán']

// Tạo token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
    )
}

// Đăng ký
export const register = async (req, res) => {
    try {
        const { email, password, fullname, role } = req.body
        console.log("Dữ liệu nhận được từ client:", req.body)

        if (!email || !password || !fullname || !role) {
            return res.status(400).json({ success: false, message: "Vui lòng không để trống" })
        }

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Vai trò không hợp lệ" })
        }

        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email đã tồn tại." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role
        })

        const token = generateToken(newUser)

        return res.status(201).json({
            success: true,
            message: "Tạo tài khoản thành công!",
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                fullname: newUser.fullname,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error("Register error:", error)
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        })
    }
}

// Đăng nhập
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin."
            })
        }

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Tài khoản chưa đăng ký"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng"
            })
        }

        const token = generateToken(user)

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            token,
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi, vui lòng thử lại sau."
        })
    }
}

// Verify token
export const verify = (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    })
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' })
        }

        const token = Math.random().toString(36).substr(2)
        const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 phút

        user.reset_token = token
        user.reset_token_expires = expires
        await user.save()

        const resetLink = `http://localhost:5173/reset-password?token=${token}`

        console.log(`Reset link: ${resetLink}`)

        res.json({ message: 'Đã gửi liên kết đặt lại mật khẩu qua email' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body

    try {
        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expires: {
                    [Op.gt]: new Date() // chưa hết hạn
                }
            }
        })

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
        }

        const hashed = await bcrypt.hash(newPassword, 10)
        user.password = hashed
        user.reset_token = null
        user.reset_token_expires = null

        await user.save()
        res.json({ message: 'Đặt lại mật khẩu thành công' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Lỗi server' })
    }
}