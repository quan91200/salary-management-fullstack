export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('bonuses', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('bonuses')
}