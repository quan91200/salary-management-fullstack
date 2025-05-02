/** @type {import('sequelize').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('attendances', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    employee_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    month: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    total_work_hours: {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: false,
    },
    work_type: {
      type: Sequelize.ENUM('fulltime', 'parttime'),
      allowNull: false
    },
    work_rule_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'work_rules',
        key: 'id'
      }
    },
    earned_amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    }
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('attendances')
}