import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Deduction extends Model { }

Deduction.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Deduction',
    tableName: 'deductions',
    timestamps: false,
})

export default Deduction