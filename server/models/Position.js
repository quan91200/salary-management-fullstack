import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Position extends Model { }

Position.init({
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
    status: {
        type: DataTypes.ENUM('kích hoạt', 'không kích hoạt'),
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Position',
    tableName: 'positions',
    timestamps: false
})

Position.associate = (models) => {
    Position.hasMany(models.Employee, {
        foreignKey: 'position_id',
        as: 'employee'
    })
}

export default Position