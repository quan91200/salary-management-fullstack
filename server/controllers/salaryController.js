import db from '../models/index.js'
const {
    Employee,
    Salary,
    EmployeeBonus,
    SalaryAdvance,
    Deduction,
    EmployeeTax,
} = db
import { Op } from 'sequelize'

export const generateSalary = async (req, res) => {
    const { month, year } = req.body

    if (!month || !year) {
        return res.status(400).json({ message: 'Thiếu thông tin tháng hoặc năm' })
    }

    try {
        const employees = await Employee.findAll()
        const bonuses = await EmployeeBonus.findAll({ where: { month, year } })
        const advances = await SalaryAdvance.findAll({ where: { month, year } })
        const taxes = await EmployeeTax.findAll({ where: { month, year } })
        const deductions = await Deduction.findAll()

        const totalDeductionPercent = deductions.reduce((sum, d) => sum + parseFloat(d.percentage), 0)

        const salaries = await Promise.all(employees.map(async (employee) => {
            const employeeBonuses = bonuses.filter(b => b.employee_id === employee.id)
            const employeeAdvance = advances.find(a => a.employee_id === employee.id)
            const employeeTax = taxes.find(t => t.employee_id === employee.id)

            const totalBonus = employeeBonuses.reduce((sum, b) => sum + parseFloat(b.amount), 0)
            const basicSalary = parseFloat(employee.default_basic_salary || 0)

            const grossIncome = basicSalary + totalBonus
            const deductionAmount = grossIncome * (totalDeductionPercent / 100)
            const advanceAmount = parseFloat(employeeAdvance?.amount || 0)
            const taxAmount = parseFloat(employeeTax?.tax_amount || 0)
            const numberOfDependents = employeeTax?.number_of_dependents ?? employee.default_number_of_dependents

            const netSalary = grossIncome - deductionAmount - advanceAmount - taxAmount

            return {
                employee_id: employee.id,
                month,
                year,
                basic_salary: basicSalary,
                total_bonus: totalBonus,
                total_deductions: deductionAmount,
                advance_amount: advanceAmount,
                taxable_income: parseFloat(employeeTax?.taxable_income || 0),
                personal_tax_amount: taxAmount,
                number_of_dependents: numberOfDependents,
                net_salary: netSalary > 0 ? netSalary : 0,
            }
        }))

        await Salary.destroy({ where: { month, year } })

        const createdSalaries = await Salary.bulkCreate(salaries)

        res.status(201).json(createdSalaries)
    } catch (error) {
        console.error('Lỗi khi tạo bảng lương:', error)
        res.status(500).json({ message: 'Có lỗi khi tạo bảng lương', error: error.message })
    }
}

export const getAllSalary = async (req, res) => {
    try {
        const salaries = await Salary.findAll({
            include: [
                { model: Employee, as: 'employee' }
            ],
            order: [['id', 'ASC']]
        })
        res.status(200).json(salaries)
    } catch (error) {
        console.error('Error getAllEmployees:', error)
        res.status(500).json({
            message: 'Lấy danh sách salaries thất bại',
            error: error.message
        })
    }
}

export const deleteSalary = async (req, res) => {
    try {
        const { employee_code, employee_codes, month, year, confirm } = req.query

        const whereCondition = {}

        if (employee_code) {
            const employee = await Employee.findOne({ where: { code: employee_code } })
            if (employee) {
                whereCondition.employee_id = employee.id
            }
        }

        if (employee_codes) {
            const codesArray = employee_codes.split(',')
            const employees = await Employee.findAll({
                where: { code: { [Op.in]: codesArray } }
            })
            const employeeIds = employees.map(emp => emp.id)

            whereCondition.employee_id = { [Op.in]: employeeIds }
        }

        if (month && year) {
            whereCondition.month = Number(month)
            whereCondition.year = Number(year)
        }

        if (confirm) {
            await Salary.destroy({ where: {} })
            return res.status(200).json({ message: 'Xóa toàn bộ dữ liệu lương thành công!' })
        }

        if (Object.keys(whereCondition).length === 0) {
            return res.status(400).json({ message: 'Không có điều kiện để xóa!' })
        }

        await Salary.destroy({ where: whereCondition })

        res.status(200).json({ message: 'Xóa dữ liệu lương thành công!' })
    } catch (error) {
        console.error('Lỗi khi xóa lương:', error)
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa lương.' })
    }
}

export const getSalaryDataForMonthYear = async (month, year, employeeId) => {
    try {
        const salaryData = await Salary.findOne({
            where: {
                month: month,
                year: year,
                employee_id: employeeId
            }
        });
        return salaryData
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu lương:', error)
        throw new Error('Không thể lấy dữ liệu lương')
    }
}