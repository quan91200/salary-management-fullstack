import { Sequelize } from 'sequelize'
import 'dotenv/config'

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || 'mysql',
        dialectOptions: {
            ssl: {
                require: process.env.DB_SSL === 'true',
                rejectUnauthorized: false,
            },
        },
    }
)

export default sequelize