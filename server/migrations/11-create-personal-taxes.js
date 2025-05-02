/** @type {import('sequelize').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('personal_taxes', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    min_income: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
    },
    max_income: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
    },
    tax_rate: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('personal_taxes')
}