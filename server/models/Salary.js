import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Salary extends Model { }

Salary.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    basic_salary: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    total_bonus: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    total_deductions: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    advance_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    taxable_income: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    personal_tax_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    net_salary: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
}, {
    sequelize,
    modelName: 'Salary',
    tableName: 'salaries',
    timestamps: false,
})

Salary.associate = (models) => {
    Salary.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee',
    })
}

export default Salary