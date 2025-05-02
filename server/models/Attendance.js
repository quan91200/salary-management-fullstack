import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Attendance extends Model { }

Attendance.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_work_hours: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0
    },
    work_type: {
        type: DataTypes.ENUM('fulltime', 'parttime'),
        allowNull: false
    },
    work_rule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'work_rules',
            key: 'id'
        }
    },
    earned_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendances',
    timestamps: false
})

Attendance.associate = (models) => {
    Attendance.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee'
    })
    Attendance.belongsTo(models.WorkRule, {
        foreignKey: 'work_rule_id',
        as: 'workRule'
    })
}

export default Attendance