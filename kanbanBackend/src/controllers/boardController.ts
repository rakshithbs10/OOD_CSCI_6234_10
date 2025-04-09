import { Request, Response } from 'express'
import prisma from '../config/db'

// Create a new board
export const createBoard = async (req: Request, res: Response) => {
  const { name, summary, userIds } = req.body

  try {
    const board = await prisma.board.create({
      data: {
        name,
        summary,
        users: {
          connect: userIds.map((id: number) => ({ id })),
        },
      },
      include: { users: true }
    })

    res.status(201).json({ message: 'Board created successfully', board })
  } catch (error) {
    console.error('❌ Error creating board:', error)
    res.status(500).json({ error: 'Failed to create board' })
  }
}

// Get all users
export const getAllUsersForBoard = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: { id: true, username: true, email: true },
    })
    res.json(users)
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// Create a column for a board
export const createColumn = async (req: Request, res: Response) => {
  const { boardId, name } = req.body

  try {
    const column = await prisma.column.create({
      data: { name, boardId }
    })

    res.status(201).json({ message: 'Column created successfully', column })
  } catch (error) {
    console.error('❌ Error creating column:', error)
    res.status(500).json({ error: 'Failed to create column' })
  }
}

// Get all columns and tasks for a board
export const getBoardColumns = async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId)

  try {
    const columns = await prisma.column.findMany({
      where: { boardId },
      include: { tasks: true }
    })

    res.json(columns)
  } catch (error) {
    console.error('❌ Error fetching columns:', error)
    res.status(500).json({ error: 'Failed to fetch columns' })
  }
}

// Add a user to an existing board
export const addUserToBoard = async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId)
  const { userId } = req.body

  try {
    const board = await prisma.board.update({
      where: { id: boardId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: { users: true },
    })

    res.json({ message: 'User added to board', board })
  } catch (error) {
    console.error('❌ Error adding user to board:', error)
    res.status(500).json({ error: 'Failed to add user to board' })
  }
}
