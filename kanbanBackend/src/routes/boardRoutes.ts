import express from 'express'
import {
  createBoard,
  getAllUsersForBoard,
  createColumn,
  getBoardColumns,
  getAllBoardsForUser,
  addUserToBoard,
  getUsersByBoardId,
  getBoardById,
  removeMemberFromBoard,
  softDeleteBoard,
  searchBoards
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

// Get all boards a user is part of
router.get('/user/:userId/boards', getAllBoardsForUser)

router.get('/boards/:boardId/users', getUsersByBoardId)


router.get('/board/:boardId', getBoardById)

router.put('/:boardId/remove-member', removeMemberFromBoard)
router.put('/:boardId/delete', softDeleteBoard)

router.get('/search', searchBoards)



export default router
