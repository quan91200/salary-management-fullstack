export async function up(queryInterface) {
  await queryInterface.bulkInsert('departments', [
    {
      id: 1,
      code: 'hr',
      name: 'Phòng Nhân sự',
      email: 'hr@company.com',
      status: 'kích hoạt',
    },
    {
      id: 2,
      code: 'it',
      name: 'Phòng Công nghệ thông tin',
      email: 'it@company.com',
      status: 'kích hoạt',
    },
    {
      id: 3,
      code: 'fin',
      name: 'Phòng Tài chính',
      email: 'finance@company.com',
      status: 'kích hoạt',
    },
  ], {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('departments', {
    code: ['HR', 'IT', 'FIN'],
  }, {});
}