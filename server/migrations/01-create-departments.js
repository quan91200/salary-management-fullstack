export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('departments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('kích hoạt', 'không kích hoạt'),
      allowNull: false,
      defaultValue: 'kích hoạt',
    }
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('departments')
}