import { PrismaClient } from '../../generated/prisma'
import {  Request, Response,RequestHandler } from 'express'
import bcrypt from 'bcrypt'


const prisma = new PrismaClient()

export const createUser = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  })
}

export const softDeleteUser = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  })
}

export const searchUsers = async (query: string) => {
    return prisma.user.findMany({
      where: {
        username: {
          startsWith: query,
          mode: 'insensitive',
        },
        isDeleted: false,
      },
    })
  }

export const verifyPassword = async (email: string, inputPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  const match = await bcrypt.compare(inputPassword, user.password)
  return match ? user : null

}

// PUT /api/users/:id/notifications
export const updateNotificationPreferences: RequestHandler = async (req, res) => {
  const userId = parseInt(req.params.id)
  const { notifyAssignedTasks, notifyTaskComments, notifyDueDates, notifyBoardInvites } = req.body

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        notifyAssignedTasks,
        notifyTaskComments,
        notifyDueDates,
        notifyBoardInvites
      }
    })

    res.json(updated)
  } catch (error) {
    console.error('Error updating preferences:', error)
    res.status(500).json({ error: 'Failed to update preferences' })
  }
}

export const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id)
  const { currentPassword, newPassword } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      res.status(400).json({ error: 'Current password is incorrect' })
      return
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    })

    res.json({ message: 'Password updated' })
  } catch (error) {
    console.error('Error updating password:', error)
    res.status(500).json({ error: 'Failed to update password' })
  }
}

