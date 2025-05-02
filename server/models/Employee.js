import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Employees extends Model { }

Employees.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('fulltime', 'parttime'),
        allowNull: false,
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    position_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    default_basic_salary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    default_number_of_dependents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: false
})

Employees.associate = (models) => {
    Employees.belongsTo(models.Department, {
        foreignKey: 'department_id',
        as: 'departments'
    })
    Employees.belongsTo(models.Position, {
        foreignKey: 'position_id',
        as: 'positions'
    })
    Employees.hasMany(models.Salary, {
        foreignKey: 'employee_id',
        as: 'salary',
    })
    Employees.hasOne(models.EmployeeTax, {
        foreignKey: 'employee_id',
        as: 'personal_taxes'
    })
}

export default Employees