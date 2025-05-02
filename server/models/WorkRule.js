import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class WorkRule extends Model { }

WorkRule.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  work_type: {
    type: DataTypes.ENUM('fulltime', 'parttime'),
    allowNull: false
  },
  min_work_hours: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 160
  },
}, {
  sequelize,
  modelName: 'WorkRule',
  tableName: 'work_rules',
  timestamps: false
})

export default WorkRule