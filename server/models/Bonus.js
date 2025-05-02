import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Bonus extends Model { }

Bonus.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, {
    sequelize,
    modelName: 'Bonus',
    tableName: 'bonuses',
    timestamps: false
})

Bonus.associate = (models) => {
    Bonus.hasMany(models.EmployeeBonus, {
        foreignKey: 'bonus_id',
        as: 'employee_bonus'
    })
}

export default Bonus