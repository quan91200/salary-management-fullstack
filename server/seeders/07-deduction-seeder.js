/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('deductions', [
    {
      code: 'BHXH',
      name: 'Bảo hiểm xã hội',
      percentage: 8.0, // 8%
    },
    {
      code: 'BHYT',
      name: 'Bảo hiểm y tế',
      percentage: 1.5, // 1.5%
    },
    {
      code: 'BHTN',
      name: 'Bảo hiểm thất nghiệp',
      percentage: 1.0, // 1%
    },
    {
      code: 'UNPAID_LEAVE',
      name: 'Trừ lương nghỉ không lương',
      percentage: 0, // sẽ tính theo số ngày
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('deductions', null, {});
}