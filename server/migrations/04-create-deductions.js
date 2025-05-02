export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('deductions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    percentage: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('deductions')
}