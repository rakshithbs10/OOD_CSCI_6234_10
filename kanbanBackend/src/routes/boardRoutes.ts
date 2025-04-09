import express from 'express'
import {
  createBoard,
  getAllUsersForBoard,
  createColumn,
  getBoardColumns,
  addUserToBoard
} from '../controllers/boardController'

const router = express.Router()

// Create a new board
router.post('/create', createBoard)

// Get all users (for assigning to board)
router.get('/users', getAllUsersForBoard)

// Create a new column for a board
router.post('/column/create', createColumn)

// Get all columns (and tasks) for a board
router.get('/:boardId/columns', getBoardColumns)

// Add a user to a board
router.post('/:boardId/add-member', addUserToBoard)

export default router
