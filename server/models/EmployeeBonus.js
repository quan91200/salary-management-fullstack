import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class EmployeeBonus extends Model { }

EmployeeBonus.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bonus_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
}, {
  sequelize,
  modelName: 'EmployeeBonus',
  tableName: 'employee_bonuses',
  timestamps: false
})
EmployeeBonus.associate = (models) => {
  EmployeeBonus.belongsTo(models.Employee, {
    foreignKey: 'employee_id',
    as: 'employee',
  })
  EmployeeBonus.belongsTo(models.Bonus, {
    foreignKey: 'bonus_id',
    as: 'bonus'
  })
}

export default EmployeeBonus