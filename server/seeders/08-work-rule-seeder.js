export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('work_rules', [
    {
      name: 'Tính lương nhân viên full-time',
      work_type: 'fulltime',
      min_work_hours: 160,
    },
    {
      name: 'Tính lương nhân viên part-time',
      work_type: 'parttime',
      min_work_hours: 80,
    }
  ])
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('work_rules', null, {})
}