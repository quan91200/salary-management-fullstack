/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('personal_taxes', [
    {
      min_income: 0,
      max_income: 5000000,
      tax_rate: 5,
    },
    {
      min_income: 5000000,
      max_income: 10000000,
      tax_rate: 10,
    },
    {
      min_income: 10000000,
      max_income: 18000000,
      tax_rate: 15,
    },
    {
      min_income: 18000000,
      max_income: 32000000,
      tax_rate: 20,
    },
    {
      min_income: 32000000,
      max_income: 52000000,
      tax_rate: 25,
    },
    {
      min_income: 52000000,
      max_income: 80000000,
      tax_rate: 30,
    },
    {
      min_income: 80000000,
      max_income: 9999999999,
      tax_rate: 35,
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('personal_taxes', null, {});
}