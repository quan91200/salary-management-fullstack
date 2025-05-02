import db from '../models/index.js'
import { Op } from 'sequelize'
const {
  Employee,
  EmployeeBonus,
  Deduction,
  EmployeeTax,
  PersonalTax,
} = db

export const getAllEmployeeTaxes = async (req, res) => {
  try {
    const employeeTaxes = await EmployeeTax.findAll({
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name', 'code'] }
      ],
      order: [['year', 'DESC'], ['month', 'DESC'], ['employee_id', 'ASC']]
    })

    const formatted = employeeTaxes.map(tax => ({
      id: tax.id,
      employee_id: tax.employee_id,
      employee_name: tax.employee?.name || '',
      employee_code: tax.employee?.code || '',
      month: tax.month,
      year: tax.year,
      gross_income: parseFloat(tax.gross_income || 0),
      personal_deduction: parseFloat(tax.personal_deduction || 0),
      dependent_deduction_per_person: parseFloat(tax.dependent_deduction_per_person || 0),
      number_of_dependents: tax.number_of_dependents,
      taxable_income: parseFloat(tax.taxable_income || 0),
      tax_amount: parseFloat(tax.tax_amount || 0),
    }))

    res.json(formatted)
  } catch (error) {
    console.error('Lỗi lấy danh sách thuế TNCN:', error)
    res.status(500).json({ message: 'Có lỗi xảy ra', error: error.message })
  }
}

export const generateEmployeeTax = async (req, res) => {
  const { month, year } = req.body

  if (!month || !year) {
    return res.status(400).json({ message: 'Thiếu thông tin tháng hoặc năm' })
  }
  try {
    const existingTaxes = await EmployeeTax.findAll({ where: { month, year } })

    if (existingTaxes.length > 0) {
      await EmployeeTax.destroy({ where: { month, year } })
      console.log(`Đã xóa thuế cũ cho tháng ${month} năm ${year}`)
    }

    const employees = await Employee.findAll()

    const bonuses = await EmployeeBonus.findAll({
      where: { month, year }
    })

    const deductions = await Deduction.findAll()
    const totalDeductionPercent = deductions.reduce((sum, d) => sum + parseFloat(d.percentage), 0)

    const findTaxRate = async (income) => {
      const matchingBracket = await PersonalTax.findOne({
        where: {
          min_income: { [Op.lte]: income },
          max_income: { [Op.gte]: income }
        }
      })
      return matchingBracket ? parseFloat(matchingBracket.tax_rate) / 100 : 0
    }

    const employeeTaxes = await Promise.all(employees.map(async (employee) => {
      const employeeBonuses = bonuses.filter(b => b.employee_id === employee.id)

      const totalBonus = employeeBonuses.reduce((sum, b) => sum + parseFloat(b.amount), 0)

      const grossIncome = parseFloat(employee.default_basic_salary || 0) + totalBonus

      const compulsoryInsurance = grossIncome * (totalDeductionPercent / 100)

      console.log(`Gross Income: ${grossIncome}, Total Deduction Percent: 
        ${totalDeductionPercent}, Compulsory Insurance: ${compulsoryInsurance}`)

      const personalDeduction = 11000000
      const dependentDeductionPerPerson = 4400000
      const numberOfDependents = employee.default_number_of_dependents ?? 0

      const taxableIncome =
        grossIncome - personalDeduction
        - (dependentDeductionPerPerson * numberOfDependents)
        - compulsoryInsurance

      const taxableIncomeFinal = taxableIncome > 0 ? taxableIncome : 0

      const taxRate = await findTaxRate(taxableIncomeFinal)
      const taxAmount = taxableIncomeFinal > 0 ? taxableIncomeFinal * taxRate : 0

      return {
        employee_id: employee.id,
        month,
        year,
        gross_income: parseFloat(grossIncome),
        personal_deduction: parseFloat(personalDeduction),
        dependent_deduction_per_person: parseFloat(dependentDeductionPerPerson * numberOfDependents),
        number_of_dependents: parseInt(numberOfDependents),
        taxable_income: parseFloat(taxableIncomeFinal),
        tax_amount: parseFloat(taxAmount),
      }
    }))

    const createdTaxes = await EmployeeTax.bulkCreate(employeeTaxes)

    res.status(201).json(createdTaxes)
  } catch (error) {
    console.error('Error generating employee taxes:', error)
    res.status(500).json({ message: 'Có lỗi khi tạo thuế', error: error.message })
  }
}

