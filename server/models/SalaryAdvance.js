import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class SalaryAdvance extends Model { }

SalaryAdvance.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
    },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: 'SalaryAdvance',
    tableName: 'salary_advances',
    timestamps: false,
})

SalaryAdvance.associate = (models) => {
    SalaryAdvance.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee',
    })
}

export default SalaryAdvance