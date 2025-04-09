import { Request, Response } from 'express'
import prisma from '../config/db'

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const {
    title,
    description,
    acceptanceCriteria,
    storyPoints,
    difficulty,
    createdBy,
    assignedTo,
    verifier,
    boardId,
    columnId,
    verified,
    completed,
    attachment
  } = req.body

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        acceptanceCriteria,
        storyPoints,
        difficulty,
        verified: verified ?? false,
        completed: completed ?? false,
        attachment,
        createdBy,
        assignedTo,
        verifier,
        board: { connect: { id: boardId } },
        column: { connect: { id: columnId } }
      },
    })

    res.status(201).json({ message: 'Task created successfully', task })
  } catch (error) {
    console.error('❌ Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
}

// Update an existing task
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params
  const updates = req.body

  try {
    const updated = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updates
    })

    res.json({ message: 'Task updated successfully', task: updated })
  } catch (error) {
    console.error('❌ Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
}

// Move task to another column
export const moveTask = async (req: Request, res: Response) => {
  const { taskId, targetColumnId } = req.body

  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        column: { connect: { id: targetColumnId } }
      }
    })

    res.json({ message: 'Task moved successfully', task })
  } catch (error) {
    console.error('❌ Error moving task:', error)
    res.status(500).json({ error: 'Failed to move task' })
  }
}
