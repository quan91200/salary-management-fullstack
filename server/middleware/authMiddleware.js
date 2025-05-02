import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '../models/index.js'

dotenv.config()
const { User } = db

// Kiểm tra người dùng đã đăng nhập hay chưa
const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token không được cung cấp."
            })
        }

        const token = authHeader.split(" ")[1]
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: "Token không hợp lệ hoặc đã hết hạn."
            })
        }

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng."
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.error("verifyUser error:", error)
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ.",
            error: error.message
        })
    }
}

// Phân quyền theo vai trò
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền truy cập."
            })
        }
        next()
    }
}

export { verifyUser, authorizeRoles }