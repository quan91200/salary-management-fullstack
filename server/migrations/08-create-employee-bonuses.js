/** @type {import('sequelize').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('employee_bonuses', {
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
    bonus_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'bonuses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: null,
    },
    month: { type: Sequelize.INTEGER, allowNull: false },
    year: { type: Sequelize.INTEGER, allowNull: false },
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('employee_bonuses')
}