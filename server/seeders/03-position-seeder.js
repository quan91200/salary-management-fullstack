export async function up(queryInterface) {
  await queryInterface.bulkInsert('positions', [
    {
      id: 1,
      code: 'dev',
      name: 'Lập trình viên',
      status: 'kích hoạt',
    },
    {
      id: 2,
      code: 'pm',
      name: 'Quản lý dự án',
      status: 'kích hoạt',
    },
    {
      id: 3,
      code: 'acc',
      name: 'Kế toán',
      status: 'kích hoạt',
    },
  ], {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('positions', {
    code: ['dev', 'pm', 'acc'],
  }, {});
}