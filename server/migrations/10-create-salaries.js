/** @type {import('sequelize').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('salaries', {
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
    basic_salary: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_bonus: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_deductions: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    advance_amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    taxable_income: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    personal_tax_amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    net_salary: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('salaries')
}