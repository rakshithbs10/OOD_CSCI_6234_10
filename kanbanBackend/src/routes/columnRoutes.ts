import express from 'express'
import { renameColumn, deleteColumn } from '../controllers/columnController'

const router = express.Router()

router.put('/:columnId/rename', renameColumn)
router.delete('/:columnId', deleteColumn)

export default router