export const createEmployeeTaxByMonthYear = async (req, res) => {
  const { employee_id, month, year, number_of_dependents } = req.body

  if (!employee_id || !month || !year) {
    return res.status(400).json({ message: 'Thiếu thông tin nhân viên, tháng hoặc năm' })
  }

  try {
    const employee = await Employee.findByPk(employee_id)
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' })
    }

    let dependents = number_of_dependents
    if (dependents === undefined || dependents === null) {
      dependents = parseInt(employee.default_number_of_dependents || 0)
    } else {
      dependents = parseInt(dependents)
      await employee.update({ default_number_of_dependents: dependents })
    }

    const deductions = await Deduction.findAll()
    const totalDeductionPercent = deductions.reduce((sum, d) => sum + parseFloat(d.percentage), 0)

    const gross_income = parseFloat(employee.default_basic_salary || 0)
    const personal_deduction = 11000000
    const dependent_deduction_per_person = 4400000

    const insurance = gross_income * (totalDeductionPercent / 100)

    const taxable_income_raw = gross_income - personal_deduction - (dependent_deduction_per_person * dependents) - insurance
    const taxable_income = taxable_income_raw > 0 ? taxable_income_raw : 0

    const personalTaxes = await PersonalTax.findAll()
    const applicableTax = personalTaxes.find(tax => taxable_income >= tax.min_income && taxable_income <= tax.max_income)
    const taxRate = applicableTax ? (parseFloat(applicableTax.tax_rate) / 100) : 0
    const tax_amount = taxable_income * taxRate

    const existingTax = await EmployeeTax.findOne({ where: { employee_id, month, year } })
    console.log(existingTax)
    if (existingTax) {
      await existingTax.update({
        gross_income,
        personal_deduction,
        dependent_deduction_per_person: (dependent_deduction_per_person * dependents),
        number_of_dependents: dependents,
        taxable_income,
        tax_amount,
      })
      return res.status(200).json(existingTax)
    } else {
      const employeeTax = await EmployeeTax.create({
        employee_id,
        month,
        year,
        gross_income,
        personal_deduction,
        dependent_deduction_per_person: (dependent_deduction_per_person * dependents),
        number_of_dependents: dependents,
        taxable_income,
        tax_amount,
      })
      return res.status(201).json(employeeTax)
    }
  } catch (error) {
    console.error('Lỗi khi tạo thuế cho nhân viên:', error)
    res.status(500).json({ message: 'Có lỗi khi tạo thuế cho nhân viên', error: error.message })
  }
}

export const deleteEmployeeTaxes = async (req, res) => {
  const {
    month,
    year,
    employee_code,
    employee_codes,
    from_month,
    to_month,
    from_year,
    to_year,
    confirm
  } = req.query

  try {
    const whereCondition = {}

    if (month && year) {
      whereCondition.month = month
      whereCondition.year = year
    }

    if (from_month && to_month) whereCondition.month = {
      [Op.between]: [from_month, to_month]
    }
    if (from_year && to_year) whereCondition.year = {
      [Op.between]: [from_year, to_year]
    }

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

    if (Object.keys(whereCondition).length === 0 && confirm !== 'true') {
      return res.status(400).json({
        message: 'Không có điều kiện lọc. Nếu muốn xóa toàn bộ, hãy thêm confirm=true vào query.'
      })
    }

    if (Object.keys(whereCondition).length === 0 && confirm === 'true') {
      await EmployeeTax.destroy({
        truncate: true
      })
      return res.json({ message: 'Đã xóa toàn bộ bản ghi thành công.' })
    }

    const deletedCount = await EmployeeTax.destroy({
      where: whereCondition
    })

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi phù hợp để xóa.' })
    }

    res.json({ message: `Đã xóa ${deletedCount} bản ghi thành công.` })
  } catch (error) {
    console.error('Lỗi khi xóa thuế:', error)
    res.status(500).json({ message: 'Có lỗi khi xóa thuế', error: error.message })
  }
}
