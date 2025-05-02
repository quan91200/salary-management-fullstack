/** @type {import('sequelize').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('work_rules', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    min_work_hours: {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: false,
    },
    work_type: {
      type: Sequelize.ENUM('fulltime', 'parttime'),
      allowNull: false
    }
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('work_rules')
}