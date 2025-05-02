import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import sequelize from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const db = {}

const files = fs.readdirSync(__dirname).filter((file) =>
    file.endsWith('.js') && file !== 'index.js'
)

async function loadModels() {
    for (const file of files) {
        const modelPath = pathToFileURL(path.join(__dirname, file)).href
        const modelModule = await import(modelPath)
        const model = modelModule.default
        db[model.name] = model
    }
    console.log("Loaded models:", Object.keys(db))
    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db)
        }
    })

    db.sequelize = sequelize
    db.Sequelize = sequelize.Sequelize

    console.log("All models have been loaded successfully.")
}

await loadModels()

export default db