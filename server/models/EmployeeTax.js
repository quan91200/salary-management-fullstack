import { DataTypes, Model } from "sequelize"
import sequelize from '../config/database.js'

class EmployeeTax extends Model { }

EmployeeTax.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.INTEGER, allowNull: false },
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  gross_income: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  personal_deduction: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 11000000 },
  dependent_deduction_per_person: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 4400000 },
  number_of_dependents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  taxable_income: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
  tax_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
}, {
  sequelize,
  modelName: 'EmployeeTax',
  tableName: 'employee_taxes',
  timestamps: false,
})

EmployeeTax.associate = (models) => {
  EmployeeTax.belongsTo(models.Employee, {
    foreignKey: 'employee_id',
    as: 'employee',
  })
}

export default EmployeeTax