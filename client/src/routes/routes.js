import config from '../config/index.js'

import Layout from '../layouts/Layout'

import {
    Employee,
    Department,
    Position,
    Deduction,
    Salary,
} from '../pages/Dashboard/index.js'

import {
    Bonus,
    WorkRule,
    Advance,
    Tax,
    Attendance
} from '../pages/Profesion/index.js'

import Total from '../pages/Report/Total.jsx'
import Note from '../pages/Report/Note.jsx'
import Book from '../pages/Report/Book.jsx'

import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'

const publicRoutes = [
    { path: config.routes.login, component: Login },
    { path: config.routes.register, component: Register },
]

const privateRoutes = [
    { path: config.routes.employee, component: Employee, layout: Layout },
    { path: config.routes.department, component: Department, layout: Layout },
    { path: config.routes.position, component: Position, layout: Layout },
    { path: config.routes.deduction, component: Deduction, layout: Layout },
    { path: config.routes.salary, component: Salary, layout: Layout },
    { path: config.routes.bonus, component: Bonus, layout: Layout },
    { path: config.routes.workrule, component: WorkRule, layout: Layout },
    { path: config.routes.attendance, component: Attendance, layout: Layout },
    { path: config.routes.advance, component: Advance, layout: Layout },
    { path: config.routes.tax, component: Tax, layout: Layout },

    { path: config.routes.total, component: Total, layout: Layout },
    { path: config.routes.note, component: Note, layout: Layout },
    { path: config.routes.book, component: Book, layout: Layout },
]

export { publicRoutes, privateRoutes }