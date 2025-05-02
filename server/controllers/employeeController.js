import db from '../models/index.js'

const {
    Employee,
    Department,
    Position,
    Salary,
    EmployeeTax
} = db

export async function createEmployee(req, res) {
    try {
        const data = req.body
        const employee = await Employee.create(data)
        res.status(201).json(employee)
    } catch (error) {
        console.error('Error createEmployee:', error)
        res.status(500).json({
            message: 'Tạo nhân viên thất bại',
            error: error.message
        })
    }
}

export async function updateEmployee(req, res) {
    try {
        const { id } = req.params
        const data = req.body

        const employee = await Employee.findByPk(id)
        if (!employee) {
            return res.status(404).json({
                message: 'Không tìm thấy nhân viên'
            })
        }

        await employee.update(data)
        res.status(200).json({
            message: 'Cập nhật nhân viên thành công',
            employee
        })
    } catch (error) {
        console.error('Error updateEmployee:', error)
        res.status(500).json({
            message: 'Cập nhật nhân viên thất bại',
            error: error.message
        })
    }
}

export async function deleteEmployee(req, res) {
    try {
        const { id } = req.params

        const employee = await Employee.findByPk(id)
        if (!employee) {
            return res.status(404).json({
                message: 'Không tìm thấy nhân viên'
            })
        }

        await employee.destroy()
        res.status(200).json({
            message: 'Xóa nhân viên thành công'
        })
    } catch (error) {
        console.error('Error deleteEmployee:', error)
        res.status(500).json({
            message: 'Xóa nhân viên thất bại',
            error: error.message
        })
    }
}

export async function getAllEmployees(req, res) {
    try {
        const employees = await Employee.findAll({
            include: [
                { model: Department, as: 'departments' },
                { model: Position, as: 'positions' },
                { model: Salary, as: 'salary' },
                { model: EmployeeTax, as: 'personal_taxes' }
            ],
            order: [['id', 'ASC']],
        })
        const formatted = employees.map(e => ({
            id: e.id,
            code: e.code || '',
            name: e.name || '',
            type: e.type || 'fulltime',
            phone: e.phone || '',
            email: e.email || '',
            department_id: e.department_id || '',
            department: e.departments || '',
            position_id: e.position_id || '',
            position: e.positions || '',
            default_basic_salary: parseFloat(e.default_basic_salary || 0),
            default_number_of_dependents: parseInt(e.default_number_of_dependents || 0),
        }))

        res.status(200).json(formatted)
    } catch (error) {
        console.error('Error getAllEmployees:', error)
        res.status(500).json({
            message: 'Lấy danh sách nhân viên thất bại',
            error: error.message
        })
    }
}

export async function getEmployeeById(req, res) {
    try {
        const { id } = req.params
        const employee = await Employee.findByPk(id, {
            include: [
                { model: Department, attributes: ['id', 'name'] },
                { model: Position, attributes: ['id', 'name'] },
            ],
        })

        if (!employee) {
            return res.status(404).json({
                message: 'Không tìm thấy nhân viên'
            })
        }

        res.status(200).json(employee)
    } catch (error) {
        console.error('Error getEmployeeById:', error)
        res.status(500).json({
            message: 'Lấy nhân viên thất bại',
            error: error.message
        })
    }
}

export const getEmployees = async (req, res) => {
    const { codes } = req.query

    try {
        if (codes) {
            const employees = await Employee.findAll({
                where: { code: { [Op.in]: codes } }
            })
            return res.json(employees)
        }
        const allEmployees = await Employee.findAll()
        return res.json(allEmployees)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error)
        res.status(500).json({ message: 'Có lỗi khi lấy danh sách nhân viên', error: error.message })
    }
}