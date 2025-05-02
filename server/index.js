import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import sequelize from './config/database.js'

import authRouter from './routes/authRoutes.js'
import employrRouter from './routes/employeeRoutes.js'
import departmentRouter from './routes/departmentRoutes.js'
import positionRouter from './routes/positionRoutes.js'
import advanceRouter from './routes/advanceRoutes.js'
import bonusesRouter from './routes/bonusRoutes.js'
import employeeBonusRouter from './routes/employeeBonusRoutes.js'
import salaryRouter from './routes/salaryRoutes.js'
import deductionRouter from './routes/deductionRoutes.js'
import employeeTaxRouter from './routes/employeeTaxRoutes.js'
import workRuleRouter from './routes/workRuleRoutes.js'
import attendanceRouter from './routes/attendanceRoute.js'

sequelize.authenticate()
    .then(() => {
        console.log(`Database connected port: ${process.env.DB_PORT}`)
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err)
    })

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/employees', employrRouter)
app.use('/api/departments', departmentRouter)
app.use('/api/positions', positionRouter)
app.use('/api/advances', advanceRouter)
app.use('/api/bonuses', bonusesRouter)
app.use('/api/employee-bonus', employeeBonusRouter)
app.use('/api/salaries', salaryRouter)
app.use('/api/deductions', deductionRouter)
app.use('/api/employee-tax', employeeTaxRouter)
app.use('/api/work-rule', workRuleRouter)
app.use('/api/attendance', attendanceRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})