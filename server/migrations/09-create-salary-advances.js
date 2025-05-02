export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('salary_advances', {
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
    amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    month: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 2000,
      },
    },
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('salary_advances')
}