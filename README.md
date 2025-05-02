server: `npm start` PORT=5004
client: `npm run dev` PORT=5173

migrations: `npx sequelize-cli db:migrate`

create: `npx sequelize-cli migration:generate --name create-user`

drop: `npx sequelize-cli db:migrate:undo:all`

seeders: `npx sequelize-cli db:seed:all`

create: `npx sequelize-cli seed:generate --name create-seed`
        `npx sequelize-cli db:seed --seed 1-bonus-types-seeder.js`

drop: `npx sequelize-cli db:seed:undo:all`
      `npx sequelize-cli db:seed:undo --seed 1-bonus-types-seeder.js`

### Hệ thống quản lý lương nhân viên:

-User/Admin/Authentication/Authorization: `User`

-Dữ liệu nền tảng: `Departments, Positions, Employees`

-Lương & cấu phần: `Salary, Advance`

-Thưởng: `Bonus, EmployeeBonus`

-Thuế: `PersonalTax, EmployeeTax`

-Tính lương: `WorkRule`

-Chấm công: `Attendance`

-Báo cáo: `Report` - Frontend

### Seed:

`User`: 
```
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
```

### Excel:
- attendance_sample.xlsx ('./attendance_sample.xlsx')
- danh_sach_nhan_su.xlsx ('./danh_sach_nhan_su.xlsx')