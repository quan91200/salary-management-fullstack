import db from '../models/index.js'
import { Op } from 'sequelize'

const { PersonalIncomeTax, Deduction, Employees, sequelize } = db

export const createPersonalIncomeTax = async (req, res) => {
    const {
        employee_id,
        taxable_income,
        dependents,
        personal_deduction,
        dependent_deduction,
        deduction_rate,
        deducted_amount,
        tax_amount,
        deduction_id,
        insurance
    } = req.body

    try {
        const deductionIds = deduction_id.split(',').map(id => id.trim())

        const deductions = await Deduction.findAll({
            where: {
                id: {
                    [Op.in]: deductionIds
                }
            }
        })
        if (deductions.length === 0) {
            return res.status(400).json({ message: 'Không tìm thấy khoản khấu trừ nào với id đã chọn.' })
        }

        const missingId = await getNextAvailableId('personal_income_taxes', sequelize)

        const tax = await PersonalIncomeTax.create({
            id: missingId,
            employee_id,
            taxable_income,
            dependents,
            personal_deduction,
            dependent_deduction,
            deduction_rate,
            deducted_amount,
            tax_amount,
            deduction_id,
            insurance
        })

        const result = await PersonalIncomeTax.findByPk(tax.id, {
            include: [
                {
                    model: Employees,
                    as: 'employees',
                    attributes: ['id', 'code', 'name'],
                },
            ]
        })

        return res.status(201).json(result)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const updatePersonalIncomeTax = async (req, res) => {
    const { employee_id } = req.params
    const {
        taxable_income,
        dependents,
        personal_deduction,
        dependent_deduction,
        deducted_amount,
        deduction_rate,
        tax_amount,
        deduction_id,
        insurance
    } = req.body

    try {
        const personalIncomeTax = await PersonalIncomeTax.findOne(
            {
                where: {
                    employee_id
                }
            }
        )

        if (!personalIncomeTax) {
            return res.status(404).json({ message: 'Personal Income Tax not found for this employee' })
        }

        await personalIncomeTax.update({
            taxable_income,
            dependents,
            personal_deduction,
            dependent_deduction,
            deducted_amount,
            tax_amount,
            deduction_id,
            deduction_rate,
            insurance
        })

        const result = await PersonalIncomeTax.findByPk(personalIncomeTax.id, {
            include: [
                {
                    model: Employees,
                    as: 'employees',
                    attributes: ['id', 'code', 'name'],
                },
            ]
        })

        return res.status(200).json(result)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const deletePersonalIncomeTax = async (req, res) => {
    const { employee_id } = req.params

    console.log(`Received employee_id: ${employee_id}`)

    if (!employee_id) {
        return res.status(400).json({ message: 'Employee ID is required' })
    }

    try {
        const personalIncomeTax = await PersonalIncomeTax.findOne({ where: { employee_id } })

        if (!personalIncomeTax) {
            return res.status(404).json({ message: 'Personal Income Tax not found for this employee' })
        }

        await personalIncomeTax.destroy()

        return res.status(200).json({
            message: 'Personal Income Tax deleted successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getAllPersonalIncomeTax = async (req, res) => {
    try {
        const taxes = await PersonalIncomeTax.findAll({
            include: [
                {
                    model: Employees,
                    as: 'employees',
                    where: { type: 'fulltime' },
                },
            ],
            order: [['id', 'DESC']]
        })

        return res.status(200).json(taxes)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getPersonalIncomeTaxByEmployee = async (req, res) => {
    const { employee_id } = req.params
    try {
        const personalIncomeTax = await PersonalIncomeTax.findOne({
            where: { employee_id },
            include: [
                {
                    model: Employees,
                    as: 'employees',
                    attributes: ['id', 'code', 'name'],
                },
            ]
        })

        if (!personalIncomeTax) {
            return res.status(404).json({ message: 'Personal Income Tax not found for this employee' })
        }

        return res.status(200).json(personalIncomeTax)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}