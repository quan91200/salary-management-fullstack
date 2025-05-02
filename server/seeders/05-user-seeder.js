import bcrypt from 'bcrypt'

const users = [
  {
    fullname: 'Admin User',
    password: bcrypt.hashSync('123456', 10),
    email: 'admin@kpim.com',
    role: 'admin',
    reset_token: null,
    reset_token_expires: null,
  },
  {
    fullname: 'Nhân sự User',
    password: bcrypt.hashSync('n123456', 10),
    email: 'hr@kpim.com',
    role: 'nhân sự',
    reset_token: null,
    reset_token_expires: null,
  },
  {
    fullname: 'Kế toán User',
    password: bcrypt.hashSync('k123456', 10),
    email: 'accountant@kpim.com',
    role: 'kế toán',
    reset_token: null,
    reset_token_expires: null,
  }
]

export async function up(queryInterface) {
  await queryInterface.bulkInsert('users', users, {})
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('users', {
    email: ['admin@kpim.com', 'hr@kpim.com', 'accountant@kpim.com'],
  }, {})
}