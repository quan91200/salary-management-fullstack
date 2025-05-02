/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('bonuses', [
    {
      code: 'position_bonus',
      name: 'Thưởng chức vụ',
    },
    {
      code: 'project_bonus',
      name: 'Thưởng dự án',
    },
    {
      code: 'contract_bonus',
      name: 'Thưởng hợp đồng',
    },
    {
      code: 'kpi_bonus',
      name: 'Thưởng KPI',
    },
    {
      code: 'other_bonus',
      name: 'Thưởng khác',
    },
    {
      code: 'lunch_allowance',
      name: 'Trợ cấp ăn trưa',
    },
    {
      code: 'transport_allowance',
      name: 'Trợ cấp xăng xe',
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('bonuses', null, {});
}