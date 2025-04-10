import { Request, Response } from 'express'
import { RequestHandler } from 'express'
import prisma from '../config/db'

// Create a new board
export const createBoard: RequestHandler = async (req, res) => {
  const { name, summary, userIds, ownerId } = req.body

  if (!name || !Array.isArray(userIds) || userIds.length === 0 || !ownerId) {
    res.status(400).json({ error: 'Board name, users, and owner are required.' })
    return
  }

  try {
    const board = await prisma.board.create({
      data: {
        name,
        summary,
        owner: { connect: { id: ownerId } },
        users: {
          connect: Array.from(new Set([...userIds, ownerId])).map((id: number) => ({ id }))
        }
      },
      include: {
        users: true,
        owner: true
      }
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

export const getAllBoardsForUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.userId)

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' })
    return
  }

  try {
    const boards = await prisma.board.findMany({
      where: {
        isDeleted: false, 
        users: {
          some: {
            id: userId
          }
        }
      },
      include: {
        users: true,
        columns: true,
        tasks: true,
        owner: true 
      }
    })

    res.json(boards)
  } catch (error) {
    console.error('❌ Error fetching boards for user:', error)
    res.status(500).json({ error: 'Failed to fetch boards' })
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

// Get a board by ID
export const getBoardById = async (req: Request, res: Response): Promise<void> => {
  const boardId = parseInt(req.params.boardId)

  if (isNaN(boardId)) {
    res.status(400).json({ error: 'Invalid board ID' })
    return
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        users: true,
        columns: {
          include: {
            tasks: true
          }
        },
        owner: true
      }
    })

    if (!board) {
      res.status(404).json({ error: 'Board not found' })
      return
    }

    res.json(board)
  } catch (error) {
    console.error('❌ Error fetching board:', error)
    res.status(500).json({ error: 'Failed to fetch board' })
  }
}

export const getUsersByBoardId = async (req: Request, res: Response): Promise<void> => {
  const boardId = parseInt(req.params.boardId)
  const query = (req.query.q as string)?.toLowerCase() || ''

  if (isNaN(boardId)) {
    res.status(400).json({ error: 'Invalid board ID' })
    return
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { users: true }
    })

    if (!board) {
      res.status(404).json({ error: 'Board not found' })
      return
    }

    const filteredUsers = board.users
      .filter(user => !user.isDeleted && user.username.toLowerCase().startsWith(query))
      .map(({ id, username, email }) => ({ id, username, email }))

    res.json(filteredUsers)
  } catch (error) {
    console.error('❌ Error fetching users for board:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// ✅ Remove Member from Board
export const removeMemberFromBoard: RequestHandler = async (req, res) => {
  const boardId = parseInt(req.params.boardId)
  const { userId } = req.body

  if (!userId || isNaN(boardId)) {
    res.status(400).json({ message: 'Invalid boardId or userId' })
    return
  }

  try {
    await prisma.board.update({
      where: { id: boardId },
      data: {
        users: {
          disconnect: { id: userId }
        }
      }
    })
    res.status(200).json({ message: 'User removed from board' })
  } catch (err) {
    console.error('Error removing user from board:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ✅ Soft Delete Board
export const softDeleteBoard: RequestHandler = async (req, res) => {
  const boardId = parseInt(req.params.boardId)

  if (isNaN(boardId)) {
    res.status(400).json({ message: 'Invalid boardId' })
    return
  }

  try {
    await prisma.board.update({
      where: { id: boardId },
      data: {
        isDeleted: true
      }
    })
    res.status(200).json({ message: 'Board soft deleted' })
  } catch (err) {
    console.error('Error soft deleting board:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
