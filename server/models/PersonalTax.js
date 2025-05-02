import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class PersonalTax extends Model { }

PersonalTax.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    min_income: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    max_income: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    tax_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false, defaultValue: 0
    },
}, {
    sequelize,
    modelName: 'PersonalTax',
    tableName: 'personal_taxes',
    timestamps: false,
})

export default PersonalTax