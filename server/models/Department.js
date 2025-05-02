import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Department extends Model { }

Department.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('kích hoạt', 'không kích hoạt'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Department',
    tableName: 'departments',
    timestamps: false
})

Department.associate = (models) => {
    Department.hasMany(models.Employee, {
        foreignKey: 'department_id',
        as: 'employees'
    })
}

export default Department