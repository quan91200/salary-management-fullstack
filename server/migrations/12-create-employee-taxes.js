export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('employee_taxes', {
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
    gross_income: { // tổng thu nhập chịu thuế (trước giảm trừ)
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    personal_deduction: { // giảm trừ người nộp thuế
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 11000000,
    },
    dependent_deduction_per_person: { // giảm trừ mỗi người phụ thuộc
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 4400000,
    },
    number_of_dependents: { // số người phụ thuộc
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    taxable_income: { // thu nhập sau giảm trừ
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    tax_amount: { // số tiền thuế phải nộp
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('employee_taxes')
}