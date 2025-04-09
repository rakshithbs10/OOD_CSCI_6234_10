import express from 'express'
import {
  createTask,
  updateTask,
  moveTask
} from '../controllers/taskController'

const router = express.Router()

// Create a new task
router.post('/create', createTask)

// Update an existing task
router.put('/:id/update', updateTask)

// Move a task to a different column
router.post('/move', moveTask)

export default router
