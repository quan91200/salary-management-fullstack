/** @type {import('sequelize').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('employees', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type: {
      type: Sequelize.ENUM('fulltime', 'parttime'),
      allowNull: false,
    },
    department_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    position_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'positions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    default_basic_salary: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
    },
    default_number_of_dependents: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('employees')
}