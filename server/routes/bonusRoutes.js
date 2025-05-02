import express from 'express'
import {
    createBonus,
    getAllBonuses,
    getBonusById,
    updateBonus,
    deleteBonus
} from '../controllers/bonusController.js'

const router = express.Router()

router.post('/', createBonus)
router.get('/', getAllBonuses)
router.get('/:code', getBonusById)
router.put('/:code', updateBonus)
router.delete('/:code', deleteBonus)

export default router