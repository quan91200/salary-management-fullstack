export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('positions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('kích hoạt', 'không kích hoạt'),
      allowNull: false
    }
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('positions')
}